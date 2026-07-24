import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const register = async () => {
    try {
      await api.post("/register", {
        name,
        email,
        password,
      });

      alert("Registration Successful");
      navigate("/");
    } catch (err) {
      console.log(err);
      alert("Registration Failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 flex justify-center items-center">

      <div className="bg-white rounded-2xl shadow-2xl w-[450px] p-10">

        <h1 className="text-4xl font-bold text-center text-indigo-600">
          Create Account
        </h1>

        <p className="text-center text-gray-500 mt-2 mb-8">
          Join the AI Interview Platform
        </p>

        <input
          type="text"
          placeholder="Full Name"
          className="w-full border rounded-lg p-3 mb-4 focus:ring-2 focus:ring-indigo-500 outline-none"
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full border rounded-lg p-3 mb-4 focus:ring-2 focus:ring-indigo-500 outline-none"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border rounded-lg p-3 mb-6 focus:ring-2 focus:ring-indigo-500 outline-none"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={register}
          className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition"
        >
          Register
        </button>

        <button
          onClick={() => navigate("/")}
          className="w-full mt-4 border border-indigo-600 text-indigo-600 py-3 rounded-lg hover:bg-indigo-50 transition"
        >
          Back to Login
        </button>

      </div>

    </div>
  );
}

export default Register;