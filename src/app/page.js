'use client';
import { useState, useEffect } from 'react';
import { firestore } from "../../firebase";
import { Box, Typography, Modal, Button, TextField, List, ListItem, ListItemText, IconButton, Paper } from "@mui/material";
import { Add, Remove } from "@mui/icons-material";
import { collection, query, getDocs, doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      });
    });
    setInventory(inventoryList);
    setFilteredInventory(inventoryList);
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
      updateInventory();
    }
  };

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }
    updateInventory();
  };

  useEffect(() => {
    updateInventory();
  }, []);

  useEffect(() => {
    const filtered = inventory.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredInventory(filtered);
  }, [searchTerm, inventory]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleAddItem = () => {
    addItem(itemName);
    setItemName('');
  };

  const handleRemoveItem = () => {
    removeItem(itemName);
    setItemName('');
  };

  return (
    <Box
      sx={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 3,
        padding: 4,
        bgcolor: '#fff8e1',  // Light yellow background for the whole page
        boxSizing: 'border-box', // Ensuring the padding and border are included in the element's total width and height
      }}
    >
      <Typography variant="h3" component="h1" gutterBottom sx={{ color: '#6d4c41' }}> {/* Brown color */}
        Pantry Tracker
      </Typography>

      <TextField
        label="Search Inventory"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        fullWidth
        margin="normal"
        sx={{ maxWidth: 600 }}
      />

      <Button variant="contained" onClick={handleOpen} sx={{ bgcolor: '#8d6e63', color: '#fff' }}> {/* Brown button */}
        Manage Inventory
      </Button>

      <Paper
        elevation={3}
        sx={{
          width: '100%',
          maxWidth: 600,
          maxHeight: 400, // Set a max height for the list
          overflowY: 'auto', // Enable vertical scrolling if content exceeds max height
          marginTop: 3,
          bgcolor: '#f1f8e9',  // Light green background
          borderRadius: 2,
          boxShadow: 2,
        }}
      >
        <List>
          {filteredInventory.map((item) => (
            <ListItem key={item.name} sx={{ borderBottom: '1px solid #ddd', '&:last-child': { borderBottom: 'none' } }}>
              <ListItemText
                primary={item.name}
                secondary={`Quantity: ${item.quantity}`}
                primaryTypographyProps={{ fontWeight: 'bold', color: '#4e342e' }}  // Dark brown text
              />
              <IconButton edge="end" aria-label="add" onClick={() => addItem(item.name)} sx={{ color: '#388e3c' }}>  {/* Green color */}
                <Add />
              </IconButton>
              <IconButton edge="end" aria-label="remove" onClick={() => removeItem(item.name)} sx={{ color: '#d32f2f' }}>  {/* Red color */}
                <Remove />
              </IconButton>
            </ListItem>
          ))}
        </List>
      </Paper>

      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" component="h2" gutterBottom sx={{ color: '#6d4c41' }}>  {/* Brown color */}
            Add or Remove Item
          </Typography>
          <TextField
            label="Item Name"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            fullWidth
            margin="normal"
          />
          <Box display="flex" justifyContent="space-between" mt={2}>
            <Button variant="contained" color="primary" onClick={handleAddItem} sx={{ bgcolor: '#388e3c' }}>  {/* Green button */}
              Add Item
            </Button>
            <Button variant="contained" color="secondary" onClick={handleRemoveItem} sx={{ bgcolor: '#d32f2f' }}>  {/* Red button */}
              Remove Item
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}
