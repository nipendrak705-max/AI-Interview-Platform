import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import api from "../api/api";
import {
  FaUsers,
  FaFileAlt,
  FaChartLine,
  FaArrowLeft,
} from "react-icons/fa";

function AdminDashboard() {
  const navigate = useNavigate();

  const [data, setData] = useState({
    total_users: 0,
    total_interviews: 0,
    average_score: 0,
    recent_users: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAdminDashboard();
  }, []);

  const loadAdminDashboard = async () => {
    try {
      const response = await api.get("/admin/dashboard");
      setData(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="text-center text-xl mt-20">
          Loading admin dashboard...
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold">Admin Dashboard</h1>

          <p className="text-gray-500 mt-2">
            Manage users and monitor interview activity.
          </p>
        </div>

        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 bg-gray-700 text-white px-5 py-3 rounded-lg hover:bg-gray-800"
        >
          <FaArrowLeft />
          Back
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white shadow rounded-xl p-6">
          <FaUsers className="text-blue-600 text-4xl mb-4" />

          <p className="text-gray-500">Total Users</p>

          <h2 className="text-3xl font-bold">
            {data.total_users}
          </h2>
        </div>

        <div className="bg-white shadow rounded-xl p-6">
          <FaFileAlt className="text-purple-600 text-4xl mb-4" />

          <p className="text-gray-500">Total Interviews</p>

          <h2 className="text-3xl font-bold">
            {data.total_interviews}
          </h2>
        </div>

        <div className="bg-white shadow rounded-xl p-6">
          <FaChartLine className="text-green-600 text-4xl mb-4" />

          <p className="text-gray-500">Average Score</p>

          <h2 className="text-3xl font-bold">
            {Number(data.average_score || 0).toFixed(1)} / 10
          </h2>
        </div>
      </div>

      <div className="bg-white shadow rounded-xl p-6">
        <h2 className="text-2xl font-bold mb-6">
          Recent Users
        </h2>

        {data.recent_users.length === 0 ? (
          <p className="text-gray-500">
            No recent users found.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b text-left">
                  <th className="p-3">ID</th>
                  <th className="p-3">Name</th>
                  <th className="p-3">Email</th>
                </tr>
              </thead>

              <tbody>
                {data.recent_users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="p-3">{user.id}</td>
                    <td className="p-3">{user.name}</td>
                    <td className="p-3">{user.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default AdminDashboard;