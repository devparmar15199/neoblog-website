import { Loader2 } from "lucide-react";

export const LoadingSpinner = ({ size = "default" }: { size?: "sm" | "default" | "lg" }) => {
    const sizeClass = size === "sm" ? "h-4 w-4" : size === "lg" ? "h-8 w-8" : "h-6 w-6";
    return <Loader2 className={`${sizeClass} animate-spin text-primary`} />;
};