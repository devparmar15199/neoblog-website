import { Link } from "react-router-dom";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-card/95 backdrop-blur supports-backdrop-filter:bg-card/60 mt-auto">
      <div className="container mx-auto px-4 py-6 text-center">
        <p className="text-sm font-medium text-muted-foreground">
          &copy; {currentYear} <span className="font-bold text-foreground">NeoBlog</span>. All rights reserved.
        </p>
        <nav className="mt-3 flex justify-center gap-6 text-sm">
          {['About', 'Contact', 'Privacy'].map((item) => (
             <Link 
                key={item} 
                to={`/${item.toLowerCase()}`} 
                className="text-muted-foreground hover:text-primary transition-colors"
             >
              {item}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
};