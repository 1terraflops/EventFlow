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

const RegisterPage = () => {
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

  return (
    <Container maxWidth="sm">
      <IconButton onClick={() => navigate(-1)}>
        <ArrowBackIcon></ArrowBackIcon>
      </IconButton>
      <Box sx={{ mt: 8, textAlign: "center" }}>
        <Typography variant="h4" sx={{ mb: 4 }}>
          Sign Up
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
          />
          <TextField
            fullWidth
            label="Name"
            variant="outlined"
            margin="normal"
            {...register("name")}
            error={!!errors.name}
            helperText={errors.name?.message}
          />
          <TextField
            fullWidth
            label="Surname"
            variant="outlined"
            margin="normal"
            {...register("surname")}
            error={!!errors.name}
            helperText={errors.name?.message}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            Sign Up
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default RegisterPage;
