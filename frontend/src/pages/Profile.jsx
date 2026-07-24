import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../api/api";

function Profile() {

  const [user, setUser] = useState(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await api.get("/profile");
      setUser(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  if (!user) {
    return (
      <Layout>
        <h2 className="text-3xl text-center mt-20">
          Loading...
        </h2>
      </Layout>
    );
  }

  return (
    <Layout>

      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-10">

        <div className="flex items-center gap-6">

          <img
            src="https://ui-avatars.com/api/?name=Candidate"
            alt="profile"
            className="w-28 h-28 rounded-full"
          />

          <div>

            <h1 className="text-4xl font-bold">
              {user.name}
            </h1>

            <p className="text-gray-500 mt-2">
              {user.email}
            </p>

          </div>

        </div>

        <hr className="my-8"/>

        <div className="grid md:grid-cols-2 gap-8">

          <div className="bg-blue-50 rounded-xl p-6">

            <h2 className="text-xl font-bold mb-3">
              Candidate ID
            </h2>

            <p className="text-3xl">
              {user.id}
            </p>

          </div>

          <div className="bg-green-50 rounded-xl p-6">

            <h2 className="text-xl font-bold mb-3">
              Account Status
            </h2>

            <p className="text-3xl">
              Active
            </p>

          </div>

        </div>

      </div>

    </Layout>
  );
}

export default Profile;