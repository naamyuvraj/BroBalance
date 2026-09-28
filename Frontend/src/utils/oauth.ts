import { Capacitor } from "@capacitor/core";

const MOBILE_OAUTH_REDIRECT_URL = "brobalance://oauth/callback";

export const isMobileApp = () => Capacitor.isNativePlatform();

export const getOAuthRedirectUrl = () => {
  if (typeof window === "undefined") {
    return MOBILE_OAUTH_REDIRECT_URL;
  }

  if (isMobileApp()) {
    return MOBILE_OAUTH_REDIRECT_URL;
  }

  return `${window.location.origin}/oauth/callback`;
};

export const buildGoogleAuthUrl = (apiBaseUrl: string) => {
  const authUrl = new URL(`${apiBaseUrl}/auth/google`);
  authUrl.searchParams.set("redirect", getOAuthRedirectUrl());
  return authUrl.toString();
};

export const startGoogleOAuth = async (apiBaseUrl: string) => {
  const url = buildGoogleAuthUrl(apiBaseUrl);
  if (isMobileApp()) {
    const { Browser } = await import("@capacitor/browser");
    await Browser.open({ url, presentationStyle: "popover" });
  } else {
    window.location.href = url;
  }
};

export const handleOAuthCallbackUrl = (url: string) => {
  if (!url) return null;

  if (!url.startsWith("brobalance://oauth/callback")) {
    return null;
  }

  const parsed = new URL(url);
  return {
    token: parsed.searchParams.get("token"),
    error: parsed.searchParams.get("error"),
  };
};