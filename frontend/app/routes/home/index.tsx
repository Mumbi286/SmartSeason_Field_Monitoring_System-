import type { Route } from "./+types/index";
import { Link } from "react-router";
import { useAppContext } from "~/context/AppContext";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "SmartSeason Field Monitoring System | Welcome" },
    { name: "description", content: "Track your crops" },
  ];
}

export default function Home() {
  const { currentUser } = useAppContext();

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-slate-100">How It Works</h2>
        <p className="text-slate-300 text-sm mt-1">
          A simple workflow for coordinators and field agents.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <article className="bg-slate-900 border border-slate-800 rounded-lg p-4">
          <h3 className="text-base font-semibold text-green-300 mb-1">1. Assign Roles</h3>
          <p className="text-slate-300 text-sm">
            Coordinators and field agents each see only the actions relevant to them.
          </p>
        </article>
        <article className="bg-slate-900 border border-slate-800 rounded-lg p-4">
          <h3 className="text-base font-semibold text-green-300 mb-1">2. Track Stages</h3>
          <p className="text-slate-300 text-sm">
            Move each field from Planted to Harvested with date and crop details.
          </p>
        </article>
        <article className="bg-slate-900 border border-slate-800 rounded-lg p-4">
          <h3 className="text-base font-semibold text-green-300 mb-1">3. Monitor Risk</h3>
          <p className="text-slate-300 text-sm">
            Watch Active, At Risk, and Completed statuses from one dashboard view.
          </p>
        </article>
      </div>
      <div className="flex flex-wrap gap-3">
        <Link
          className="bg-green-600 px-4 py-2 rounded text-white hover:bg-green-700 transition"
          to={currentUser ? "/dashboard" : "/login"}
        >
          {currentUser ? "Go to Dashboard" : "Login to Continue"}
        </Link>
        <Link
          className="border border-slate-600 px-4 py-2 rounded text-slate-100 hover:bg-slate-800 transition"
          to="/about"
        >
          Learn More
        </Link>
      </div>
    </section>
  );
}
