import { FaUserCircle } from "react-icons/fa";

function Navbar() {
  return (
    <nav className="bg-white shadow-md px-8 py-4 flex justify-between items-center">

      <h1 className="text-2xl font-bold text-blue-600">
        AI Interview Platform
      </h1>

      <div className="flex items-center gap-3">
        <FaUserCircle size={30} className="text-gray-600" />

        <span className="font-medium">
          Candidate
        </span>
      </div>

    </nav>
  );
}

export default Navbar;