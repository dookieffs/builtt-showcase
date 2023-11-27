import React, { PropsWithChildren } from "react";
import { useAuthContext } from "../../context/AuthContext";
import { Navigate } from "react-router-dom";

interface RedirectAuthenticatedProps extends PropsWithChildren {
  redirectUrl: string;
}

function RedirectAuthenticated({
  redirectUrl,
  children
}: RedirectAuthenticatedProps) {
  const { user } = useAuthContext();

  if (user !== null) {
    return <Navigate to={redirectUrl} />;
  }

  return <>{children}</>;
}

export const withRedirectAuthenticated = <Props extends object>(
  Wrapped: React.FC<Props>,
  redirectAuthenticatedProps: RedirectAuthenticatedProps
) => {
  return (props: Props) => {
    return (
      <RedirectAuthenticated {...redirectAuthenticatedProps}>
        <Wrapped {...props} />
      </RedirectAuthenticated>
    );
  };
};

export default RedirectAuthenticated;
