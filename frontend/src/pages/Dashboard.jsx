import { useEffect, useState } from "react";
import api from "../api/api";
import Layout from "../components/Layout";
import { useNavigate } from "react-router-dom";
import {
  FaUpload,
  FaHistory,
  FaRobot,
  FaSignOutAlt,
  FaUserGraduate,
  FaChartLine,
  FaFileAlt,
  FaBrain,
  FaUser,
  FaChartBar,
  FaUserShield
} from "react-icons/fa";
import ScoreChart from "../components/ScoreChart";

function Dashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    average_score: 0,
    total_interviews: 0,
    total_answers: 0,
  });

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const response = await api.get("/dashboard");
      setStats(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <Layout>
      <h1 className="text-4xl font-bold mb-2">Welcome 👋</h1>

      <p className="text-gray-500 mb-8">
        AI Powered Interview Preparation Platform
      </p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-white rounded-xl shadow p-6">
          <FaUserGraduate className="text-blue-600 text-4xl mb-4" />

          <h3 className="text-gray-500">Answers Submitted</h3>

          <p className="text-2xl font-bold">{stats.total_answers}</p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <FaChartLine className="text-green-600 text-4xl mb-4" />

          <h3 className="text-gray-500">Average Score</h3>

          <p className="text-2xl font-bold">
            {Number(stats.average_score || 0).toFixed(1)} / 10
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <FaFileAlt className="text-purple-600 text-4xl mb-4" />

          <h3 className="text-gray-500">Interviews</h3>

          <p className="text-2xl font-bold">{stats.total_interviews}</p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <FaBrain className="text-pink-600 text-4xl mb-4" />

          <h3 className="text-gray-500">AI Status</h3>

          <p className="text-2xl font-bold">Ready</p>
        </div>
      </div>

      <h2 className="text-3xl font-bold mb-6">Quick Actions</h2>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8 mb-10">
        <div
          onClick={() => navigate("/upload")}
          className="bg-blue-600 text-white p-8 rounded-xl shadow-lg cursor-pointer hover:scale-105 transition"
        >
          <FaUpload size={40} />

          <h2 className="text-2xl font-bold mt-4">Upload Resume</h2>

          <p className="mt-2">
            Upload your resume and generate interview questions.
          </p>
        </div>

        <div
          onClick={() => navigate("/history")}
          className="bg-green-600 text-white p-8 rounded-xl shadow-lg cursor-pointer hover:scale-105 transition"
        >
          <FaHistory size={40} />

          <h2 className="text-2xl font-bold mt-4">Interview History</h2>

          <p className="mt-2">
            View all your previous interview reports.
          </p>
        </div>

        <div
          onClick={() => navigate("/analytics")}
          className="bg-orange-600 text-white p-8 rounded-xl shadow-lg cursor-pointer hover:scale-105 transition"
        >
          <FaChartBar size={40} />

          <h2 className="text-2xl font-bold mt-4">Analytics</h2>

          <p className="mt-2">
            View performance charts and interview statistics.
          </p>
        </div>

        <div
          onClick={() => navigate("/profile")}
          className="bg-indigo-600 text-white p-8 rounded-xl shadow-lg cursor-pointer hover:scale-105 transition"
        >
          <FaUser size={40} />

          <h2 className="text-2xl font-bold mt-4">Profile</h2>

          <p className="mt-2">View your account details.</p>
        </div>

        <div
          onClick={() => navigate("/history")}
          className="bg-purple-600 text-white p-8 rounded-xl shadow-lg cursor-pointer hover:scale-105 transition"
        >
          <FaRobot size={40} />

          <h2 className="text-2xl font-bold mt-4">AI Reports</h2>

          <p className="mt-2">
            Open your interview history and select a report.
          </p>
        </div>

        <div
  onClick={() => navigate("/admin")}
  className="bg-gray-800 text-white p-8 rounded-xl shadow-lg cursor-pointer hover:scale-105 transition"
>
  <FaUserShield size={40} />

  <h2 className="text-2xl font-bold mt-4">
    Admin Dashboard
  </h2>

  <p className="mt-2">
    View users and platform statistics.
  </p>
</div>


        <div
          onClick={logout}
          className="bg-red-600 text-white p-8 rounded-xl shadow-lg cursor-pointer hover:scale-105 transition"
        >
          <FaSignOutAlt size={40} />

          <h2 className="text-2xl font-bold mt-4">Logout</h2>

          <p className="mt-2">Sign out from your account.</p>
        </div>
      </div>

      <ScoreChart />
    </Layout>
  );
}

export default Dashboard;