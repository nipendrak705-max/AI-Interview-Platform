import {
    FaHome,
    FaUpload,
    FaHistory,
    FaChartBar
} from "react-icons/fa";

import { Link } from "react-router-dom";

function Sidebar() {

    return (

        <div className="w-64 h-screen bg-blue-700 text-white p-6">

            <h2 className="text-2xl font-bold mb-8">
                Dashboard
            </h2>

            <ul className="space-y-6">

                <li>
                    <Link to="/dashboard" className="flex items-center gap-3 hover:text-yellow-300">
                        <FaHome />
                        Dashboard
                    </Link>
                </li>

                <li>
                    <Link to="/upload" className="flex items-center gap-3 hover:text-yellow-300">
                        <FaUpload />
                        Upload Resume
                    </Link>
                </li>

                <li>
                    <Link to="/history" className="flex items-center gap-3 hover:text-yellow-300">
                        <FaHistory />
                        History
                    </Link>
                </li>

                <li>
                    <Link to="/report/1" className="flex items-center gap-3 hover:text-yellow-300">
                        <FaChartBar />
                        Reports
                    </Link>
                </li>

            </ul>

        </div>

    );

}

export default Sidebar;