import React from "react";
import logo from "./logo.svg";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useUserStore } from "./store/UserStore";
import HomePage from "./components/pages/HomePage";
import ProtectedRoute from "./ProtectedRoute";
import LoginPage from "./components/pages/LoginPage";
import SignUpPage from "./components/pages/SignUpPage";
import MainLayout from "./layouts/MainLayout";
import AdminPage from "./components/pages/AdminPage";
import ProfilePage from "./components/pages/ProfilePage";
import UserInfoPage from "./components/pages/UserInfoPage";
import EventsOrganizationPage from "./components/pages/EventsOrganizationPage";
import MyEventsPage from "./components/pages/MyEventsPage";
import EventPage from "./components/pages/EventPage";

function App() {
  const userRole = useUserStore.getState().role;
  return (
    <div className="App">
      <Router>
        <Routes>
          {/* Публічні сторінки */}
          <Route
            path="/"
            element={
              <MainLayout>
                <HomePage />
              </MainLayout>
            }
          />
          <Route
            path="/event/:eventName"
            element={
              <MainLayout>
                <EventPage />
              </MainLayout>
            }
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signUp" element={<SignUpPage />} />

          {/* Домашня сторінка (захищена) */}
          <Route
            path="/myEvents"
            element={
              <ProtectedRoute allowAllRegistered={true} userRole={""}>
                <MainLayout>
                  <MyEventsPage />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/eventsOrganization"
            element={
              <ProtectedRoute allowAllRegistered={true} userRole={""}>
                <MainLayout>
                  <EventsOrganizationPage />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/userInfo"
            element={
              <ProtectedRoute allowAllRegistered={true} userRole={""}>
                <MainLayout>
                  <UserInfoPage />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute allowAllRegistered={true} userRole={""}>
                <MainLayout>
                  <ProfilePage />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          {/* Адміністративна сторінка (захищена, тільки для admin) */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute userRole={userRole} requiredRole="admin">
                <AdminPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
