import { useNavigate, useLocation } from "react-router-dom";

import useAuth from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { useToast } from "@/hooks/use-toast";

import { CircleUser } from "lucide-react";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { logout, user, loading } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const { toast } = useToast();

  const logoutUser = async () => {
    try {
      await logout();
      toast({
        title: "Success",
        description: "You have been successfully logged out",
        variant: "success",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to log out",
        variant: "destructive",
      });
    }
  };

  return (
    <header className="flex items-center justify-between p-4 sm:px-6 bg-primary shadow-md h-[72px]">
      <div className="flex items-center space-x-4">
        <span
          onClick={() => navigate("/")}
          className="text-xl font-bold text-white cursor-pointer"
        >
          News Aggregator
        </span>
      </div>

      {!loading && (
        <div className="flex items-center space-x-2 rounded-full">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <CircleUser
                size={32}
                strokeWidth={1.5}
                className="text-white cursor-pointer"
              />
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="w-48 z-50 rounded-md bg-white shadow-lg dark:bg-neutral-800 mt-6 p-2 flex flex-col gap-2"
            >
              {!user ? (
                <>
                  <DropdownMenuItem
                    className="flex text-black cursor-pointer items-center px-3 py-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
                    onClick={() => navigate("/login")}
                  >
                    Login
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="flex text-black cursor-pointer items-center px-3 py-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
                    onClick={() => navigate("/register")}
                  >
                    Register
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem
                    onClick={() => navigate("/")}
                    className={`flex text-black cursor-pointer items-center px-3 py-2 rounded-md ${
                      isActive("/")
                        ? "bg-neutral-200 dark:bg-neutral-700"
                        : "hover:bg-neutral-100 dark:hover:bg-neutral-700"
                    }`}
                  >
                    News
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => navigate("/profile")}
                    className={`flex text-black cursor-pointer items-center px-3 py-2 rounded-md ${
                      isActive("/profile")
                        ? "bg-neutral-200 dark:bg-neutral-700"
                        : "hover:bg-neutral-100 dark:hover:bg-neutral-700"
                    }`}
                  >
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="my-1 border-t border-neutral-300 dark:border-neutral-700" />
                  <DropdownMenuItem
                    onClick={logoutUser}
                    className="flex items-center cursor-pointer px-3 py-2 text-danger rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
                  >
                    Logout
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </header>
  );
};

export default Header;
