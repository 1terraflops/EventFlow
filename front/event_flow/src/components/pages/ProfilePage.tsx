import React, { useEffect } from "react";
import {
  Box,
  Typography,
  Avatar,
  Grid,
  Paper,
  Button,
  TextField,
  ButtonBase,
} from "@mui/material";
import axios from "axios";
import jwtDecode, { JwtPayload } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../../store/UserStore";
import { getProfileFromJwt } from "../../requests/Auth";
import ProfileField from "../ProfileField";

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const logout = useUserStore.getState().signOut;
  const onLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    logout();
    navigate("/");
  };
  const userProfile = useUserStore((state) => state.userProfile);
  return (
    <Box sx={{ pl: "10%", pr: "20%", display: "flex", pt: 10 }}>
      <Box sx={{ flex: 1, justifyContent: "center", pt: 10 }}>
        <Avatar sx={{ height: "150px", width: "150px" }}></Avatar>
      </Box>
      <Box sx={{ flex: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "end" }}>
          <ButtonBase onClick={() => navigate("/profile/edit")}>
            <Typography sx={{ textDecoration: "underline" }}>
              {"Змінити"}
            </Typography>
          </ButtonBase>
        </Box>
        <ProfileField
          title="Ім'я"
          data={userProfile === undefined ? "" : userProfile.first_name}
        ></ProfileField>
        <ProfileField
          title="Прізвище"
          data={userProfile === undefined ? "" : userProfile.last_name}
        ></ProfileField>
        <ProfileField
          title="Email"
          data={userProfile === undefined ? "" : userProfile.username}
        ></ProfileField>
        <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
          <ButtonBase sx={{ borderRadius: "50px" }} onClick={onLogout}>
            <Box
              sx={{
                minWidth: "300px",
                justifyContent: "center",
                borderRadius: "50px",
                border: "2px solid black",
                minHeight: "50px",
                alignContent: "center",
                backgroundColor: "salmon",
              }}
            >
              <Typography variant="h5">{"Вийти"}</Typography>
            </Box>
          </ButtonBase>
        </Box>
      </Box>
    </Box>
  );
};

export default ProfilePage;
