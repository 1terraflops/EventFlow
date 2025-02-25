import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Box,
  Button,
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
  const signIn = useUserStore.getState().signIn;
  const handleLogin = async (data: any) => {
    try {
      const { userRole, profile } = await loginUser(data.email, data.password);
      signIn(await profile, userRole);
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
  console.log(navigate);
  return (
    <Container maxWidth="sm">
      <IconButton onClick={() => navigate(-1)}>
        <ArrowBackIcon></ArrowBackIcon>
      </IconButton>
      <Box sx={{ mt: 8, textAlign: "center" }}>
        <Typography variant="h4" sx={{ mb: 4 }}>
          Login
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
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            Login
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default LoginPage;
