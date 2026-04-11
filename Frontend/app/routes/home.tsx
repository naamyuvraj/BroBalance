import type { Route } from "./+types/home";
import  App  from "../welcome/welcome";
import Login from "src/pages/auth/Login";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return <Login />;
}
