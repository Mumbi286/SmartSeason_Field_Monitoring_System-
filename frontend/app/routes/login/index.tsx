import { useState } from "react";
import type { FormEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useAppContext } from "~/context/AppContext";

const LoginPage = () => {
  const { currentUser, login, isHydrated } = useAppContext();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  if (!isHydrated) {
    return <section className="text-slate-200">Loading...</section>;
  }

  if (currentUser) {
    // If already authenticated, skip login page and go straight to dashboard.
    return <Navigate to="/dashboard" replace />;
  }

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const result = await login(email, password);
    if (!result.success) {
      setError(result.message ?? "Invalid email or password.");
      return;
    }
    navigate("/dashboard");
  };

  return (
    <section className="max-w-xl mx-auto bg-slate-900 border border-slate-800 rounded-lg p-6 space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-green-300">Log In</h1>
        <p className="text-sm text-slate-300 mt-1">Use your email and password to access the dashboard.</p>
      </div>

      <form className="space-y-4" onSubmit={handleLogin}>
        <label className="block space-y-2 text-sm">
          <span>Email</span>
          <input
            required
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2"
            placeholder="you@example.com"
          />
        </label>

        <label className="block space-y-2 text-sm">
          <span>Password</span>
          <div className="relative">
            <input
              required
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 pr-11"
              placeholder="Enter password"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute inset-y-0 right-0 px-3 text-slate-300 hover:text-slate-100"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </label>

        {error && <p className="text-red-300 text-sm">{error}</p>}

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition"
        >
          Log In
        </button>
      </form>

      <article className="bg-slate-900 border border-slate-800 rounded-lg p-4">
        <p className="text-xs text-slate-300">
          Admin example: <span className="text-slate-100"> wekesa@smartseason.com/ 1234567</span>
        </p>
        <p className="text-xs text-slate-300">
          Agent example: <span className="text-slate-100">edkamau@smartseason.com /1234567 </span>
        </p>
      </article>

      <p className="text-xs text-slate-300">
        Do not have an account?{" "}
        <Link className="text-green-300 hover:text-green-200 underline" to="/signup">
          Sign up
        </Link>
      </p>
    </section>
  );
};

export default LoginPage;