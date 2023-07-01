import { Dispatch, SetStateAction, createContext, useCallback, useState } from 'react'
import './App.css'
import Dashboard from './components/Dashboard'
import Header from './components/Header'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Logins';

export interface iEvent {
  id: number;
  authorName: string;
  authorAvatar: string;
  eventTitle: string;
  eventDate: Date;
  eventDescription: string;
  tags: string[];
}

export interface iUser {
  name: string;
  email: string;
  // Add any other user properties you need
}


function App() {

  const [term, setTerm] = useState('')

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
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
    </div>
  )
}

export default App