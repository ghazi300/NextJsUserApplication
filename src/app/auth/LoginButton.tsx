"use client";

import { signIn } from "next-auth/react";

export const LoginButton = () => {
  return (
    <button
      onClick={async () => {
        await signIn();
      }}
      className="btn btn-primary w-full hover:bg-blue-700 transition duration-300 ease-in-out"
    >
      Login
    </button>
  );
};
