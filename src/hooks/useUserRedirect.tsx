import { useEffect, useContext } from "react";
import { createBrowserHistory } from "history";
import { UserContext } from ".././context/user-context";
import { toast } from "react-toastify";

const allowedRoutes = [
  "/",
  "/sign-in",
  "/sign-up",
  "/sign-up/verification",
  /^\/reset-password\/[a-zA-Z0-9]+$/, // Allow access to reset password routes
];

const history = createBrowserHistory();

const useUserRedirect = () => {
  const { setIsLoading } = useContext(UserContext);

  useEffect(() => {
    let isRedirecting = false;

    const checkTokenAndRedirect = async () => {
      if (isRedirecting) {
        // If we're already in the process of redirecting, exit to prevent a loop
        return;
      }

      setIsLoading(true);

      try {
        // Check if token is present
        const token = localStorage.getItem("token");

        // Skip redirection if token exists or if the route is a reset password route
        if (token || isResetPasswordRoute(history.location.pathname)) {
          setIsLoading(false);
          return;
        }

        // If no token and not a reset password route, redirect to landing page
        if (!allowedRoutes.includes(history.location.pathname)) {
          // Set the flag to avoid additional redirects
          isRedirecting = true;
          // Redirect to landing page if the route is not allowed
          history.push("/");
        }
      } catch (error) {
        // Handle error (e.g., show a toast notification)
        console.error("Error checking token:", error);
        toast.error("Error checking token. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    // Add a listener to perform the check on each navigation
    const unlisten = history.listen(() => {
      checkTokenAndRedirect();
    });

    // Initial check
    checkTokenAndRedirect();

    // Cleanup the listener when the component unmounts
    return () => {
      unlisten();
    };
  }, [setIsLoading]);

  return {
    // You can add more functions or values if needed
  };
};

const isResetPasswordRoute = (pathname: string) => {
  // Check if the pathname matches the reset password route pattern
  return /^\/reset-password\/[a-zA-Z0-9]+$/.test(pathname);
};

export default useUserRedirect;
