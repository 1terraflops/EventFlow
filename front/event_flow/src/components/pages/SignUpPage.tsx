// src/pages/SignupPage.tsx
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  IconButton,
  Avatar,
  ButtonBase,
} from "@mui/material";
import { registerUser } from "../../requests/Auth";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../../store/UserStore";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

// Валідація форми за допомогою yup
const schema = yup
  .object({
    email: yup.string().email("Invalid email").required("Email is required"),
    password: yup
      .string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password")], "Passwords must match")
      .required("Confirm password is required"),
    age: yup.number().positive().integer().required("Age is required"),
    name: yup.string().required("Name is required"),
    surname: yup.string().required("Surname is required"),
  })
  .required();

const SignUpPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const signIn = useUserStore.getState().signIn;
  const navigate = useNavigate();
  const onSubmit = async (data: any) => {
    try {
      const { userRole, profile } = await registerUser(
        data.email,
        data.password,
        data.age,
        data.name,
        data.surname
      );
      signIn(await profile, userRole);
      navigate("/");
    } catch (error: any) {
      alert("Invalid credentials");
    }
  };
  const onGoToLogin = (data: any) => {
    navigate("/login");
  };
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
            Введіть свої дані для реєстрації
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
            <TextField
              fullWidth
              label="Confirm Password"
              type="password"
              variant="outlined"
              margin="normal"
              {...register("confirmPassword")}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
              slotProps={{
                input: { sx: { borderRadius: "10vh" } },
              }}
            />
            <TextField
              fullWidth
              label="Age"
              type="number"
              variant="outlined"
              margin="normal"
              {...register("age")}
              error={!!errors.age}
              helperText={errors.age?.message}
              slotProps={{
                input: { sx: { borderRadius: "10vh" } },
              }}
            />
            <TextField
              fullWidth
              label="Name"
              variant="outlined"
              margin="normal"
              {...register("name")}
              error={!!errors.name}
              helperText={errors.name?.message}
              slotProps={{
                input: { sx: { borderRadius: "10vh" } },
              }}
            />
            <TextField
              fullWidth
              label="Surname"
              variant="outlined"
              margin="normal"
              {...register("surname")}
              error={!!errors.name}
              helperText={errors.name?.message}
              slotProps={{
                input: { sx: { borderRadius: "10vh" } },
              }}
            />
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
              Зареєструватися
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
              {"Вже зареєстровані? "}
              <ButtonBase onClick={onGoToLogin}>
                <Typography>
                  <Box fontWeight="fontWeightBold" display="inline">
                    Увійдіть
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

export default SignUpPage;
