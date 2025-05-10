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
  Button, Menu, MenuItem
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import DownloadIcon from '@mui/icons-material/Download';
import axios from "axios";
import Grid from '@mui/material/Grid';

const Delivery = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:3000/delivery/Delivery")
      .then((res) => {
        const deliveryData = res.data;
        setData(deliveryData || []);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const handleRead = (id) => {
    console.log("Read warehouse", id);
  };

  const handleEdit = (id) => {
    console.log("Edit warehouse", id);
  };

  const handleDelete = (id) => {
    console.log("Delete warehouse", id);
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
       
             <TableContainer className="table-container" sx={{ maxHeight: "50vh",  overflow: "auto" }}>
               <Table  className="custom-table" sx={{ borderCollapse: "collapse" }}>
                 <TableHead >
                   <TableRow className="table-header">
                     <TableCell >
                       <Checkbox />
                     </TableCell>
                     <TableCell>Delivery ID</TableCell>
                     <TableCell  >Product ID</TableCell>
                     <TableCell >Quantity</TableCell>
                     <TableCell >Shipped date</TableCell>
                     <TableCell >Warehouse ID</TableCell>
                     <TableCell >Actions</TableCell>
                   </TableRow>
                 </TableHead>
                 <TableBody>
                   {data.map((item) => (
                     <TableRow key={item.Delivery_id} className="table-row">
                       <TableCell>
                         <Checkbox />
                       </TableCell>
                       <TableCell> {item.Delivery_id}</TableCell>
                       <TableCell>{item.Product_id}</TableCell>
                       <TableCell>{item.Quantity}</TableCell>
                       <TableCell>{item.Shipped_date}</TableCell>
                       <TableCell>{item.Warehouse_id}</TableCell>
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
         </>
  )
}

export default Delivery
