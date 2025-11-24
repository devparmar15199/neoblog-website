import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Layouts
import { Layout } from "./components/layout/Layout";
import { ProtectedRoute } from "./components/layout/ProtectedRoute";
import { AdminRoute } from "./components/layout/AdminRoute";
import { PublicOnlyRoute } from "./components/layout/PublicOnlyRoute";
import { RootRedirect } from "./components/layout/RootRedirect";

// Auth Pages
import { AuthPage } from "./pages/auth/AuthPage";

// Public Pages
import { Home } from "./pages/public/Home";
import { PostDetail } from "./pages/public/PostDetail";
import { ProfileView } from "./pages/public/ProfileView";

// User Pages
import { UserDashboard } from "./pages/user/UserDashboard";
import { CreateEditPost } from "./pages/user/CreateEditPost";
import { UserSettings } from "./pages/user/UserSettings";

// Admin Pages
import { AdminLayout } from "./pages/admin/AdminLayout";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { AdminUserList } from "./pages/admin/AdminUserList";
import { AdminPostManager } from "./pages/admin/AdminPostManager";
import { AdminTaxonomyManager } from "./pages/admin/AdminTaxonomyManager";

// Hooks
import { useTheme } from "./hooks/useTheme";

function App() {
  // Initialize theme
  useTheme();

  return (
    <BrowserRouter>
      <Toaster position="top-center" reverseOrder={false} />

      <Routes>
        <Route path="/" element={<Layout />}>

          {/* 1. Root Redirect (Handles logic for /, redirects Admin/User appropriately) */}
          <Route index element={<RootRedirect />} />

          {/* 2. Public Only Routes (Login/Register) */}
          {/* If logged in, these redirect to Dashboard or Admin */}
          <Route element={<PublicOnlyRoute />}>
            <Route path="auth" element={<AuthPage />} />
          </Route>

          {/* 3. Public Routes (Accessible by everyone) */}
          <Route path="search" element={<Home />} />
          <Route path="posts/:slug" element={<PostDetail />} />
          <Route path="profile/:username" element={<ProfileView />} />

          {/* 4. User Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="dashboard" element={<UserDashboard />} />
            <Route path="settings" element={<UserSettings />} />
            <Route path="create-post" element={<CreateEditPost />} />
            <Route path="edit-post/:id" element={<CreateEditPost />} />
          </Route>

          {/* 5. Admin Protected Routes */}
          <Route element={<AdminRoute />}>
            <Route path="admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="users" element={<AdminUserList />} />
              <Route path="posts" element={<AdminPostManager />} />
              <Route path="taxonomy" element={<AdminTaxonomyManager />} />
            </Route>
          </Route>

          {/* 404 Fallback */}
          <Route path="*" element={
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
              <h1 className="text-6xl font-bold text-primary">404</h1>
              <p className="text-xl text-muted-foreground mt-2">Page Not Found</p>
              <a href="/" className="mt-4 underline hover:text-primary">Return Home</a>
            </div>
          } />

        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
