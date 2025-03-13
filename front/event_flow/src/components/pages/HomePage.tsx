import React, { useEffect, useState } from "react";
import { Box, Button, Container, Typography, IconButton } from "@mui/material";
// import { Facebook, Instagram, Twitter, ArrowUpward } from "@mui/icons-material";
// import "./HomePage.css";
import { useNavigate } from "react-router-dom";
import { useEventStore } from "../../store/EventStore";
import EventElement from "../EventElement";
const HomePage = () => {
  const [showScrollButton, setShowScrollButton] = useState(false);

  const navigate = useNavigate();
  const events = useEventStore.getState().events;
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setShowScrollButton(true);
      } else {
        setShowScrollButton(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, 300px)",
        gridColumnGap: "20px",
        paddingLeft: "5%",
        paddingRight: "5%",
        overflow: "hidden",
        overflowY: "auto",
        justifyContent: "space-between",
        mt: 5,
        mb: 5,
      }}
    >
      {events.map((event) => (
        <EventElement logo={event.logo} title={event.title}></EventElement>
      ))}
    </Box>
  );
};

export default HomePage;
