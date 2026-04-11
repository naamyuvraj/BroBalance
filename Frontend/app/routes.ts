import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("signup", "routes/signup.tsx"),
  route("oauth/callback", "routes/oauth.callback.tsx"),
  layout("routes/dashboard.tsx", [
    route("dashboard/profile", "routes/dashboard.profile.tsx"),
    route("dashboard/transactions", "routes/dashboard.transactions.tsx"),
    route("dashboard/friends", "routes/dashboard.friends.tsx"),
  ]),
] satisfies RouteConfig;
