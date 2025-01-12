import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginForm from './components/LogInForm' 
import HomePage from './components/HomePage'
import AddAppointment from './components/AddAppointment';

function App() {
 return (
     <Router>
      <Routes>
        <Route path="/homepage" element={<HomePage />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path='/add' element={<AddAppointment />} />
      </Routes>
    </Router>
  );
}

export default App
