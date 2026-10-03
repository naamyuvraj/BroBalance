import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("login", "routes/login.tsx"),
  route("signup", "routes/signup.tsx"),
  route("privacy", "routes/privacy.tsx"),
  route("terms", "routes/terms.tsx"),
  route("oauth/callback", "routes/oauth.callback.tsx"),
  layout("routes/dashboard.tsx", [
    route("dashboard/dashboard", "routes/dashboard.dashboard.tsx"),
    route("dashboard/profile", "routes/dashboard.profile.tsx"),
    route("dashboard/transactions", "routes/dashboard.transactions.tsx"),
    route("dashboard/friends", "routes/dashboard.friends.tsx"),
    route("dashboard/trips", "routes/dashboard.trips.tsx"),
    route("dashboard/trips/:tripId", "routes/dashboard.trip-detail.tsx"),
  ]),
] satisfies RouteConfig;
