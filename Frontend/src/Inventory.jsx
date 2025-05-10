import React, { useEffect, useState } from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  Checkbox,
  TableContainer,
  IconButton,
  Paper,
  Button, Menu, MenuItem,Dialog
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import DownloadIcon from '@mui/icons-material/Download';
import axios from "axios";
import Grid from '@mui/material/Grid';
import InventoryRead from "./InventoryRead";
const Inventory = () => {
  const [data, setData] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  useEffect(() => {
    axios
      .get("http://127.0.0.1:3000/inventory/")
      .then((res) => {
        const InventoryData = res.data.results;
        setData(InventoryData || []);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const handleRead = (id) => {
    const selected = data.find(item => item.inventory_id === id);
    setSelectedEmployee(selected);
    setOpenModal(true); 
  };

  const handleEdit = (id) => {
    console.log("Edit warehouse", id);
  };

  const handleDelete = (id) => {
    console.log("Delete warehouse", id);
  };
  const handleClose = () => {
    setOpenModal(false);
    setSelectedEmployee(null);
  };

  return (
    <>
    {/* <div className="warehouse-button"> */}
    <Grid container mt={10} spacing={2} sx={{ width: '85%', display: 'flex', justifyContent: 'right'}} >
      <Grid item>
      <Button
variant="contained"
sx={{
  backgroundColor: "#f39c12",
  color: "#fff",
  "&:hover": {
    backgroundColor: "#f39c12", // same as normal, so no change on hover
  },
}}
>
<CreateNewFolderIcon />
</Button>
      </Grid>

      <Grid item>
        <Button
           variant="contained"
       
           sx={{ backgroundColor: "#f39c12", color: "#fff", "&:hover": {
            backgroundColor: "#f39c12", // same as normal, so no change on hover
          }, }}
        >
        <DownloadIcon/>
        </Button>
        <Menu>
          <MenuItem>Excel</MenuItem>
          <MenuItem>PDF</MenuItem>
        </Menu>
      </Grid>
    </Grid>
    {/* </div> */}

    <div className="warehouse-table">

      <TableContainer className="table-container">
        <Table>
          <TableHead>
            <TableRow className="table-header">
              <TableCell>
                <Checkbox />
              </TableCell>
              <TableCell>Inventory ID</TableCell>
              <TableCell  >Warehouse ID</TableCell>
              <TableCell >Product ID</TableCell>
              <TableCell >Quantity</TableCell>
              <TableCell >Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.inventory_id} className="table-row">
                <TableCell>
                  <Checkbox />
                </TableCell>
                <TableCell> {item.inventory_id}</TableCell>
                <TableCell>{item.warehouse_id}</TableCell>
                <TableCell>{item.product_id}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleRead(item.warehouse_id)}>
                    <VisibilityIcon color="primary" />
                  </IconButton>
                  <IconButton onClick={() => handleEdit(item.warehouse_id)}>
                    <EditIcon color="action" />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(item.warehouse_id)}>
                    <DeleteIcon color="error" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
      <Dialog open={openModal} onClose={handleClose}>
            <InventoryRead employeeData={selectedEmployee} onClose={handleClose} />
          </Dialog>
  </>
  )
}

export default Inventory
