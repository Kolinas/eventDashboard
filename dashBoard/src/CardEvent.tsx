import { useState } from 'react';
import { Paper, Typography, Avatar, Button, Box, Chip } from '@mui/material';
import CustomModal from './CustomModal';
import CloseIcon from '@mui/icons-material/Close';
import { iEvent } from './App';


const CardEvent = ({ id, authorName, authorAvatar, eventTitle, eventDate, eventDescription, tags }: iEvent) => {

  const [open, setOpen] = useState(false);

  const handleOpenModal = () => {
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
  };

  const transformDate = (date: Date) => {

    const dateObj = new Date(date);
    const day = dateObj.getDate().toString().padStart(2, '0');
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    const year = dateObj.getFullYear();

    return `${day}:${month}:${year}`
  }

  const transformTime = (date: Date) => {
    const dateObj = new Date(date);

    const hours = dateObj.getHours().toString().padStart(2, '0');
    const minutes = dateObj.getMinutes().toString().padStart(2, '0');

    return `${hours}:${minutes}`
  }

  return (
    <Box sx={{ marginBottom: '16px' }}>
      <Paper elevation={5} sx={{ padding: '16px', borderRadius: '10px', backgroundColor: '#f5f5f5', position: 'relative' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
          <Avatar src={authorAvatar} />
          <Typography variant="body1" sx={{ marginLeft: '8px' }}>
            {authorName}
          </Typography>
          <Box sx={{marginLeft: 'auto', cursor: 'pointer', alignSelf: 'start'}} >
          <CloseIcon/>
          </Box>
        </Box>
        <Typography variant="body1" gutterBottom sx={{minHeight: '50px'}}>
          <span className='font-bold'>Event</span>: {eventTitle}
        </Typography>
        <Typography variant="body2" sx={{ marginBottom: '8px' }}>
          <span className='font-bold'>Date:</span> {transformDate(eventDate)}
        </Typography>
        <Typography variant="body2" sx={{ marginBottom: '8px' }}>
          <span className='font-bold'>Time:</span> {transformTime(eventDate)}
        </Typography>
        <Box>
          <Button variant="contained" color="primary" onClick={handleOpenModal}>
            Join
          </Button>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'flex-start', marginTop: '10px', flexWrap: 'wrap', gap: '5px', minHeight: '53px' }}>
          {tags.map(tag => (
            <Chip key={tag} label={tag} size="small" sx={{ marginRight: '4px' }} />
          ))}
        </Box>
      </Paper>
      <CustomModal title='Event details' handleCloseModal={handleCloseModal} open={open}>
        <Typography variant="body1">
          {eventDescription}
        </Typography>
      </CustomModal>
    </Box>
  );
};

export default CardEvent;
