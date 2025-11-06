import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

export const Layout = () => (
  <div className="min-h-screen flex flex-col bg-background text-foreground">
    <Navbar />
    <main className="grow container mx-auto p-4 md:p-6 lg:p-8">
      <Outlet /> {/* Renders child routes */}
    </main>
    <Footer />
  </div>
);