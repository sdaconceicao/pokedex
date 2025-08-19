"use client";

import React from "react";
import Button from "@/ui/Button";
import styles from "./AuthButtons.module.css";

export default function AuthButtons() {
  const handleSignUp = () => {
    // TODO: Implement sign up functionality
    console.log("Sign up clicked");
  };

  const handleLogin = () => {
    // TODO: Implement login functionality
    console.log("Login clicked");
  };

  return (
    <div className={styles.authContainer}>
      <Button variant="outline" onClick={handleLogin}>
        Login
      </Button>
      <Button variant="primary" onClick={handleSignUp}>
        Sign Up
      </Button>
    </div>
  );
}
