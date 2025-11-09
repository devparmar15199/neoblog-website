import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

export const Layout = () => (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar />
      <main className="container mx-auto flex-1 px-4 py-6 md:py-8 lg:py-10">
        <Outlet /> {/* Renders child routes */}
      </main>
      <Footer />
    </div>
);