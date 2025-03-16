import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Avatar,
  Box,
  Button,
  ButtonBase,
  Container,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../../store/UserStore";
import { loginUser } from "../../requests/Auth";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const schema = yup
  .object({
    email: yup.string().email("Invalid email").required("Email is required"),
    password: yup
      .string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  })
  .required();

const LoginPage = () => {
  const navigate = useNavigate();
  const handleLogin = async (data: any) => {
    try {
      const { /* userRole, */ profile } = await loginUser(
        data.email,
        data.password
      );
      navigate("/");
    } catch (error: any) {
      console.error("Login failed:", error);
      alert("Invalid credentials");
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: any) => {
    handleLogin(data);
  };
  const onGoToSignUp = (data: any) => {
    navigate("/signUp");
  };
  const onForgetPassword = (data: any) => {};
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <Box sx={{ position: "absolute", marginTop: "12px", marginLeft: "1%" }}>
        <IconButton onClick={() => navigate("/")}>
          <Avatar alt="logo" src="/logoWhite.png" variant="square" />
        </IconButton>
      </Box>
      <Box sx={{ flex: 1, height: "100%" }}>
        <img
          alt="Auth logo"
          src="/authLogo.png"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        ></img>
      </Box>
      <Box sx={{ flex: 1 }}>
        <Box sx={{ margin: "10%" }}>
          <Typography align="left" variant="h2" sx={{ mb: 4 }}>
            Вітаю
          </Typography>
          <Typography align="left" variant="h5" sx={{ mb: 4 }}>
            Введіть свої дані
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              fullWidth
              label="Email"
              variant="outlined"
              margin="normal"
              {...register("email")}
              error={!!errors.email}
              helperText={errors.email?.message}
              slotProps={{
                input: { sx: { borderRadius: "10vh" } },
              }}
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              variant="outlined"
              margin="normal"
              {...register("password")}
              error={!!errors.password}
              helperText={errors.password?.message}
              slotProps={{
                input: { sx: { borderRadius: "10vh" } },
              }}
            />
            <Box
              sx={{ display: "flex", width: "100%", justifyContent: "right" }}
            >
              <ButtonBase onClick={onForgetPassword}>
                <Typography align="right">Забули пароль?</Typography>
              </ButtonBase>
            </Box>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{
                mt: 2,
                width: "100%",
                borderRadius: "10vh",
                backgroundColor: "black",
                color: "white",
              }}
            >
              Увійти
            </Button>
          </form>
          <Box
            sx={{
              display: "flex",
              width: "100%",
              justifyContent: "center",
              mt: 2,
            }}
          >
            <Typography>
              {"Не маєте акаунту? "}
              <ButtonBase onClick={onGoToSignUp}>
                <Typography>
                  <Box fontWeight="fontWeightBold" display="inline">
                    Зареєструйтеся
                  </Box>
                </Typography>
              </ButtonBase>
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default LoginPage;
