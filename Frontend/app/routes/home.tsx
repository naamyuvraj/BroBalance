import type { Route } from "./+types/home";
import LandingPage from "../welcome/welcome";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "BroBalance" },
    { name: "description", content: "Split expenses, track balances, and settle up with friends." },
  ];
}

export default function Home() {
  return <LandingPage />;
}
