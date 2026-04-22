import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { Navigate, useNavigate } from "react-router";
import { useAppContext } from "~/context/AppContext";

const LoginPage = () => {
  const { currentUser, login, isHydrated, users } = useAppContext();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const demoAccounts = useMemo(
    () =>
      users.map((user) => ({
        label: `${user.role === "admin" ? "Admin" : "Field Agent"} - ${user.name}`,
        email: user.email,
        password: user.password,
      })),
    [users]
  );

  if (!isHydrated) {
    return <section className="text-slate-200">Loading...</section>;
  }

  if (currentUser) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const success = login(email, password);
    if (!success) {
      setError("Invalid credentials. Please use one of the demo accounts.");
      return;
    }
    navigate("/dashboard");
  };

  return (
    <section className="max-w-3xl mx-auto space-y-4">
      <article className="bg-slate-900 border border-slate-800 rounded-lg p-5">
        <h2 className="text-2xl font-bold text-green-300 mb-4">Log In</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <label className="block space-y-2 text-sm">
            <span className="text-slate-200">Email</span>
            <input
              required
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2"
            />
          </label>
          <label className="block space-y-2 text-sm">
            <span className="text-slate-200">Password</span>
            <input
              required
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2"
            />
          </label>
          {error && <p className="text-red-300 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition"
          >
            Enter Dashboard
          </button>
        </form>
      </article>

      <article className="bg-slate-900 border border-slate-800 rounded-lg p-5">
        <h3 className="text-lg font-semibold text-green-300 mb-2">Demo Credentials</h3>
        <p className="text-sm text-slate-300 mb-3">
          Use any account below to test role-based access.
        </p>
        <ul className="space-y-2">
          {demoAccounts.map((account) => (
            <li key={account.email} className="rounded border border-slate-700 p-3 bg-slate-950">
              <p className="text-sm text-slate-100 font-semibold">{account.label}</p>
              <p className="text-xs text-slate-300">Email: {account.email}</p>
              <p className="text-xs text-slate-300">Password: {account.password}</p>
            </li>
          ))}
        </ul>
      </article>
    </section>
  );
};

export default LoginPage;