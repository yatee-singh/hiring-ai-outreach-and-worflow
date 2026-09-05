import {
    Navigate,
  } from "react-router-dom";
  
  import { auth } from "../lib/auth";
  
  interface Props {
    children: React.ReactNode;
  }
  
  export default function ProtectedRoute({
    children,
  }: Props) {
    if (!auth.isAuthenticated()) {
      return (
        <Navigate
          to="/login"
          replace
        />
      );
    }
  
    return <>{children}</>;
  }