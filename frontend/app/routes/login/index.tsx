import { useState } from "react";
import type { FormEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router";
import { useAppContext } from "~/context/AppContext";

const LoginPage = () => {
  const { currentUser, login, isHydrated, users } = useAppContext();
  const navigate = useNavigate();
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [agentEmail, setAgentEmail] = useState("");
  const [agentPassword, setAgentPassword] = useState("");
  const [adminError, setAdminError] = useState("");
  const [agentError, setAgentError] = useState("");

  if (!isHydrated) {
    return <section className="text-slate-200">Loading...</section>;
  }

  if (currentUser) {
    // If already authenticated, skip login page and go straight to dashboard.
    return <Navigate to="/dashboard" replace />;
  }

  // Shared submit handler for both role cards.
  // It validates that the email belongs to the selected role before signing in.
  const handleRoleLogin = (
    event: FormEvent<HTMLFormElement>,
    role: "admin" | "agent",
    email: string,
    password: string
  ) => {
    event.preventDefault();

    if (role === "admin") setAdminError("");
    if (role === "agent") setAgentError("");

    const targetUser = users.find(
      (user) => user.email.toLowerCase() === email.toLowerCase().trim()
    );

    if (!targetUser || targetUser.role !== role) {
      const roleLabel = role === "admin" ? "admin" : "field agent";
      const message = `No ${roleLabel} account found with these credentials.`;
      if (role === "admin") setAdminError(message);
      if (role === "agent") setAgentError(message);
      return;
    }

    const success = login(email, password);
    if (!success) {
      if (role === "admin") setAdminError("Invalid password for this admin account.");
      if (role === "agent") setAgentError("Invalid password for this field agent account.");
      return;
    }
    navigate("/dashboard");
  };

  return (
    <section className="max-w-5xl mx-auto space-y-4">
      {/* Login role chooser section */}
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Choose Login Role</h1>
        <p className="text-sm text-slate-300 mt-1">
          Use the card that matches your account type.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Admin login card */}
        <article className="bg-slate-900 border border-slate-800 rounded-lg p-5">
          <h2 className="text-xl font-semibold text-green-300 mb-3">Log in as Admin</h2>
          <form className="space-y-3" onSubmit={(event) => handleRoleLogin(event, "admin", adminEmail, adminPassword)}>
            <label className="block space-y-2 text-sm">
              <span>Email</span>
              <input
                required
                type="email"
                value={adminEmail}
                onChange={(event) => setAdminEmail(event.target.value)}
                className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2"
                placeholder="admin@smartseason.test"
              />
            </label>
            <label className="block space-y-2 text-sm">
              <span>Password</span>
              <input
                required
                type="password"
                value={adminPassword}
                onChange={(event) => setAdminPassword(event.target.value)}
                className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2"
                placeholder="Enter password"
              />
            </label>
            {adminError && <p className="text-red-300 text-sm">{adminError}</p>}
            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition"
            >
              Log In as Admin
            </button>
          </form>
          <p className="text-xs text-slate-300 mt-3">
            {/* Signup path for users who want an Admin account */}
            New admin user?{" "}
            <Link className="text-green-300 hover:text-green-200 underline" to="/signup?role=admin">
              Sign up
            </Link>
          </p>
        </article>

        {/* Field Agent login card */}
        <article className="bg-slate-900 border border-slate-800 rounded-lg p-5">
          <h2 className="text-xl font-semibold text-green-300 mb-3">Log in as Field Agent</h2>
          <form className="space-y-3" onSubmit={(event) => handleRoleLogin(event, "agent", agentEmail, agentPassword)}>
            <label className="block space-y-2 text-sm">
              <span>Email</span>
              <input
                required
                type="email"
                value={agentEmail}
                onChange={(event) => setAgentEmail(event.target.value)}
                className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2"
                placeholder="agent1@smartseason.test"
              />
            </label>
            <label className="block space-y-2 text-sm">
              <span>Password</span>
              <input
                required
                type="password"
                value={agentPassword}
                onChange={(event) => setAgentPassword(event.target.value)}
                className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2"
                placeholder="Enter password"
              />
            </label>
            {agentError && <p className="text-red-300 text-sm">{agentError}</p>}
            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition"
            >
              Log In as Field Agent
            </button>
          </form>
          <p className="text-xs text-slate-300 mt-3">
            {/* Signup path for users who want a Field Agent account */}
            New field agent?{" "}
            <Link className="text-green-300 hover:text-green-200 underline" to="/signup?role=agent">
              Sign up
            </Link>
          </p>
        </article>
      </div>

      {/* Demo credentials helper card for testing */}
      <article className="bg-slate-900 border border-slate-800 rounded-lg p-4">
        <p className="text-xs text-slate-300">
          Demo admin: <span className="text-slate-100">admin@smartseason.test / admin123</span>
        </p>
        <p className="text-xs text-slate-300">
          Demo field agent: <span className="text-slate-100">agent1@smartseason.test / agent123</span>
        </p>
      </article>
    </section>
  );
};

export default LoginPage;