import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const login = async () => {
    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/login", {
        email,
        password,
      });

      if (!res.data.access_token) {
        localStorage.removeItem("token");
        alert(res.data.message || "Login Failed");
        return;
      }

      localStorage.setItem("token", res.data.access_token);

      alert("Login Successful");

      navigate("/dashboard");
    } catch (err) {
      localStorage.removeItem("token");
      alert(err.response?.data?.detail || "Login Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 flex justify-center items-center">
      <div className="bg-white shadow-2xl rounded-2xl w-[420px] p-10">
        <h1 className="text-4xl font-bold text-center text-indigo-600">
          AI Interview Platform
        </h1>

        <p className="text-center text-gray-500 mt-2 mb-8">
          Login to continue
        </p>

        <input
          type="email"
          placeholder="Email"
          value={email}
          className="w-full border rounded-lg p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          className="w-full border rounded-lg p-3 mb-6 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={login}
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <button
          onClick={() => navigate("/register")}
          className="w-full mt-4 border border-indigo-600 text-indigo-600 py-3 rounded-lg hover:bg-indigo-50 transition"
        >
          Create New Account
        </button>
      </div>
    </div>
  );
}

export default Login;