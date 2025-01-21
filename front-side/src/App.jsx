import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginForm from './components/LogInForm' 
import HomePage from './components/HomePage'
import AddAppointment from './components/AddAppointment';
import Appointments from './components/Appointments';
import LogOut from './components/LogOut';
import ClientDetails from './components/ClientDetails';
import CreateNewClient from './components/CreateNewClient';

function App() {
 return (
     <Router>
      <Routes>
        <Route path='/' element={<HomePage/>}></Route>
        <Route path="/homepage" element={<HomePage />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path='/add' element={<AddAppointment />} />
        <Route path='/appointments' element={<Appointments/>}></Route>
        <Route path='/logout' element={<LogOut/>}></Route>
        <Route path="/client-details" element={<ClientDetails />} />
        <Route path='/clients' element={<HomePage/>}></Route>
        <Route path='/clients/add' element={<CreateNewClient/>}></Route>
      </Routes>
    </Router>
  );
}

export default App
