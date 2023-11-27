import { useAuthContext } from "../../context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

interface ProtectedRouteProps {
  redirectUrl?: string;
}

function ProtectedRoute({ redirectUrl = "/login" }: ProtectedRouteProps) {
  const { user, isAuthenticating } = useAuthContext();

  if (isAuthenticating) {
    return <h1>Loading...</h1>;
  }

  return user === null ? <Navigate to={redirectUrl} /> : <Outlet />;
}

export default ProtectedRoute;
