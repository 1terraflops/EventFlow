import { Box, ButtonBase, Typography } from "@mui/material";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useEventStore } from "../../store/EventStore";

const EventPage = () => {
  const { eventName } = useParams();
  const navigate = useNavigate();
  if (eventName === undefined) {
    navigate("/");
    return <></>;
  }
  const handleClick = () => {};
  const event = useEventStore.getState().get(eventName);
  return (
    <Box
      sx={{
        marginLeft: "5%",
        marginRight: "5%",
        marginTop: "100px",
        marginBottom: "200px",
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
      }}
    >
      <Box sx={{ flex: 1 }}>
        <img alt="Event logo" src={event?.logo}></img>
      </Box>
      <Box sx={{ flex: 1 }}>
        <Box>
          <Typography align="left" variant="h1">
            {event?.title}
          </Typography>
        </Box>
        <Box sx={{ marginTop: "50px" }}>
          <Typography align="left" variant="h4">
            {event?.description}
          </Typography>
        </Box>
        <Box sx={{ marginTop: "30px" }}>
          <Typography align="left" variant="h4">
            {event?.date}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", marginTop: "30px" }}>
          <img
            alt="Location icon"
            src="/locationicon.png"
            style={{ height: "40px", width: "auto" }}
          ></img>
          <Typography variant="h4">{event?.location}</Typography>
        </Box>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "left",
            marginTop: "30px",
          }}
        >
          <ButtonBase onClick={handleClick}>
            <Box
              sx={{
                backgroundColor: "black",
                color: "white",
                borderRadius: "40px",
                height: "80px",
                width: "250px",
                alignContent: "center",
              }}
            >
              <Typography variant="h4">Купити</Typography>
            </Box>
          </ButtonBase>
        </Box>
      </Box>
    </Box>
  );
};

export default EventPage;
