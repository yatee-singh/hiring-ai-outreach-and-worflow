// src/hooks/useAuth.ts

import {
    useEffect,
    useState,
  } from "react";
  
  import { auth } from "../lib/auth";
  
  export function useAuth() {
    const [user, setUser] =
      useState(auth.getUser());
  
    useEffect(() => {
      const handleAuthChange = () => {
        setUser(auth.getUser());
      };
  
      window.addEventListener(
        "auth-change",
        handleAuthChange
      );
  
      return () => {
        window.removeEventListener(
          "auth-change",
          handleAuthChange
        );
      };
    }, []);
  
    return {
      user,
      isAuthenticated: !!user,
    };
  }