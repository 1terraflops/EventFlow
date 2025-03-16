import React from "react";
import { Box, ButtonBase, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

interface EventElementProps {
  logo: string;
  title: string;
}

const EventElement: React.FC<EventElementProps> = ({ logo, title }) => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`/event/${title}`);
  };
  return (
    <Box
      sx={{
        width: "300px",
        mb: 5,
      }}
    >
      <img
        alt="Event logo"
        src={logo}
        style={{ width: "100%", height: "auto" }}
      ></img>
      <Typography variant="h4" align="left" sx={{ marginTop: "10px" }}>
        {title}
      </Typography>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "left",
          marginTop: "10px",
        }}
      >
        <ButtonBase onClick={handleClick}>
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
            Деталі
          </Box>
        </ButtonBase>
      </Box>
    </Box>
  );
};
export default EventElement;
