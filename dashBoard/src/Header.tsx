import { ChangeEvent, useContext, useState } from 'react';
import { Box, Typography, Button, Menu, MenuItem, Modal, TextField, TextareaAutosize, Chip } from '@mui/material';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { boardContext } from './App';

const Header = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [eventTitle, setEventTitle] = useState('');
    const [eventDate, setEventDate] = useState<Date>(new Date());
    const [eventDescription, setEventDescription] = useState('');

    const [tags, setTags] = useState<any>([]);
    const [inputValue, setInputValue] = useState<any>('');

    const { setEvents } = useContext(boardContext)

    const handleInputChange = (e: any) => {
        setInputValue(e.target.value);
    };

    const handleInputKeyPress = (e: any) => {
        if (e.key === 'Enter' && inputValue.trim() !== '') {
            const hash = inputValue.includes('#') ? inputValue : "#" + inputValue
            setTags((tags) => [...tags, hash.trim()]);
            setInputValue('');
        }
    };

    const handleDeleteTag = (tag) => {
        setTags(tags.filter((t) => t !== tag));
    };


    const handleOpenMenu = (event: any) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    const handleOpenModal = () => {
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const handleCreateEvent = () => {
        const newEvent = {
            avatar: 'https://lh3.googleusercontent.com/a/AGNmyxY0JJKLLjGUPb9V9SQ1EYZjvqF166yNcVV8z2sF=s96-c',
            author: 'Nikita Savchuck',
            eventTitle,
            eventDate: eventDate.toISOString(),
            eventDescription,
            tags
        }

        console.log(newEvent);
        setEvents((events) => [...events, { ...newEvent, id: events.length + 1 }])
        handleCloseModal()
    };

    return (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', backgroundColor: '#f5f5f5' }}>
            <Box>
                <img src="https://rise.hys-enterprise.com/assets/hys-logo.svg" alt="Logo" style={{ height: '40px' }} />
            </Box>
            <Box>
                <Button variant="contained" color="primary" onClick={handleOpenMenu}>
                    Выбрать категорию
                </Button>
                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu} elevation={1}>
                    <MenuItem onClick={handleCloseMenu}>Досуг</MenuItem>
                    <MenuItem onClick={handleCloseMenu}>Волонтерство</MenuItem>
                </Menu>
            </Box>
            <Box>
                <Button variant="outlined" color="primary" onClick={handleOpenModal}>
                    Создать мероприятие
                </Button>
            </Box>
            <Modal open={openModal} onClose={handleCloseModal}>
                <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, backgroundColor: '#fff', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)', padding: '16px 24px' }}>
                    <Typography variant="h6" gutterBottom>
                        Новое мероприятие
                    </Typography>
                    <form>
                        <TextField
                            label="Создать мероприятие"
                            variant="outlined"
                            fullWidth
                            value={eventTitle}
                            onChange={(e) => setEventTitle(e.target.value)}
                            sx={{ marginBottom: '16px' }}
                        />
                        <DatePicker
                            selected={eventDate}
                            onChange={(date) => date && setEventDate(date)}
                            dateFormat="dd/MM/yyyy"
                            className='calendar'
    />
                        <TextareaAutosize
                            placeholder="Детальное описание"
                            minRows={4}
                            maxRows={8}
                            value={eventDescription}
                            onChange={(e) => setEventDescription(e.target.value)}
                            style={{ width: '100%', marginBottom: '16px' }}
                        />
                        <Box sx={{ marginBottom: '16px' }}>
                            <TextField
                                label="Хештеги"
                                variant="outlined"
                                fullWidth
                                value={inputValue}
                                onChange={handleInputChange}
                                onKeyPress={handleInputKeyPress}
                                sx={{ marginBottom: '8px' }}
                            />
                            <Box sx={{ display: 'flex', gap: '8px' }}>
                                {tags.map((tag, index) => (
                                    <Chip key={index} label={tag} onDelete={() => handleDeleteTag(tag)} />
                                ))}
                            </Box>
                        </Box>
                        <Typography variant="body2" sx={{ textAlign: 'right', marginBottom: '8px', color: `${eventDescription.length <= 200 ? 'black' : 'red'}` }}>
                            {eventDescription.length}/200
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Button variant="contained" color="primary" onClick={handleCreateEvent}>
                                Создать
                            </Button>
                            <Button variant="outlined" color="primary" onClick={handleCloseModal}>
                                Отмена
                            </Button>
                        </Box>
                    </form>
                </Box>
            </Modal>
        </Box>
    );
};

export default Header;
