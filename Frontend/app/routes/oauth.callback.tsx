import { useEffect } from "react";

export default function OAuthCallback() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token) {
      localStorage.setItem("token", token);
      window.location.href = "/dashboard/profile";
    } else {
      window.location.href = "/?error=oauth_failed";
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <p className="text-gray-500">Signing you in...</p>
    </div>
  );
}
