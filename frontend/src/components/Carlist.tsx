import {useQuery, useMutation, useQueryClient} from "@tanstack/react-query";
import {getCars, deleteCar} from "../api/carapi.ts";
import {DataGrid, GridCellParams, GridColDef} from "@mui/x-data-grid";
import Snackbar from "@mui/material/Snackbar";
import {useState} from "react";
import AddCar from "./AddCar.tsx";

function Carlist() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const columns: GridColDef[] = [
    {field: 'brand', headerName: 'Brand', width: 200},
    {field: 'model', headerName: 'Model', width: 200},
    {field: 'color', headerName: 'Color', width: 200},
    {field: 'registerNumber', headerName: 'Reg.nr.', width: 150},
    {field: 'modelYear', headerName: 'Model Year', width: 150},
    {field: 'price', headerName: 'Price', width: 150},
    {
      field: "delete",
      headerName: "",
      width: 90,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params: GridCellParams) => (
        <button
          onClick={() => {
            if (window.confirm(`Are you sure you want to delete ${params.row.brand} ${params.row.model}?`)) {
              mutate(params.row._links.car.href);
            }
          }}
        >
          Delete
        </button>
      )
    }
  ];

  const {data, error, isSuccess} = useQuery({
    queryKey: ["cars"],
    queryFn: getCars
  });

  const {mutate} = useMutation(deleteCar, {
    onSuccess: () => {
      setOpen(true);
      queryClient.invalidateQueries({queryKey: ["cars"]});
    },
    onError: (err) => {
      console.error(err);
    },
  });

  if (!isSuccess) {
    return <span>Loading...</span>
  } else if (error) {
    return <span>Error when fetching cars...</span>
  }
  else {
    return (
      <>
        <AddCar />
        <DataGrid
          rows={data}
          columns={columns}
          disableRowSelectionOnClick={true}
          getRowId={(row) => row._links.self.href}
        />
        <Snackbar
          open={open}
          autoHideDuration={2000}
          onClose={() => setOpen(false)}
          message="Car deleted"
        />
      </>
    )
  }
}

export default Carlist;