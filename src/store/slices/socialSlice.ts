import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Profile } from "@/types";

interface SocialState {
  followers: Profile[];
  following: Profile[];
  loading: boolean;
  error: string | null;
}

const initialState: SocialState = {
  followers: [],
  following: [],
  loading: false,
  error: null,
};

const socialSlice = createSlice({
  name: 'social',
  initialState,
  reducers: {
    setFollowers: (state, action: PayloadAction<Profile[]>) => {
      state.followers = action.payload;
    },
    setFollowing: (state, action: PayloadAction<Profile[]>) => {
      state.following = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setFollowers, setFollowing, setLoading, setError } = socialSlice.actions;
export default socialSlice.reducer;