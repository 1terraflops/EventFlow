import { Box, TextField, Typography } from "@mui/material";
import React from "react";

interface ProfileFieldProps {
  title: string;
  data: string;
}

const ProfileField: React.FC<ProfileFieldProps> = ({ title, data }) => {
  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        alignContent: "center",
        mt: 5,
        mb: 5,
      }}
    >
      <Box sx={{ alignContent: "center" }}>
        <Typography variant="h5">{title}</Typography>
      </Box>
      <Box
        sx={{
          minWidth: "300px",
          justifyContent: "center",
          borderRadius: "50px",
          border: "2px solid black",
          minHeight: "50px",
          alignContent: "center",
        }}
      >
        {data}
      </Box>
    </Box>
  );
};

export default ProfileField;
