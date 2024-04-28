import { useState } from "react";
import {Car, CarEntry, CarResponse} from "../types";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import CarDialogContent from "./CarDialogContent.tsx";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {updateCar} from "../api/carapi.ts";
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import Tooltip from '@mui/material/Tooltip';

type FormProps = {
  cardata: CarResponse;
}
function EditCar({ cardata }: FormProps) {
  const [open, setOpen] = useState(false);
  const [car, setCar] = useState<Car>({
    brand: '',
    model: '',
    color: '',
    registerNumber: '',
    modelYear: 0,
    price: 0
  });
  const queryClient = useQueryClient();
  const {mutate} = useMutation(updateCar, {
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["cars"]});
    },
    onError: (err) => {
      console.error(err);
    }
  });
  const handleClickOpen = () => {
    setCar({
      brand: cardata.brand,
      model: cardata.model,
      color: cardata.color,
      registerNumber: cardata.registerNumber,
      modelYear: cardata.modelYear,
      price: cardata.price
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = () => {
    const url = cardata._links.car.href;
    const carEntry: CarEntry = {car, url};
    mutate(carEntry);
    setCar({ brand: '', model: '', color: '',  registerNumber:'',
      modelYear: 0, price: 0 });
    setOpen(false);
  }
  const handleChange = (event : React.ChangeEvent<HTMLInputElement>) =>
  {
    setCar({...car, [event.target.name]: event.target.value});
  }
  return(
    <>
      <Tooltip title="Edit car">
        <IconButton aria-label="edit" size="small" onClick={handleClickOpen}>
          <EditIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit car</DialogTitle>
        <CarDialogContent car={car} handleChange={handleChange} />
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog></>
  );
}

export default EditCar;