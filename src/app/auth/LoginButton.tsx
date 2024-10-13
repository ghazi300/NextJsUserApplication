"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export const LoginButton = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setLoading(true);
    setError("");

    // Attempt to sign in with the default provider (e.g., Google)
    const result = await signIn("google", { redirect: false });

    if (result?.error) {
      console.error("Sign-in error:", result.error);
      setError("Error signing in. Please try again."); // Set the error message for user feedback
    }

    setLoading(false);
  };

  return (
    <div>
      <button
        onClick={handleLogin}
        className="btn btn-primary w-full hover:bg-blue-700 transition duration-300 ease-in-out"
        disabled={loading} // Disable the button while loading
      >
        {loading ? "Logging in..." : "Login"}
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>} {/* Display error message */}
    </div>
  );
};
