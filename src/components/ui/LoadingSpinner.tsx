import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export const LoadingSpinner = ({
    size = "default",
}: { size?: "sm" | "default" | "lg" }) => {
    const sizeMap = {
        sm: "size-4",
        default: "size-6",
        lg: "size-8",
    };
    return <Loader2 className={cn(sizeMap[size], "animate-spin text-primary")} />;
};