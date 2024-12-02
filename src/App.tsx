import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '@/contexts/AuthContext';
import { useAuth } from '@/hooks/useAuth';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { MainLayout } from '@/components/layouts/MainLayout';
import { LoginPage } from './components/pages/login'
import { HomePage } from './components/pages/home'
import { AboutPage } from './components/pages/about'
import { GamePage } from './components/pages/game'
import { GalleryPage } from './components/pages/gallery'
import { NotFoundPage } from './components/pages/not-found'
import { SocialPage } from './components/pages/social'
import { PhonePage } from './components/pages/phone'
import { ContactPage } from './components/pages/contact'
import { SettingPage } from './components/pages/setting'
import { Navigate } from 'react-router-dom'
import { useEffect } from 'react'

function App() {
  function LoginRoute() {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />;
  }

  function LogoutRoute() {
    const { logout } = useAuth();
    
    useEffect(() => {
      logout();
    }, []);

    return <Navigate to="/login" replace />;
  }

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginRoute />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<HomePage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="game" element={<GamePage />} />
            <Route path="gallery" element={<GalleryPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="social" element={<SocialPage />} />
            <Route path="phone" element={<PhonePage />} />
            <Route path="settings" element={<SettingPage />} />
            <Route path="logout" element={<LogoutRoute />} />
            <Route path="404" element={<NotFoundPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
