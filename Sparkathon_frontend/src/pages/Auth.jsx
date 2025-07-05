import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

function Auth() {
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Only redirect to dashboard if on /auth and authenticated
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && location.pathname === "/auth") {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate, location]);

  const handleSignUp = async (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", {
        name,
        email,
        password,
      });
      alert(res.data.msg);
    } catch (err) {
      alert(err.response?.data?.msg || "Signup error");
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      localStorage.removeItem("token"); // Clear any invalid token
      alert(err.response?.data?.msg || "Login error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
        <div className="flex flex-col items-center mb-6">
          {/* Walmart logo - now using the provided PNG */}
          <img src="/walmart-logo.png" alt="Walmart" className="h-12 mb-4" />
          <h2 className="text-2xl font-bold text-blue-700 mb-2">
            {isSignUp ? "Create your Walmart Account" : "Sign in to Walmart"}
          </h2>
          <p className="text-gray-500 text-sm">
            {isSignUp
              ? "Enter your details to create your Walmart account."
              : "Enter your email and password to sign in."}
          </p>
        </div>
        <form
          onSubmit={isSignUp ? handleSignUp : handleSignIn}
          className="space-y-5"
        >
          {isSignUp && (
            <input
              className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="text"
              name="name"
              placeholder="Full Name"
              required
            />
          )}
          <input
            className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="email"
            name="email"
            placeholder="Email"
            required
          />
          <input
            className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="password"
            name="password"
            placeholder="Password"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors shadow-md mt-2"
          >
            {isSignUp ? "Create Account" : "Sign In"}
          </button>
        </form>
        <div className="flex flex-col items-center mt-6">
          <button
            className="text-blue-600 hover:text-blue-800 text-sm font-semibold focus:outline-none"
            onClick={() => setIsSignUp((prev) => !prev)}
          >
            {isSignUp
              ? "Already have an account? Sign in"
              : "New to Walmart? Create an account"}
          </button>
          {!isSignUp && (
            <a
              className="mt-4 text-blue-500 text-xs underline hover:text-blue-700 transition-colors"
              href="#"
            >
              Forgot your password?
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default Auth;
