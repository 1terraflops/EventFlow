import React from "react";
import { Avatar, Box, ButtonBase, Icon, IconButton } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { Image } from "@mui/icons-material";

const RegisterTab: React.FC = () => {
  const navigate = useNavigate();
  const onClick = () => {
    navigate("/signUp");
  };
  return (
    <Box
      sx={{
        display: "flex",
        flex: 1,
        alignItems: "center",
        marginLeft: "30px",
        justifyContent: "end",
      }}
    >
      <ButtonBase onClick={onClick}>
        <Avatar src="/registerLogo.png" alt="register" variant="square" />
        <Box sx={{ marginLeft: "10px" }}>Зареєструватися</Box>
      </ButtonBase>
    </Box>
  );
};

export default RegisterTab;
