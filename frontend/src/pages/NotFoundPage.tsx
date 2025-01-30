import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-100 p-6">
      <Card className="text-center max-w-md p-6 shadow-lg">
        <h1 className="text-6xl font-extrabold text-primary mb-4">404</h1>
        <p className="text-lg font-semibold text-neutral-700 mb-2">
          Oops! Page Not Found
        </p>
        <p className="text-sm text-neutral-600 mb-6">
          The page you’re looking for doesn’t exist or has been moved.
        </p>
        <Link to="/">
          <Button variant="outline" size="lg" className="w-full">
            Take me home
          </Button>
        </Link>
      </Card>

      <footer className="mt-6 text-neutral-500 text-sm">
        &copy; {new Date().getFullYear()} Your App Name. All Rights Reserved.
      </footer>
    </div>
  );
};

export default NotFoundPage;
