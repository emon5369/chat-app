import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";

function Signup() {
  const { user, handleSignup } = useAuth();
  const [credentials, setCredentials] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user]);
  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  return (
    <div className="h-full flex items-center justify-center px-4">
      <div className="bg-[#1a2332] border border-gray-700 py-3 px-8 lg:px-10 rounded-2xl w-full max-w-md shadow-2xl">
        <h2 className="text-2xl font-bold mb-2 text-center text-white">
          Join Us! 🚀
        </h2>
        <p className="text-gray-400 text-center mb-6">
          Create an account to get started
        </p>

        <form
          onSubmit={(e) => {
            handleSignup(e, credentials);
          }}
        >
          <div className="mb-4">
            <label
              className="block mb-2 text-sm font-medium text-gray-300"
              htmlFor="name"
            >
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition duration-200 placeholder-gray-400"
              placeholder="Enter your name"
              value={credentials.name}
              onChange={handleOnChange}
              required
            />
          </div>

          <div className="mb-4">
            <label
              className="block mb-2 text-sm font-medium text-gray-300"
              htmlFor="email"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition duration-200 placeholder-gray-400"
              placeholder="Enter your email"
              value={credentials.email}
              onChange={handleOnChange}
              required
            />
          </div>

          <div className="mb-4">
            <label
              className="block mb-2 text-sm font-medium text-gray-300"
              htmlFor="password"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition duration-200 placeholder-gray-400"
              placeholder="Enter your password"
              value={credentials.password}
              onChange={handleOnChange}
              required
            />
          </div>

          <div className="mb-6">
            <label
              className="block mb-2 text-sm font-medium text-gray-300"
              htmlFor="confirmPassword"
            >
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition duration-200 placeholder-gray-400"
              placeholder="Confirm your password"
              value={credentials.confirmPassword}
              onChange={handleOnChange}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full p-3 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition duration-300 shadow-lg"
          >
            Sign up
          </button>
        </form>

        <p className="pt-4 text-center text-gray-400">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-500 font-semibold hover:text-blue-400 transition duration-200"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
