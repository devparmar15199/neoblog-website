import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import { ProtectedRoute } from "./components/layout/ProtectedRoute";
import { AdminRoute } from "./components/layout/AdminRoute";
import { Home } from "./pages/Home";
import { AuthPage } from "./pages/AuthPage";
import { ProfileSettings } from "./pages/ProfileSettings";
import { ProfilePage } from "./pages/ProfilePage";
import { Dashboard } from "./pages/Dashboard";
import { PostsList } from "./pages/PostsList";
import { PostDetail } from "./pages/PostDetail";
import { CreateEditPost } from "./pages/CreateEditPost";
import { AdminDashboard } from "./pages/AdminDashboard";
import { RootRedirect } from "./components/layout/RootRedirect";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<RootRedirect />} />

          {/* Public Routes */}
          <Route path="auth" element={<AuthPage />} />
          <Route path="posts" element={<PostsList />} />
          <Route path="posts/:slug" element={<PostDetail />} />
          <Route path="user/:username" element={<ProfilePage />} />

          {/* Standard Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="profile" element={<ProfileSettings />} />
            <Route path="posts/create" element={<CreateEditPost />} />
            <Route path="posts/edit/:id" element={<CreateEditPost />} />
          </Route>

          {/* Admin Protected Routes */}
          <Route element={<AdminRoute />}>
            <Route path="admin" element={<AdminDashboard />} />
          </Route>

          {/* 404 Not Found Page */}
          <Route path='*' element={
            <div className="p-10 text-center">
              <h1 className="text-4xl font-bold">404</h1>
              <p>Page Not Found</p>
            </div>
          } />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
