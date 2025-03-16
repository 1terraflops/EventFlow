import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, TextField } from "@mui/material";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { createEvent, getEvents } from "../../requests/Events";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/de";
import { parse, isDate, format, parseISO } from "date-fns";

function convertToISO(dateStr: string): string {
  const match = dateStr.match(/^(\d{2})\/00\/(\d{4})$/);
  if (!match) {
    return ""; // Невірний формат
  }

  const [, month, year] = match;
  const firstDay = `${year}-${month}-01T00:00:00.000Z`;

  return firstDay;
}

const schema = yup
  .object({
    title: yup.string().required("Title is required"),
    description: yup.string().required("Description is required"),
    start_date: yup.string().required("Start Date is required"),
    //   .transform(parseDateString),
    end_date: yup.string().required("End Date is required"),
    //   .transform(parseDateString),
  })
  .required();

const AddEventPage = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const onSubmit = async (data: any) => {
    try {
      const event = await createEvent({
        title: data.title,
        description: data.description,
        start_date: data.start_date,
        end_date: data.end_date,
      });
      navigate("/");
    } catch (error: any) {
      alert("Somethinf went wrong");
    }
  };
  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ margin: "10%" }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            fullWidth
            label="Title"
            variant="outlined"
            margin="normal"
            {...register("title")}
            error={!!errors.title}
            helperText={errors.title?.message}
            slotProps={{
              input: { sx: { borderRadius: "10vh" } },
            }}
          />
          <TextField
            fullWidth
            label="Description"
            variant="outlined"
            margin="normal"
            {...register("description")}
            error={!!errors.description}
            helperText={errors.description?.message}
            slotProps={{
              input: { sx: { borderRadius: "10vh" } },
            }}
          />
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="de">
            <Controller
              name="start_date"
              control={control}
              render={({
                field: { onChange, value },
                fieldState: { error, invalid },
              }) => (
                <DatePicker
                  label="Start date"
                  onChange={(date: Dayjs | null) => {
                    if (date) {
                      onChange(date.toISOString());
                    } else {
                      onChange(null);
                    }
                  }}
                />
              )}
            />
            <Controller
              name="end_date"
              control={control}
              render={({
                field: { onChange, value },
                fieldState: { error, invalid },
              }) => (
                <DatePicker
                  label="End date"
                  onChange={(date: Dayjs | null) => {
                    if (date) {
                      onChange(date.toISOString());
                    } else {
                      onChange(null);
                    }
                  }}
                />
              )}
            />
          </LocalizationProvider>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{
              mt: 2,
              width: "100%",
              borderRadius: "10vh",
              backgroundColor: "black",
              color: "white",
            }}
          >
            Створити
          </Button>
        </form>
      </Box>
    </Box>
  );
};

export default AddEventPage;
