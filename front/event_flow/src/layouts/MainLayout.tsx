import React, { ReactNode } from "react";
import {
  AppBar,
  Toolbar,
  Tabs,
  Tab,
  IconButton,
  Avatar,
  Button,
  Box,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useUserStore } from "../store/UserStore";
import RegisterTab from "./tabs/RegisterTab";
import LoginTab from "./tabs/LoginTab";
import SearchTab from "./tabs/SearchTab";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const isAuthenticated = useUserStore.getState().isAuthenticated;
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    navigate("/"); // Редирект на сторінку входу після логауту
  };
  const logout = useUserStore.getState().signOut;
  const onLogout = () => {
    handleLogout();
    logout();
  };
  return (
    <Box>
      <AppBar
        sx={{ background: "transparent", color: "black" }}
        position="static"
        elevation={0}
      >
        <Toolbar>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              flexGrow: 1,
              flexShrink: 1,
              flexBasis: "auto",
              alignItems: "center",
            }}
          >
            <Tabs
              sx={{
                display: "flex",
                flexDirection: "row",
                flex: 2,
                alignItems: "center",
              }}
              value={false}
            >
              <Box sx={{ flex: 1 }}>
                <IconButton component={Link} to="/">
                  <Avatar alt="logo" src="/logo.png" variant="square" />
                </IconButton>
              </Box>
              <Box sx={{ flex: 2, alignContent: "center" }}>
                <Tab label="Мої івенти" component={Link} to="/myEvents" />
              </Box>
              <Box sx={{ flex: 2, alignContent: "center" }}>
                <Tab
                  label="Організація івентів"
                  component={Link}
                  to="/eventsOrganization"
                />
              </Box>
              {/* <Tab label="Search" component={Link} to="/search" /> */}
            </Tabs>

            <SearchTab></SearchTab>

            {isAuthenticated ? (
              <Box sx={{ flex: 1 }}>
                <IconButton component={Link} to="/profile">
                  <Avatar alt="User Avatar" src="/path-to-avatar.jpg" />
                </IconButton>
              </Box>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  flex: 1,
                  justifyItems: "flex-end",
                }}
              >
                <RegisterTab></RegisterTab>
                <LoginTab></LoginTab>
              </Box>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      <Box>{children}</Box>
      <Box
        sx={{ backgroundColor: "black", height: "300px", width: "100%" }}
      ></Box>
    </Box>
  );
};

export default MainLayout;
