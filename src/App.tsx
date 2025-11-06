import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Home } from './pages/Home';
import { AuthPage } from './pages/AuthPage';
import { Profile } from './pages/Profile';
import { Dashboard } from './pages/Dashboard';
import { PostsList } from './pages/PostsList';
import { PostDetail } from './pages/PostDetail';
import { CreateEditPost } from './pages/CreateEditPost';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Public Routes */}
          <Route index element={<Home />} />
          <Route path="auth" element={<AuthPage />} />
          <Route path="posts" element={<PostsList />} />
          <Route path="posts/:slug" element={<PostDetail />} />

          {/* Protected Routes Group */}
          <Route element={<ProtectedRoute />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="profile" element={<Profile />} />
            <Route path="posts/create" element={<CreateEditPost />} />
            <Route path="posts/edit/:id" element={<CreateEditPost />} />
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
