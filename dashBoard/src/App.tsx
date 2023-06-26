import { Dispatch, SetStateAction, createContext, useCallback, useState } from 'react'
import './App.css'
import Dashboard from './Dashboard'
import Header from './Header'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Logins';

export interface iEvent {
  id: number;
  author: string;
  avatar: string;
  eventTitle: string;
  eventDate: Date;
  eventDescription: string;
  tags: string[];
  setEvents: Dispatch<SetStateAction<iEvent[]>>;
}

export interface iUser {
  name: string;
  email: string;
  // Add any other user properties you need
}

export interface iContext {
  events: iEvent[];
  setEvents: Dispatch<SetStateAction<iEvent[]>>;
  user: iUser | null;
  setUser: Dispatch<SetStateAction<iUser | null>>;
}

export const boardContext = createContext<iContext>({
  events: [],
  setEvents: () => { },
  user: null,
  setUser: () => { }
});

function App() {
  const [events, setEvents] = useState<iEvent[]>([]);
  const [user, setUser] = useState<any | null>(null);
  const [term, setTerm] = useState('')


  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <boardContext.Provider value={{ events, setEvents, user, setUser }}>
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route
              path="/dashboard"
              element={
                <>
                  <Header term={term} setTerm={setTerm}/>
                  <Dashboard term={term}/>
                </>} />
          </Routes>
        </Router>
      </boardContext.Provider>
    </div>
  )
}

export default App
