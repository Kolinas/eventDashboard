import { ChangeEvent, useContext, useState } from 'react';
import { Box, Typography, Button, Menu, MenuItem, Modal, TextField, TextareaAutosize, Chip, OutlinedInput, InputAdornment } from '@mui/material';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { boardContext } from './App';

export const toSnakeCase = <T extends Record<string, any>>(obj: T) => {
    const result: Record<string, any> = {};
  
    for (const key in obj) {
      const snakeCaseKey = key.replace(/[A-Z]/g, (match) => `_${match.toLowerCase()}`);
      result[snakeCaseKey] = obj[key];
    }
  
    return result;
  };

const Header = ({setTerm, term}) => {
    const [openModal, setOpenModal] = useState(false);
    const [eventTitle, setEventTitle] = useState('');
    const [eventDate, setEventDate] = useState<Date>(new Date());
    const [eventDescription, setEventDescription] = useState('');


    const [tags, setTags] = useState<string[]>([]);
    const [inputValue, setInputValue] = useState<any>('');

    const [tagError, setTagError] = useState('');
    const [titleError, setTitleError] = useState('');

    const { setEvents } = useContext(boardContext)

    const handleInputChange = (e: any) => {
        setInputValue(e.target.value);
    };

    const createTag = () => {
        if (!inputValue) return
        if(inputValue.length > 10) {
            setTagError("Tag length must not be more than 10 characters");
            setInputValue('');
            return
        }
        if (tags.length >= 4) {
            setTagError("You cant create more then 4 tags");
            setInputValue("");
            return
        }
        const hash = inputValue.includes('#') ? inputValue : "#" + inputValue
        setTagError("");
        setTags((tags) => [...tags, hash.replace(/\s+/g, '')]);
        setInputValue('');
    }

    const handleInputKeyPress = (e: any) => {
        if (e.key === 'Enter' && inputValue.trim() !== '') {
            createTag()
        }
    };

    const handleDeleteTag = (tag: string) => {
        setTags(tags.filter((t) => t !== tag));
    };

    const handleOpenModal = () => {
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        reset()
    };

    const setEventTitile = (e) => {
        if (eventTitle.length >= 60) {
            setTitleError('The title must be no more 60 characters')
        } else {
            setTitleError('')
        }
        setEventTitle(e.target.value)
    }

    const reset = () => {
        setEventTitle('')
        setEventDate(new Date())
        setEventDescription('')
        setTags([])
    }

    const handleCreateEvent = async () => {

        const newEvent = {
            eventTitle,
            eventDate: eventDate.toISOString(),
            eventDescription,
            tags,
        }

        const sendEvent = {...newEvent, tags}

        console.log(JSON.stringify(toSnakeCase(newEvent)));

        const response = await fetch('http://127.0.0.1:8000/events', {
            method: 'POST',
            // mode: "no-cors",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(toSnakeCase(sendEvent))
        });
    
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    
        const data = await response.json();

        console.log(data);
        
        setEvents((events) => [...events, { ...newEvent, id: events.length + 1 }])
        handleCloseModal()
        reset()
    };

    return (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px'}}>
            <Box>
                <img src="https://rise.hys-enterprise.com/assets/hys-logo.svg" alt="Logo" style={{ height: '40px' }} />
            </Box>
            <Box sx={{width: '50%', padding: '10px'}}>
            <TextField fullWidth label="Search #" id="fullWidth" value={term} onChange={(e) => setTerm(e.target.value)}/>
            </Box>
            <Box>
                <Button variant="outlined" color="primary" onClick={handleOpenModal}>
                    Create Event
                </Button>
            </Box>
            <Modal open={openModal} onClose={handleCloseModal}>
                <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, backgroundColor: '#fff', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)', padding: '16px 24px', borderRadius: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        New Event
                    </Typography>
                    <form>
                        <TextField
                            label="Event title"
                            variant="outlined"
                            fullWidth
                            value={eventTitle}
                            onChange={setEventTitile}
                            sx={{ marginBottom: '16px' }}
                            error={titleError.length > 0}
                            helperText={titleError}
                        />
                        <DatePicker
                            selected={eventDate}
                            onChange={(date) => date && setEventDate(date)}
                            className='border w-full mb-2 rounded-md p-2'
                            timeInputLabel="Time:"
                            dateFormat="MM/dd/yyyy h:mm aa"
                            showTimeInput
                        />
                        <TextareaAutosize
                            placeholder="Details"
                            minRows={4}
                            maxRows={8}
                            value={eventDescription}
                            onChange={(e) => setEventDescription(e.target.value)}
                            className='border rounded-md'
                            style={{ width: '100%', marginBottom: '16px', padding: '16px' }}
                        />
                        <Box sx={{ marginBottom: '16px' }}>
                            <TextField
                                label="Hashtags"
                                variant="outlined"
                                fullWidth
                                value={inputValue}
                                onChange={handleInputChange}
                                onKeyPress={handleInputKeyPress}
                                onBlur={createTag}
                                sx={{ marginBottom: '8px', zIndex: 0 }}
                                error={tagError.length > 0}
                                helperText={tagError}
                            />
                            <Box sx={{ display: 'flex', gap: '8px', flexWrap: 'wrap'}}>
                                {tags.map((tag, index) => (
                                    <Chip key={index} label={tag} onDelete={() => handleDeleteTag(tag)} />
                                ))}
                            </Box>
                        </Box>
                        <Typography variant="body2" sx={{ textAlign: 'right', marginBottom: '8px', color: `${eventDescription.length <= 200 ? 'black' : 'red'}` }}>
                            {eventDescription.length}/200
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Button
                                disabled={!eventTitle || !eventDescription || eventDescription.length > 200}
                                variant="contained"
                                color="primary"
                                onClick={handleCreateEvent}>
                                Create
                            </Button>
                            <Button variant="outlined" color="primary" onClick={handleCloseModal}>
                                Cansel
                            </Button>
                        </Box>
                    </form>
                </Box>
            </Modal>
        </Box>
    );
};

export default Header;
