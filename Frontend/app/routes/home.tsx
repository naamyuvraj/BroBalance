import type { Route } from "./+types/home";
import  App  from "../welcome/welcome";
import Login from "src/pages/auth/Login";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "BroBalance" },
    { name: "description", content: "Welcome to BroBalance!" },
  ];
}

export default function Home() {
  return <Login />;
}
