import { useLocation, useNavigate } from "react-router-dom";
import {
  useCallback,
  useEffect,
  useRef,
  useState
} from "react";
import {
  FaClock,
  FaMicrophone,
  FaPaperPlane,
  FaStop,
  FaTrash,
  FaVolumeUp
} from "react-icons/fa";
import api from "../api/api";
import Layout from "../components/Layout";
import Loading from "../components/Loading";

function Interview() {
  const navigate = useNavigate();
  const location = useLocation();

  const questions = location.state?.questions || [];
  const sessionId = location.state?.interviewId;

  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [evaluation, setEvaluation] = useState("");
  const [loading, setLoading] = useState(false);

  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [microphoneError, setMicrophoneError] = useState("");
  const [timeLeft, setTimeLeft] = useState(120);

  const recognitionRef = useRef(null);
  const finalTranscriptRef = useRef("");
  const timerRef = useRef(null);
  const nextQuestionTimeoutRef = useRef(null);
  const submittingRef = useRef(false);

  const currentQuestion = questions[index] || "";

  const progress =
    questions.length > 0
      ? ((index + 1) / questions.length) * 100
      : 0;

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  };

  const stopQuestionVoice = useCallback(() => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }

    setIsSpeaking(false);
  }, []);

  const speakQuestion = useCallback(() => {
    if (!currentQuestion.trim()) {
      return;
    }

    if (!("speechSynthesis" in window)) {
      alert("Text-to-speech is not supported in this browser.");
      return;
    }

    window.speechSynthesis.cancel();

    const speech = new SpeechSynthesisUtterance(currentQuestion);

    speech.lang = "en-IN";
    speech.rate = 0.9;
    speech.pitch = 1;
    speech.volume = 1;

    speech.onstart = () => {
      setIsSpeaking(true);
    };

    speech.onend = () => {
      setIsSpeaking(false);
    };

    speech.onerror = () => {
      setIsSpeaking(false);
    };

    window.speechSynthesis.speak(speech);
  }, [currentQuestion]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (error) {
        console.log(error);
      }

      recognitionRef.current = null;
    }

    setIsListening(false);
  }, []);

  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechSupported(false);

      alert(
        "Voice recognition is not supported in this browser. Please use Chrome or Edge."
      );

      return;
    }

    stopQuestionVoice();
    stopListening();

    setMicrophoneError("");

    const recognition = new SpeechRecognition();

    recognition.lang = "en-IN";
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    finalTranscriptRef.current = answer.trim();

    recognition.onstart = () => {
      setIsListening(true);
      setMicrophoneError("");
    };

    recognition.onresult = (event) => {
      let completedText = "";
      let temporaryText = "";

      for (
        let resultIndex = event.resultIndex;
        resultIndex < event.results.length;
        resultIndex++
      ) {
        const transcript =
          event.results[resultIndex][0].transcript;

        if (event.results[resultIndex].isFinal) {
          completedText += transcript;
        } else {
          temporaryText += transcript;
        }
      }

      if (completedText.trim()) {
        finalTranscriptRef.current = [
          finalTranscriptRef.current,
          completedText.trim()
        ]
          .filter(Boolean)
          .join(" ")
          .trim();
      }

      const fullAnswer = [
        finalTranscriptRef.current,
        temporaryText.trim()
      ]
        .filter(Boolean)
        .join(" ")
        .trim();

      setAnswer(fullAnswer);
    };

    recognition.onerror = (event) => {
      setIsListening(false);

      let errorMessage =
        "Voice recognition failed. Please try again.";

      if (event.error === "not-allowed") {
        errorMessage =
          "Microphone permission was denied. Please allow microphone access.";
      } else if (event.error === "no-speech") {
        errorMessage =
          "No speech was detected. Please speak clearly and try again.";
      } else if (event.error === "audio-capture") {
        errorMessage =
          "No microphone was detected on this device.";
      } else if (event.error === "network") {
        errorMessage =
          "A network error occurred during voice recognition.";
      }

      setMicrophoneError(errorMessage);
    };

    recognition.onend = () => {
      setIsListening(false);
      recognitionRef.current = null;
    };

    recognitionRef.current = recognition;

    try {
      recognition.start();
    } catch (error) {
      console.log(error);
      setIsListening(false);
      setMicrophoneError(
        "The microphone is already active. Please try again."
      );
    }
  };

  const clearAnswer = () => {
    stopListening();
    finalTranscriptRef.current = "";
    setAnswer("");
    setMicrophoneError("");
  };

  const moveToNextQuestion = useCallback(() => {
    stopListening();
    stopQuestionVoice();

    setAnswer("");
    setEvaluation("");
    setMicrophoneError("");
    finalTranscriptRef.current = "";
    setTimeLeft(120);

    setIndex((previousIndex) => previousIndex + 1);
  }, [stopListening, stopQuestionVoice]);

  const submitAnswer = useCallback(
    async (automaticSubmission = false) => {
      if (submittingRef.current || loading) {
        return;
      }

      if (answer.trim() === "") {
        if (automaticSubmission) {
          alert(
            "Time is over. No answer was provided for this question."
          );

          if (index < questions.length - 1) {
            moveToNextQuestion();
          } else {
            alert("Interview Completed!");
            navigate(`/report/${sessionId}`);
          }
        } else {
          alert(
            "Please type your answer or use the microphone before submitting."
          );
        }

        return;
      }

      submittingRef.current = true;

      stopListening();
      stopQuestionVoice();

      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      setLoading(true);

      try {
        const response = await api.post("/submit-answer", {
          session_id: sessionId,
          question_number: index + 1,
          question: currentQuestion,
          answer: answer.trim()
        });

        setEvaluation(response.data.last_feedback || "");

        if (index < questions.length - 1) {
          nextQuestionTimeoutRef.current = setTimeout(() => {
            submittingRef.current = false;
            moveToNextQuestion();
          }, 3000);
        } else {
          submittingRef.current = false;

          setTimeout(() => {
            alert("Interview Completed!");
            navigate(`/report/${sessionId}`);
          }, 3000);
        }
      } catch (error) {
        console.log(error);

        submittingRef.current = false;

        alert(
          error.response?.data?.detail ||
            "Submission Failed"
        );
      } finally {
        setLoading(false);
      }
    },
    [
      answer,
      currentQuestion,
      index,
      loading,
      moveToNextQuestion,
      navigate,
      questions.length,
      sessionId,
      stopListening,
      stopQuestionVoice
    ]
  );

  useEffect(() => {
    if (!sessionId || questions.length === 0) {
      alert(
        "Interview questions were not found. Please upload your resume again."
      );

      navigate("/upload-resume");
    }
  }, [navigate, questions.length, sessionId]);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechSupported(false);
    }
  }, []);

  useEffect(() => {
    if (!currentQuestion) {
      return;
    }

    const speechTimeout = setTimeout(() => {
      speakQuestion();
    }, 600);

    return () => {
      clearTimeout(speechTimeout);
      stopQuestionVoice();
    };
  }, [currentQuestion, speakQuestion, stopQuestionVoice]);

  useEffect(() => {
    if (!currentQuestion || evaluation || loading) {
      return;
    }

    setTimeLeft(120);

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((previousTime) => {
        if (previousTime <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }

        return previousTime - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [index, currentQuestion, evaluation, loading]);

  useEffect(() => {
    if (
      timeLeft === 0 &&
      !loading &&
      !evaluation &&
      !submittingRef.current
    ) {
      submitAnswer(true);
    }
  }, [timeLeft, loading, evaluation, submitAnswer]);

  useEffect(() => {
    return () => {
      stopListening();
      stopQuestionVoice();

      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      if (nextQuestionTimeoutRef.current) {
        clearTimeout(nextQuestionTimeoutRef.current);
      }
    };
  }, [stopListening, stopQuestionVoice]);

  if (!sessionId || questions.length === 0) {
    return null;
  }

  return (
    <Layout>
      {loading && <Loading />}

      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-xl shadow-xl p-8">
          <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                AI Technical Interview
              </h1>

              <p className="text-gray-500">
                Question {index + 1} of {questions.length}
              </p>
            </div>

            <div
              className={`flex items-center gap-2 px-5 py-3 rounded-lg font-bold ${
                timeLeft <= 30
                  ? "bg-red-100 text-red-700"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              <FaClock />
              {formatTime(timeLeft)}
            </div>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-3 mb-8">
            <div
              className="bg-blue-600 h-3 rounded-full transition-all duration-500"
              style={{
                width: `${progress}%`
              }}
            />
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-600 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-3">
              AI Interviewer
            </h2>

            <p className="text-lg leading-relaxed">
              {currentQuestion}
            </p>

            <div className="flex flex-wrap gap-3 mt-5">
              <button
                type="button"
                onClick={speakQuestion}
                disabled={isSpeaking || loading}
                className="flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaVolumeUp />

                {isSpeaking
                  ? "Question Speaking..."
                  : "Listen Again"}
              </button>

              {isSpeaking && (
                <button
                  type="button"
                  onClick={stopQuestionVoice}
                  className="flex items-center gap-2 bg-gray-700 text-white px-5 py-3 rounded-lg hover:bg-gray-800 transition"
                >
                  <FaStop />
                  Stop Question
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-wrap justify-between items-center gap-3 mb-3">
            <label
              htmlFor="candidate-answer"
              className="text-lg font-semibold"
            >
              Your Answer
            </label>

            <div
              className={`px-4 py-2 rounded-full text-sm font-semibold ${
                isListening
                  ? "bg-red-100 text-red-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {isListening ? "● Listening..." : "Ready"}
            </div>
          </div>

          <textarea
            id="candidate-answer"
            rows={10}
            value={answer}
            disabled={loading || Boolean(evaluation)}
            onChange={(event) => {
              const value = event.target.value;

              setAnswer(value);
              finalTranscriptRef.current = value;
            }}
            placeholder="Type your answer here or click Start Speaking..."
            className="w-full border rounded-lg p-4 focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100"
          />

          <p className="text-sm text-gray-500 mt-2">
            You can type your answer, speak your answer or edit
            voice-generated text before submitting.
          </p>

          {microphoneError && (
            <div className="mt-4 bg-red-50 border-l-4 border-red-500 rounded-lg p-4 text-red-700">
              {microphoneError}
            </div>
          )}

          {!speechSupported && (
            <div className="mt-4 bg-yellow-50 border-l-4 border-yellow-500 rounded-lg p-4 text-yellow-800">
              Voice recognition is unavailable in this browser.
              You can still type your answer manually.
            </div>
          )}

          {isListening && (
            <div className="mt-5 bg-red-50 border border-red-200 rounded-xl p-5">
              <div className="flex items-center gap-3 text-red-700 font-semibold">
                <FaMicrophone className="animate-pulse" />
                Microphone is listening. Start speaking clearly.
              </div>

              <div className="flex justify-center items-end gap-2 h-12 mt-4">
                <span className="w-2 h-4 bg-red-500 rounded animate-pulse" />
                <span className="w-2 h-9 bg-red-500 rounded animate-pulse" />
                <span className="w-2 h-6 bg-red-500 rounded animate-pulse" />
                <span className="w-2 h-11 bg-red-500 rounded animate-pulse" />
                <span className="w-2 h-5 bg-red-500 rounded animate-pulse" />
                <span className="w-2 h-8 bg-red-500 rounded animate-pulse" />
              </div>
            </div>
          )}

          {!evaluation && (
            <div className="flex flex-wrap gap-4 mt-6">
              {!isListening ? (
                <button
                  type="button"
                  onClick={startListening}
                  disabled={
                    !speechSupported ||
                    loading ||
                    Boolean(evaluation)
                  }
                  className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaMicrophone />
                  Start Speaking
                </button>
              ) : (
                <button
                  type="button"
                  onClick={stopListening}
                  className="flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition"
                >
                  <FaStop />
                  Stop Recording
                </button>
              )}

              <button
                type="button"
                onClick={clearAnswer}
                disabled={loading}
                className="flex items-center gap-2 bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition disabled:opacity-50"
              >
                <FaTrash />
                Clear Answer
              </button>

              <button
                type="button"
                onClick={() => submitAnswer(false)}
                disabled={loading || answer.trim() === ""}
                className="flex flex-1 justify-center items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaPaperPlane />

                {loading
                  ? "AI is Evaluating..."
                  : "Submit Answer"}
              </button>
            </div>
          )}

          {timeLeft === 0 && !evaluation && (
            <p className="mt-4 text-red-600 font-semibold">
              Time is over. Your answer is being submitted
              automatically.
            </p>
          )}

          {evaluation && (
            <div className="mt-8 bg-green-50 border-l-4 border-green-500 rounded-lg p-5">
              <h2 className="text-xl font-bold mb-3">
                AI Feedback
              </h2>

              <pre className="whitespace-pre-wrap font-sans">
                {evaluation}
              </pre>

              {index < questions.length - 1 && (
                <p className="mt-4 text-sm font-semibold text-green-700">
                  The next question will appear automatically.
                </p>
              )}

              {index === questions.length - 1 && (
                <p className="mt-4 text-sm font-semibold text-green-700">
                  Interview completed. Opening your report...
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default Interview;