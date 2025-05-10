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
  Button,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import DownloadIcon from '@mui/icons-material/Download';
import axios from "axios";
import Grid from '@mui/material/Grid';
import WarehouseRead from './WarehouseRead';
import WarehouseUpdate from './WarehouseUpdate';
import WarehouseCreate from './WarehouseCreate';
const Warehouse = () => {
  const [data, setData] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [openReadModal, setOpenReadModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false); // New state for delete confirmation
  const [deleteId, setDeleteId] = useState(null); // Store ID to delete
  const [openCreateModal, setOpenCreateModal] = useState(false);
  useEffect(() => {
    axios
      .get("http://127.0.0.1:3000/warehouse")
      .then((res) => {
        const warehouseData = res.data.results;
        setData(warehouseData || []);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const handleRead = (id) => {
    const selected = data.find(item => item.warehouse_id === id);
    setSelectedEmployee(selected);
    setOpenReadModal(true);
  };

  const handleEdit = (id) => {
    const selected = data.find(item => item.warehouse_id === id);
    setSelectedEmployee(selected);
    setOpenUpdateModal(true);
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setOpenDeleteDialog(true); // Open delete confirmation dialog
  };

  const handleDeleteConfirm = () => {
    axios
      .delete(`http://127.0.0.1:3000/warehouse/${deleteId}`)
      .then(() => {
        // Remove the deleted item from the state
        setData(data.filter(item => item.warehouse_id !== deleteId));
        setOpenDeleteDialog(false);
        setDeleteId(null);
      })
      .catch((err) => {
        console.error("Error deleting warehouse:", err);
        setOpenDeleteDialog(false);
        setDeleteId(null);
      });
  };
  const handleCreateClick = () => {
    setOpenCreateModal(true);
  };
  const handleCreate = (newWarehouse) => {
    setData([...data, newWarehouse]);
  };
  const handleClose = () => {
    setOpenReadModal(false);
    setOpenUpdateModal(false);
    setOpenDeleteDialog(false);
    setSelectedEmployee(null);
    setDeleteId(null);
  };

  return (
    <>
      <Grid container mt={10} spacing={2} sx={{ width: '85%', display: 'flex', justifyContent: 'right'}} >
        <Grid item>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#f39c12",
              color: "#fff",
              "&:hover": { backgroundColor: "#f39c12" },
            }}onClick={handleCreateClick}
          >
            <CreateNewFolderIcon />
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            sx={{ backgroundColor: "#f39c12", color: "#fff", "&:hover": { backgroundColor: "#f39c12" } }}
          >
            <DownloadIcon />
          </Button>
          <Menu>
            <MenuItem>Excel</MenuItem>
            <MenuItem>PDF</MenuItem>
          </Menu>
        </Grid>
      </Grid>

      <div className="warehouse-table">
        <TableContainer className="table-container">
          <Table>
            <TableHead>
              <TableRow className="table-header">
                <TableCell><Checkbox /></TableCell>
                <TableCell>Warehouse ID</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Capacity</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((item) => (
                <TableRow key={item.warehouse_id} className="table-row">
                  <TableCell><Checkbox /></TableCell>
                  <TableCell>{item.warehouse_id}</TableCell>
                  <TableCell>{item.location}</TableCell>
                  <TableCell>{item.capacity}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleRead(item.warehouse_id)}>
                      <VisibilityIcon color="primary" />
                    </IconButton>
                    <IconButton onClick={() => handleEdit(item.warehouse_id)}>
                      <EditIcon color="action" />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteClick(item.warehouse_id)}>
                      <DeleteIcon color="error" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      <Dialog open={openReadModal} onClose={handleClose}>
        <WarehouseRead employeeData={selectedEmployee} onClose={handleClose} />
      </Dialog>
      <Dialog open={openUpdateModal} onClose={handleClose}>
        <WarehouseUpdate open={openUpdateModal} employeeData={selectedEmployee} onClose={handleClose} />
      </Dialog>
      <Dialog open={openCreateModal} onClose={handleClose}>
      <WarehouseCreate 
        open={openCreateModal} 
        onClose={handleClose} 
        onCreate={handleCreate}
      />
</Dialog>
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Confirm Delete"}
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this warehouse? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Warehouse;