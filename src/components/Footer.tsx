import { Link } from "react-router-dom";

export const Footer = () => (
  <footer className="border-t bg-card text-muted-foreground p-4 text-center text-sm">
    <p>&copy; 2025 My Blog. All rights reserved.</p>
    <div className="flex justify-center space-x-4 mt-2">
      <Link to="/about" className="text-primary hover:underline">About</Link>
      <Link to="/contact" className="text-primary hover:underline">Contact</Link>
      <Link to="/privacy" className="text-primary hover:underline">Privacy</Link>
    </div>
  </footer>
);