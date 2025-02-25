import React, { useEffect, useState } from "react";
import { Box, Button, Container, Typography, IconButton } from "@mui/material";
// import { Facebook, Instagram, Twitter, ArrowUpward } from "@mui/icons-material";
// import "./HomePage.css";
import { useNavigate } from "react-router-dom";
const HomePage = () => {
  const [showScrollButton, setShowScrollButton] = useState(false);

  const navigate = useNavigate();

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
  const handleSignUp = () => {
    navigate("/signup"); // Перенаправлення на сторінку реєстрації
  };

  const handleLogIn = () => {
    navigate("/login"); // Перенаправлення на сторінку входу
  };

  return <Box></Box>;
};

export default HomePage;
