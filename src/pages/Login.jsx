import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const { user, handleLogin } = useAuth();
  const [credentials, setCredentials] = useState({ email: "", password: "" });
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
      <div className="bg-[#1a2332] border border-gray-700 p-8 lg:p-10 rounded-2xl w-full max-w-md shadow-2xl">
        <h2 className="text-3xl font-bold mb-2 text-center text-white">
          Welcome! 👋
        </h2>
        <p className="text-gray-400 text-center mb-6">
          Login to continue chatting
        </p>

        <form
          onSubmit={(e) => {
            handleLogin(e, credentials);
          }}
        >
          <div className="mb-5">
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

          <div className="mb-6">
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

          <button
            type="submit"
            className="w-full p-3 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition duration-300 shadow-lg"
          >
            Login
          </button>
        </form>

        <p className="pt-4 text-center text-gray-400">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-blue-500 font-semibold hover:text-blue-400 transition duration-200"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};
export default Login;
