import Header from "@/components/layout/header";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-neutral-100">
      <Header />

      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
