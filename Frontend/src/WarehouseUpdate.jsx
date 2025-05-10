import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogActions, DialogTitle, Button, TextField } from '@mui/material';

const WarehouseUpdate = ({ open, onClose, employeeData }) => {
  const [formData, setFormData] = useState({
    location: '',
    capacity: ''
  });

  console.log('WarehouseUpdate mounted - Props:', { open, employeeData });

  useEffect(() => {
    console.log('WarehouseUpdate useEffect - employeeData:', employeeData);
    if (employeeData) {
      setFormData({
        location: employeeData.location || '',
        capacity: employeeData.capacity || ''
      });
      console.log('Form data set to:', { location: employeeData.location, capacity: employeeData.capacity });
    } else {
      console.log('No employeeData provided');
    }
  }, [employeeData]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    console.log('handleChange:', { name, value });
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdate = (event) => {
    event.preventDefault();
    console.log('handleUpdate triggered');
    if (!employeeData?.warehouse_id) {
      console.log('No warehouse ID provided');
      alert('No warehouse ID provided!');
      return;
    }
    console.log('Submitting update with data:', formData);
    axios.put(`http://127.0.0.1:3000/warehouse/${employeeData.warehouse_id}`, formData)
      .then(() => {
        console.log('Update successful');
        alert('Warehouse updated successfully!');
        onClose();
      })
      .catch((error) => {
        console.error('Update failed:', error);
        alert('Update failed!');
      });
  };

  console.log('WarehouseUpdate rendering - open:', open, 'formData:', formData);

  return (
    <Dialog open={open} onClose={onClose}>  
      <DialogTitle>Edit Warehouse</DialogTitle>    
      <form onSubmit={handleUpdate}>       
        <DialogContent>           
         
            <>
              <TextField            
                margin="dense"
                label="Location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                
              />
              <TextField
                margin="dense"
                label="Capacity"
                name="capacity"
                type="number"
                value={formData.capacity}
                onChange={handleChange}
                
              />
            </>
         
            
                  </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit"  variant="contained"
          sx={{
            backgroundColor: "#f39c12",
            color: "#fff",
            "&:hover": {
              backgroundColor: "#f39c12",
            },
          }}  disabled={!employeeData}>
            Update
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default WarehouseUpdate;