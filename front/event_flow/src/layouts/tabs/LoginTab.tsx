import React from "react";
import { Avatar, Box, ButtonBase, IconButton } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

const LoginTab: React.FC = () => {
  const navigate = useNavigate();
  const onClick = () => {
    navigate("/login");
  };
  return (
    <Box
      sx={{
        display: "flex",
        flex: 1,
        alignItems: "center",
        marginLeft: "30px",
      }}
    >
      <ButtonBase onClick={onClick}>
        <Avatar src="/profileLogo.png" alt="login" variant="square" />
        <Box sx={{ marginLeft: "10px" }}>Увійти</Box>
      </ButtonBase>
    </Box>
  );
};

export default LoginTab;
