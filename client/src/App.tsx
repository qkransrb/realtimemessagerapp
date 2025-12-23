import { useEffect } from "react";
import { useAuth } from "./hooks/use-auth";
import AppRoutes from "./routes";
import { Spinner } from "./components/ui/spinner";
import { useLocation } from "react-router-dom";
import { isAuthRoutes } from "./routes/routes";
import { useSocket } from "./hooks/use-socket";

function App() {
  const { pathname } = useLocation();
  const { user, isAuthStatus, isAuthStatusLoading } = useAuth();
  const { onlineUsers } = useSocket();

  const isAuth = isAuthRoutes(pathname);

  console.log("onlineUsers: ", onlineUsers);

  useEffect(() => {
    if (isAuth) return;
    isAuthStatus();
  }, [isAuthStatus, isAuth]);

  if (isAuthStatusLoading && !user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Spinner className="size-6" />
      </div>
    );
  }

  return <AppRoutes />;
}

export default App;
