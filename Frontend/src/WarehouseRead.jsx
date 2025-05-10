// warehouseread.jsx
import React from 'react';
import { 
  DialogTitle,
  DialogContent,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Button,
  DialogActions
} from "@mui/material";

const WarehouseRead = ({ employeeData, onClose }) => {


  return (
    <div>
      <DialogTitle sx={{ textAlign: 'center' }}>Warehouse Details</DialogTitle>
      <DialogContent>
        <Table sx={{
          width: '100%',
          borderCollapse: 'collapse',
          margin: '0 auto',
          maxWidth: '600px'
        }}>
          <TableBody>
            <TableRow>
              <TableCell><strong>Warehouse ID:</strong></TableCell>
              <TableCell>{employeeData.warehouse_id}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell><strong>Location:</strong></TableCell>
              <TableCell>{employeeData.location}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell><strong>Capacity:</strong></TableCell>
              <TableCell>{employeeData.capacity}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </DialogContent>
      <DialogActions>
        <Button 
          onClick={onClose}
          variant="contained"
          sx={{
            backgroundColor: "#f39c12",
            color: "#fff",
            "&:hover": {
              backgroundColor: "#f39c12",
            },
          }}
        >
          Close
        </Button>
      </DialogActions>
    </div>
  );
};

export default WarehouseRead;