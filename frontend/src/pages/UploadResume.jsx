import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import Layout from "../components/Layout";
import Loading from "../components/Loading";
import { FaFileUpload, FaCheckCircle } from "react-icons/fa";

function UploadResume() {
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const uploadResume = async () => {
    if (!file) {
      alert("Please select a resume.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);

      const response = await api.post("/upload-resume", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setLoading(false);

      navigate("/interview", {
        state: {
          interviewId: response.data.interview_id,
          questions: response.data.questions,
          skills: response.data.skills,
        },
      });
    } catch (err) {
      console.log(err);
      setLoading(false);
      alert("Upload Failed");
    }
  };

  return (
    <Layout>
     {loading && <Loading />}

      <div className="max-w-3xl mx-auto">

        <div className="bg-white rounded-2xl shadow-xl p-10">

          <h1 className="text-4xl font-bold text-center mb-3">
            Upload Resume
          </h1>

          <p className="text-gray-500 text-center mb-8">
            Upload your resume to generate personalized AI interview questions.
          </p>

          <div className="border-2 border-dashed border-blue-400 rounded-xl p-10 text-center">

            <FaFileUpload className="text-6xl text-blue-600 mx-auto mb-5" />

            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setFile(e.target.files[0])}
              className="mb-4"
            />

            {file && (
              <p className="text-green-600 flex justify-center items-center gap-2">
                <FaCheckCircle />
                {file.name}
              </p>
            )}

          </div>

          <button
            onClick={uploadResume}
            className="mt-8 w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
          >
            {loading ? "Uploading..." : "Generate AI Interview"}
          </button>

        </div>
      </div>
    </Layout>
  );
}

export default UploadResume;