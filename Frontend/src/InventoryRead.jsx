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

const InventoryRead = ({ employeeData, onClose }) => {


  return (
    <div>
      <DialogTitle sx={{ textAlign: 'center' }}>Inventory Details</DialogTitle>
      <DialogContent>
        <Table sx={{
          width: '100%',
          borderCollapse: 'collapse',
          margin: '0 auto',
          maxHeight: '100%'
        }}>
          <TableBody>
            <TableRow>
              <TableCell><strong>Inventory ID:</strong></TableCell>
              <TableCell>{employeeData.inventory_id}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell><strong>Warehouse ID:</strong></TableCell>
              <TableCell>{employeeData.warehouse_id}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell><strong>Product ID:</strong></TableCell>
              <TableCell>{employeeData.product_id}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell><strong>Quantity:</strong></TableCell>
              <TableCell>{employeeData.quantity}</TableCell>
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

export default InventoryRead;