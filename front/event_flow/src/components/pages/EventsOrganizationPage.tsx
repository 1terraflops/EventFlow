import React, { useEffect } from "react";
import { Box, Button, ButtonBase } from "@mui/material";
import { useNavigate } from "react-router-dom";

const EventsOrganizationPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <Box sx={{ p: 4 }}>
      <ButtonBase
        onClick={() => {
          navigate("/addEvent");
        }}
      >
        <Box
          sx={{
            backgroundColor: "black",
            color: "white",
            borderRadius: "20px",
            height: "40px",
            width: "150px",
            alignContent: "center",
          }}
        >
          Створити захід
        </Box>
      </ButtonBase>
    </Box>
  );
};

export default EventsOrganizationPage;
