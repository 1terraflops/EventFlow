import React, { useEffect } from "react";
import { Box, Typography, Avatar, Grid, Paper, Button } from "@mui/material";
import axios from "axios";
import jwtDecode, { JwtPayload } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../../store/UserStore";
import { getProfileFromJwt } from "../../requests/Auth";

interface JWTPayload {
  id: string;
}

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    navigate("/");
  };
  const logout = useUserStore.getState().signOut;
  const onLogout = () => {
    handleLogout();
    logout();
  };
  const { userProfile } = useUserStore.getState();
  getProfileFromJwt();
  return <Box sx={{ p: 4 }}></Box>;
};

export default ProfilePage;
