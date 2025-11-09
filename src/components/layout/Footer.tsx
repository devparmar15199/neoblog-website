import { Link } from "react-router-dom";

export const Footer = () => (
  <footer className="border-t bg-card/95 backdrop-blur supports-backdrop-filter:bg-card/60 mt-auto">
    <div className="container mx-auto px-4 py-6 text-center">
      <p className="text-sm font-medium text-foreground">
        &copy; {new Date().getFullYear()} <span className="font-bold text-primary">NeoBlog</span>. All rights reserved.
      </p>
      <nav className="mt-3 flex justify-center gap-6 text-sm">
        <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">
          About
        </Link>
        <Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">
          Contact
        </Link>
        <Link to="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
          Privacy
        </Link>
      </nav>
    </div>
  </footer>
);