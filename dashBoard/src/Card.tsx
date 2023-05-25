import React from 'react';
import { Paper, Typography, Avatar, Button, Modal, Box, Chip } from '@mui/material';
import CustomModal from './CustomModal';

const Card = () => {
  const [open, setOpen] = React.useState(false);

  const handleOpenModal = () => {
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ marginBottom: '16px' }}>
      <Paper elevation={5} sx={{ padding: '16px', borderRadius: '10px', backgroundColor: '#f5f5f5', position: 'relative' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
          <Avatar src='https://lh3.googleusercontent.com/a/AGNmyxY0JJKLLjGUPb9V9SQ1EYZjvqF166yNcVV8z2sF=s96-c'/>
          <Typography variant="body1" sx={{ marginLeft: '8px' }}>
            Nikita Savchuck
          </Typography>
        </Box>
        <Typography variant="body1" gutterBottom>
          Поход в кино на Стражи Галактики 3
        </Typography>
        <Typography variant="body2" sx={{ marginBottom: '8px' }}>
          Дата: 22.06.2023
        </Typography>
        <Box>
          <Button variant="contained" color="primary" onClick={handleOpenModal}>
            Присоединиться
          </Button>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'flex-start', marginTop: '10px', flexWrap: 'wrap', gap: '5px'}}>
          <Chip label="#походвкино" size="small" sx={{ marginRight: '4px' }} />
          <Chip label="#досуг" size="small" sx={{ marginRight: '4px' }} />
          <Chip label="#развлечения" size="small" sx={{ marginRight: '4px' }} />
          <Chip label="#чилотдых" size="small" sx={{ marginRight: '4px' }} />
        </Box>
      </Paper>
      <CustomModal title='Детали мероприятия' handleCloseModal={handleCloseModal} open={open}>
      <Typography variant="body1">
            Содержимое модального окна...
          </Typography>
      </CustomModal>
    </Box>
  );
};

export default Card;
