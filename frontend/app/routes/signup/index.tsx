import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router";
import { useAppContext } from "~/context/AppContext";
import type { UserRole } from "~/context/AppContext";

const SignupPage = () => {
  const { currentUser, isHydrated, registerUser } = useAppContext();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const roleParam = searchParams.get("role");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("agent");
  const [error, setError] = useState("");

  // If a role is provided in URL query (?role=admin|agent), preselect it in the form.
  useEffect(() => {
    if (roleParam === "admin" || roleParam === "agent") {
      setRole(roleParam);
    }
  }, [roleParam]);

  if (!isHydrated) {
    return <section className="text-slate-200">Loading...</section>;
  }

  if (currentUser) {
    // Prevent signed-in users from creating duplicate sessions via signup page.
    return <Navigate to="/dashboard" replace />;
  }

  // Creates a user account, then signs in and redirects to dashboard on success.
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const result = await registerUser({
      name,
      email,
      password,
      role,
    });

    if (!result.success) {
      setError(result.message ?? "Unable to create account.");
      return;
    }

    navigate("/dashboard");
  };

  return (
    <section className="max-w-xl mx-auto bg-slate-900 border border-slate-800 rounded-lg p-6 space-y-4">
      {/* Signup page heading and context */}
      <div>
        <h1 className="text-2xl font-bold text-green-300">Create Account</h1>
        <p className="text-sm text-slate-300 mt-1">Create an account today!</p>
      </div>

      {/* Signup form for new Admin/Field Agent accounts */}
      <form className="space-y-4" onSubmit={handleSubmit}>
        <label className="block space-y-2 text-sm">
          <span>Full Name</span>
          <input
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2"
          />
        </label>

        <label className="block space-y-2 text-sm">
          <span>Email</span>
          <input
            required
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2"
          />
        </label>

        <label className="block space-y-2 text-sm">
          <span>Password</span>
          <input
            required
            minLength={6}
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2"
          />
        </label>

        <label className="block space-y-2 text-sm">
          <span>Are you signing up as an admin or an agent?</span>
          <select
            value={role}
            onChange={(event) => setRole(event.target.value as UserRole)}
            className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2"
          >
            <option value="admin">Admin</option>
            <option value="agent">Agent</option>
          </select>
        </label>

        {error && <p className="text-sm text-red-300">{error}</p>}

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition"
        >
          Create Account and Continue
        </button>
      </form>

      {/* Quick navigation for existing users */}
      <p className="text-xs text-slate-300">
        Already have an account?{" "}
        <Link className="text-green-300 hover:text-green-200 underline" to="/login">
          Go to Login
        </Link>
      </p>
    </section>
  );
};

export default SignupPage;