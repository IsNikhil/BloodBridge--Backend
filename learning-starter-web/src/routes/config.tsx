import { Route, Routes, Navigate } from "react-router-dom";
import { useAuth } from "../authentication/use-auth";
import { ScrollToTop } from "../components/ScrollToTop";

// Layouts
import { PublicLayout } from "../layouts/PublicLayout";
import { PrivateLayout } from "../layouts/PrivateLayout";

// Route Guards
import { ProtectedRoute } from "./ProtectedRoute";
import { AdminRoute } from "./AdminRoute";


// Public Pages
import { LandingPage } from "../pages/landing-page/landing-page";
import { LoginPage } from "../pages/login-page/login-page";
import { SignupPage } from "../pages/signup-page/Signuppage";
import { AboutPage } from "../pages/about-page/AboutPage";
import { ContactPage } from "../pages/contact-page/ContactPage";
import { NotFoundPage } from "../pages/not-found";

// Private Pages
import { HomePage } from "../pages/home-page/HomePage";
import { UserPage } from "../pages/user-page/user-page";
import { DonationPage } from "../pages/donation-page/DonationPage";
import { ReceivePage } from "../pages/receive-page/ReceivePage";
import { ProfilePage } from "../pages/profile-page/ProfilePage";
import { AdminDashboard } from "../pages/admin-dashboard/AdminDashboard";

export const AppRoutes = () => {
  const { refetchUser } = useAuth();

  return (
    <>
   
      <ScrollToTop />

      <Routes>
        <Route
          path="/"
          element={
            <PublicLayout>
              <LandingPage />
            </PublicLayout>
          }
        />

        <Route
          path="/login"
          element={
            <PublicLayout>
              <LoginPage fetchCurrentUser={refetchUser} />
            </PublicLayout>
          }
        />

        <Route
          path="/signup"
          element={
            <PublicLayout>
              <SignupPage />
            </PublicLayout>
          }
        />

        <Route
          path="/about"
          element={
            <PublicLayout>
              <AboutPage />
            </PublicLayout>
          }
        />

        <Route
          path="/contact"
          element={
            <PublicLayout>
              <ContactPage />
            </PublicLayout>
          }
        />


        {/* PRIVATE PAGES */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <PrivateLayout>
                <HomePage />
              </PrivateLayout>
            </ProtectedRoute>
          }
        />
<Route
  path="/admin"
  element={
    <AdminRoute>
      <PrivateLayout>
        <AdminDashboard />
      </PrivateLayout>
    </AdminRoute>
  }
/>


        <Route
          path="/user"
          element={
            <ProtectedRoute>
              <PrivateLayout>
                <UserPage />
              </PrivateLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/donation"
          element={
            <ProtectedRoute>
              <PrivateLayout>
                <DonationPage />
              </PrivateLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/request"
          element={
            <ProtectedRoute>
              <PrivateLayout>
                <ReceivePage />
              </PrivateLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <PrivateLayout>
                <ProfilePage />
              </PrivateLayout>
            </ProtectedRoute>
          }
        />


        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
};
