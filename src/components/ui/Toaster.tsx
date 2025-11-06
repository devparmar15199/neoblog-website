import { Toaster } from "react-hot-toast";

export const ToastWrapper = () => {
    return (
        <Toaster
            position='top-right'
            gutter={12}
            toastOptions={{
                duration: 3000,
                // Use CSS variables for better light/dark mode transition
                style: {
                    color: 'hsl(var(--foreground))',
                    background: 'hsl(var(--background))',
                    // background: 'white',
                    border: '1px solid hsl(var(--border))',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                },
                success: {
                    duration: 2000,
                    iconTheme: {
                        primary: 'hsl(var(--primary))',
                        secondary: 'hsl(var(--primary-foreground))',
                    }
                },
                error: {
                    duration: 4000,
                    iconTheme: {
                        primary: 'hsl(var(--destructive))',
                        secondary: 'hsl(var(--destructive-foreground))',
                    }
                }
            }}
        />
    );
};