import type { Route } from "./+types/index";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "SmartSeason Field Monitoring System | Welcome" },
    { name: "description", content: "Track your crops" },
  ];
}

export default function Home() {
  return <section>My App</section>;
}
