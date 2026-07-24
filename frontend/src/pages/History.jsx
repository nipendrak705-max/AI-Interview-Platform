import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import api from "../api/api";

function History() {
  const navigate = useNavigate();

  const [interviews, setInterviews] = useState([]);
  const [search, setSearch] = useState("");
  const [scoreFilter, setScoreFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInterviews();
  }, []);

  const loadInterviews = async () => {
    try {
      const response = await api.get("/my-interviews");
      setInterviews(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredInterviews = interviews.filter((interview) => {
    const skills = Array.isArray(interview.skills)
      ? interview.skills.join(" ")
      : interview.skills || "";

    const matchesSearch =
      skills.toLowerCase().includes(search.toLowerCase()) ||
      String(interview.session_id || "")
        .toLowerCase()
        .includes(search.toLowerCase());

    const score = Number(interview.average_score || 0);

    let matchesScore = true;

    if (scoreFilter === "high") {
      matchesScore = score >= 8;
    } else if (scoreFilter === "medium") {
      matchesScore = score >= 5 && score < 8;
    } else if (scoreFilter === "low") {
      matchesScore = score < 5;
    }

    return matchesSearch && matchesScore;
  });

  return (
    <Layout>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-bold">Interview History</h1>

          <p className="text-gray-500 mt-2">
            Search and review your previous interviews.
          </p>
        </div>

        <button
          onClick={() => navigate("/upload")}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Start New Interview
        </button>
      </div>

      <div className="bg-white rounded-xl shadow p-6 mb-8">
        <div className="grid md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Search by skill or session ID"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          />

          <select
            value={scoreFilter}
            onChange={(event) => setScoreFilter(event.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All scores</option>
            <option value="high">High: 8 to 10</option>
            <option value="medium">Medium: 5 to 7.9</option>
            <option value="low">Low: Below 5</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center text-xl py-16">Loading interviews...</div>
      ) : filteredInterviews.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-10 text-center">
          <h2 className="text-2xl font-bold mb-2">No interviews found</h2>

          <p className="text-gray-500">
            Try changing the search text or score filter.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredInterviews.map((interview) => (
            <div
              key={interview.session_id}
              className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition"
            >
              <div className="flex justify-between items-start gap-4">
                <div>
                  <p className="text-sm text-gray-500">Session</p>

                  <h2 className="text-xl font-bold">
                    #{interview.session_id}
                  </h2>
                </div>

                <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-bold">
                  {Number(interview.average_score || 0).toFixed(1)} / 10
                </div>
              </div>

              <div className="mt-6">
                <p className="text-sm text-gray-500 mb-2">Skills</p>

                <div className="flex flex-wrap gap-2">
                  {Array.isArray(interview.skills) ? (
                    interview.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                      {interview.skills || "Not available"}
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-6 flex justify-between text-sm text-gray-500">
                <span>
                  Questions: {interview.total_questions || 0}
                </span>

                <span>
                  Answers: {interview.total_answers || 0}
                </span>
              </div>

              <button
                onClick={() =>
                  navigate(`/report/${interview.session_id}`)
                }
                className="w-full mt-6 bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition"
              >
                View Report
              </button>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}

export default History;