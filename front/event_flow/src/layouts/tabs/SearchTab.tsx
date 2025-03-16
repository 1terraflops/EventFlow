import React, { useState } from "react";
import {
  Avatar,
  Box,
  FormControl,
  IconButton,
  Input,
  TextField,
} from "@mui/material";
import { Link } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import { getEvents, searchEvents } from "../../requests/Events";

const SearchTab: React.FC = () => {
  const onEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      searchQuery === "" ? getEvents() : searchEvents(searchQuery);
    }
  };
  const [searchQuery, setSearchQuery] = useState("");
  return (
    <FormControl variant="standard">
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-end",
          border: 1,
          borderColor: "black",
          borderRadius: "20px",
          paddingLeft: "10px",
          paddingRight: "10px",
        }}
      >
        <SearchIcon sx={{ color: "action.active", mr: 1, my: 0.5 }} />
        <Input
          placeholder="Пошук"
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setSearchQuery(event.target.value);
          }}
          disableUnderline
          onKeyUp={onEnter}
        ></Input>
      </Box>
    </FormControl>
  );
};

export default SearchTab;
