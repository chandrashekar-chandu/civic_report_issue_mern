import { Link } from "react-router-dom";

const Unauthorized = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-teal-950 flex items-center justify-center p-6">
      <div className="max-w-xl w-full bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-10 text-center">
        {/* 403 Number */}
        <h1 className="text-7xl md:text-8xl font-extrabold bg-gradient-to-r from-orange-400 to-yellow-300 bg-clip-text text-transparent mb-4">
          403
        </h1>

        {/* Title */}
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Unauthorized Access
        </h2>

        {/* Description */}
        <p className="text-slate-300 text-lg leading-8 mb-8">
          You do not have permission to access this page.
          Please log in with an account that has the required role.
        </p>

        {/* Button */}
        <Link
          to="/login"
          className="inline-block px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold shadow-lg transition duration-300"
        >
          Go to Login
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;