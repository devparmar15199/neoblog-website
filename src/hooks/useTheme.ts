import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store";
import { toggleTheme } from "@/store/slices/themeSlice";

export const useTheme = () => {
    const dispatch = useDispatch();
    const { mode } = useSelector((state: RootState) => state.theme);

    const toggle = () => dispatch(toggleTheme());

    return { mode, toggle };
};