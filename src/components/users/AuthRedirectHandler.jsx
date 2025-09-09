import { useEffect } from "react";

function AuthRedirectHandler() {

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const accessToken = query.get("accessToken");
    const refreshToken = query.get("refreshToken");
    const userParam = query.get("user");

    try {
      if (accessToken && refreshToken && userParam) {
        const user = JSON.parse(decodeURIComponent(userParam));

        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("userInfo", JSON.stringify(user));
      }
    } catch (err) {
      console.error("Error parsing user object:", err);
    }

    // ✅ Always go to dashboard no matter what
   const timer = setTimeout(() => {
      window.location.replace("/dashboard");
    }, 1000); // waits 1 second

    return () => clearTimeout(timer)
  });

  return <p>Redirecting... please wait.</p>;
}

export default AuthRedirectHandler;