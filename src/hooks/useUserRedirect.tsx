// hooks/useUserRedirect.ts
import { useEffect, useContext } from "react";
import { createBrowserHistory } from "history";
import { UserContext } from ".././context/user-context";
import { toast } from "react-toastify";
import { useTranslation } from 'react-i18next';


const allowedRoutes = ["/", "/sign-in", "/sign-up"];
const history = createBrowserHistory();

const useUserRedirect = () => {
  const { t } = useTranslation();
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

        if (!token || token === undefined || token === null) {
          // If no token, check if the current route is allowed
          if (!allowedRoutes.includes(history.location.pathname)) {
            // Set the flag to avoid additional redirects
            isRedirecting = true;
            // Redirect to landing page if the route is not allowed
            history.push("/");
          }
        }
      } catch (error) {
        // Handle error (e.g., show a toast notification)
        console.error("Error checking token:", error);
        toast.error(`${t("Error checking token. Please try again.")}`);
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

export default useUserRedirect;
