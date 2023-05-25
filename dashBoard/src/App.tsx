import { Dispatch, SetStateAction, createContext, useCallback, useState } from 'react'
import './App.css'
import Dashboard from './Dashboard'
import Header from './Header'
import { Grid, Pagination, Select, MenuItem, Box } from '@mui/material';

export interface iEvent {
  id: number;
  author: string;
  avatar: string;
  eventTitle: string;
  eventDate: string;
  eventDescription: string;
  tags: string[];
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const boardContext = createContext({events: [] as iEvent[], setEvents: (() => {}) as Dispatch<SetStateAction<iEvent[]>> })

const {Provider} = boardContext

function App() {

  const [events, setEvents] = useState<iEvent[] | []>([])

  console.log(events);

  const handlePageChange = useCallback((event: any, page: any) => {
    console.log(page);
  },[])
  
  return (
    <div style={{height: '100vh', display: 'flex', flexDirection: 'column'}}>
      <Provider value={{events, setEvents}}>
    <Header/>
    <Dashboard/>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f5f5f5', marginTop: 'auto', padding: '0px 16px' }}>
    <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            {/* Dropdown for selecting card quantity */}
            <Select value={10}>
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={20}>20</MenuItem>
              <MenuItem value={30}>30</MenuItem>
            </Select>
          </Grid>
          <Grid item>
            {/* Pagination */}
            <Pagination count={10} onChange={handlePageChange} variant="outlined" shape="rounded" />
          </Grid>
        </Grid>
    </Box>
    </Provider>
    </div>
  )
}

export default App
