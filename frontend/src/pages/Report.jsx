import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/api";
import Layout from "../components/Layout";
import { generatePDF } from "../utils/pdfGenerator";

import {
  CircularProgressbar,
  buildStyles,
} from "react-circular-progressbar";

import "react-circular-progressbar/dist/styles.css";

function Report() {
  const { sessionId } = useParams();
  const navigate = useNavigate();

  const [report, setReport] = useState(null);

  useEffect(() => {
    loadReport();
  }, []);

  const loadReport = async () => {
    try {
      const response = await api.get(`/interview-report/${sessionId}`);
      console.log(response.data);
      setReport(response.data);
    } catch (err) {
      console.log(err);
      alert("Failed to load report");
    }
  };

  if (!report) {
    return (
      <Layout>
        <h2 className="text-3xl text-center mt-20">
          Loading Report...
        </h2>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">

        <h1 className="text-4xl font-bold text-center mb-10">
          AI Interview Report
        </h1>

        {/* Summary */}

        <div className="bg-white rounded-xl shadow-lg p-8 mb-10">

          <div className="grid md:grid-cols-2 gap-10 items-center">

            <div>

              <h2 className="text-2xl font-bold mb-5">
                Interview Summary
              </h2>

              <p className="mb-3">
                <b>Interview ID:</b> {report.session_id}
              </p>

              <p className="mb-3">
                <b>Candidate ID:</b> {report.candidate_id}
              </p>

              <p className="mb-3">
                <b>Total Questions:</b> {report.total_questions}
              </p>

              <p className="mb-3">
                <b>Skills:</b>
              </p>

              <div className="flex flex-wrap gap-2 mt-2">
                {JSON.parse(report.skills).map((skill, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>

            </div>

            <div className="w-56 mx-auto">

              <CircularProgressbar
                value={report.average_score * 10}
                text={`${report.average_score}/10`}
                styles={buildStyles({
                  textSize: "14px",
                  pathColor: "#2563eb",
                  trailColor: "#d1d5db",
                  textColor: "#111827",
                })}
              />

              <h3 className="text-center mt-5 text-xl font-bold">
                Average Score
              </h3>

            </div>

          </div>

        </div>

        {/* Questions */}

        <h2 className="text-3xl font-bold mb-6">
          Question-wise Evaluation
        </h2>

        {report.answers.map((item) => (

          <div
            key={item.id}
            className={`rounded-xl shadow-lg p-6 mb-8 ${
              item.score >= 8
                ? "bg-green-50 border border-green-300"
                : item.score >= 5
                ? "bg-yellow-50 border border-yellow-300"
                : "bg-red-50 border border-red-300"
            }`}
          >

            <h2 className="text-xl font-bold mb-4">
              Question {item.question_number}
            </h2>

            <div className="mb-5">

              <h3 className="font-semibold text-blue-700">
                Question
              </h3>

              <p>{item.question}</p>

            </div>

            <div className="mb-5">

              <h3 className="font-semibold text-green-700">
                Your Answer
              </h3>

              <p className="whitespace-pre-wrap">
                {item.answer}
              </p>

            </div>

            <div className="mb-5">

              <h3 className="font-semibold text-purple-700">
                Score
              </h3>

              <p className="text-lg font-bold">
                {"⭐".repeat(Math.max(1, Math.round(item.score / 2)))}
                &nbsp; {item.score}/10
              </p>

            </div>

            <div>

              <h3 className="font-semibold text-red-700">
                AI Feedback
              </h3>

              <pre className="whitespace-pre-wrap bg-white rounded-lg p-4 mt-2">
                {item.feedback}
              </pre>

            </div>

          </div>

        ))}

        {/* Action Buttons */}

        <div className="flex justify-center gap-5 mt-10 mb-10">

          <button
            onClick={() => generatePDF(report)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold shadow-lg transition"
          >
            📄 Download PDF
          </button>

          <button
            onClick={() => navigate("/dashboard")}
            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold shadow-lg transition"
          >
            ← Back to Dashboard
          </button>

        </div>

      </div>
    </Layout>
  );
}

export default Report;