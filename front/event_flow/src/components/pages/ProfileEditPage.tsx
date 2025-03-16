import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../../store/UserStore";
import { Box, Button, ButtonBase, TextField, Typography } from "@mui/material";
import { updateUser } from "../../requests/Auth";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

const schema = yup
  .object({
    first_name: yup.string().required("Name is required"),
    last_name: yup.string().required("Surname is required"),
    password: yup
      .string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  })
  .required();

const ProfileEditPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const onSubmit = (data: any) => {
    updateUser({
      first_name: data.first_name,
      last_name: data.last_name,
      password: data.password,
    });
    navigate("/");
  };
  const { userProfile } = useUserStore.getState();
  return (
    <Box sx={{ mr: "10%", ml: "10%", mt: 10 }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box sx={{ display: "flex", justifyContent: "space-evenly" }}>
          <Box
            sx={{
              justifyContent: "center",
              alignContent: "center",
              mr: 15,
              flex: 1,
            }}
          >
            <Typography variant="h5">{"Ім'я"}</Typography>
          </Box>
          <Box sx={{ minWidth: "500px", flex: 3 }}>
            <TextField
              fullWidth
              // label="Name"
              variant="outlined"
              margin="normal"
              defaultValue={userProfile?.first_name}
              {...register("first_name")}
              error={!!errors.first_name}
              helperText={errors.first_name?.message}
              slotProps={{
                input: { sx: { borderRadius: "10vh" } },
              }}
            />
          </Box>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-evenly" }}>
          <Box
            sx={{
              justifyContent: "center",
              alignContent: "center",
              mr: 15,
              flex: 1,
            }}
          >
            <Typography variant="h5">{"Прізвище"}</Typography>
          </Box>
          <Box sx={{ minWidth: "500px", flex: 3 }}>
            <TextField
              fullWidth
              // label="Name"
              variant="outlined"
              margin="normal"
              defaultValue={userProfile?.last_name}
              {...register("last_name")}
              error={!!errors.last_name}
              helperText={errors.last_name?.message}
              slotProps={{
                input: { sx: { borderRadius: "10vh" } },
              }}
            />
          </Box>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-evenly" }}>
          <Box
            sx={{
              justifyContent: "center",
              alignContent: "center",
              mr: 15,
              flex: 1,
            }}
          >
            <Typography variant="h5">{"Пароль"}</Typography>
          </Box>
          <Box sx={{ minWidth: "500px", flex: 3 }}>
            <TextField
              fullWidth
              // label="Name"
              variant="outlined"
              margin="normal"
              type="password"
              {...register("password")}
              error={!!errors.password}
              helperText={errors.password?.message}
              slotProps={{
                input: { sx: { borderRadius: "10vh" } },
              }}
            />
          </Box>
        </Box>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          // fullWidth
          sx={{
            mt: 2,
            // width: "100%",
            borderRadius: "10vh",
            backgroundColor: "black",
            color: "white",
            minHeight: "50px",
            minWidth: "500px",
          }}
        >
          {"Оновити"}
        </Button>
      </form>
    </Box>
  );
};

export default ProfileEditPage;
