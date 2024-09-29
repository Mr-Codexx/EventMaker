import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import EventCalendar from './Components/Calendar';
import EventDetail from './Components/EventDetail';
import BirthdayScene from './Celebration/BirthdayScene';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<EventCalendar />} />
        <Route path="*" element={<p>No Page</p>} />
        <Route path="/event/:id" element={<EventDetail />} />
      </Routes>
    </Router>


  );
}

export default App;
