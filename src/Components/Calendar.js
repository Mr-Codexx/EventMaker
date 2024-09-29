import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Calendar from 'react-calendar';
import ReactQuill from 'react-quill'; // Import React Quill
import 'react-quill/dist/quill.snow.css'; // Import React Quill CSS
import 'react-calendar/dist/Calendar.css';
import { BsCalendar } from 'react-icons/bs'; // Import Bootstrap calendar icon

const EventForm = () => {
  const [userName, setUserName] = useState(''); // State for username
  const [eventType, setEventType] = useState('');
  const [eventText, setEventText] = useState('');
  const [eventImages, setEventImages] = useState([]); // State for multiple images
  const [imagePreviews, setImagePreviews] = useState([]); // State for image previews
  const [selectedDate, setSelectedDate] = useState(new Date()); // State for selected date
  const [showCalendar, setShowCalendar] = useState(false); // State to manage calendar visibility
  const [modalShow, setModalShow] = useState(false);
  const [currentShareLink, setCurrentShareLink] = useState('');

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files); // Convert FileList to an array
    const imagePreviewsArray = files.map((file) => URL.createObjectURL(file)); // Generate previews
    const imagesArray = [];

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        imagesArray.push(reader.result); // Add base64 image to array
        if (imagesArray.length === files.length) {
          setEventImages(imagesArray); // Set images when all have been read
        }
      };
      reader.readAsDataURL(file);
    });

    setImagePreviews(imagePreviewsArray); // Set image previews
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (userName && eventType && eventText) {
      const timestamp = Date.now();
      const formattedDate = selectedDate.toISOString().split('T')[0]; // Format date

      // Create the event in the database
      await fetch(`https://codexx-app-default-rtdb.firebaseio.com/User-events/${formattedDate}/${timestamp}.json`, {
        method: 'PUT',
        body: JSON.stringify({
          userName,
          eventType,
          eventText,
          eventImages, // Send array of images
          date: formattedDate,
        }),
      });

      // Generate the shareable link with username
      setCurrentShareLink(`http://localhost:3000/event/${timestamp}`);
      setModalShow(true); // Show the modal after creating an event
      resetForm();
    }
  };

  const resetForm = () => {
    setUserName('');
    setEventType('');
    setEventText('');
    setEventImages([]);
    setImagePreviews([]);
    setSelectedDate(new Date());
    setShowCalendar(false); // Hide calendar on reset
  };

  const handleShareClick = () => {
    navigator.clipboard.writeText(currentShareLink);
    alert('Link copied to clipboard! Now you can share it anywhere.');
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center">Create Event</h1>
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="mb-3">
          <label htmlFor="userName" className="form-label">Your Name</label>
          <input
            type="text"
            id="userName"
            className="form-control"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            required
            placeholder="Enter your name"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="eventType" className="form-label">Select Event Type</label>
          <select
            id="eventType"
            className="form-select"
            value={eventType}
            onChange={(e) => setEventType(e.target.value)}
            required
          >
            <option value="">Choose...</option>
            <option value="Birthday">Birthday</option>
            <option value="Anniversary">Anniversary</option>
            <option value="Meeting">Meeting</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="eventDate" className="form-label">Select Event Date</label>
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              value={selectedDate.toISOString().split('T')[0]} // Display selected date in YYYY-MM-DD format
              readOnly
            />
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={() => setShowCalendar(!showCalendar)} // Toggle calendar visibility
            >
              <BsCalendar />
            </button>
          </div>
          {showCalendar && (
            <Calendar
              onChange={(date) => {
                setSelectedDate(date);
                setShowCalendar(false); // Hide calendar after date selection
              }}
              value={selectedDate}
              className="mb-3"
            />
          )}
        </div>

        <div className="mb-3">
          <label htmlFor="eventText" className="form-label">Event Details</label>
          <ReactQuill
            value={eventText}
            onChange={setEventText}
            className="mb-3"
            theme="snow"
            placeholder="Enter event details..."
          />
        </div>

        <div className="mb-3">
          <label htmlFor="eventImage" className="form-label">Upload Images</label>
          <input
            type="file"
            className="form-control"
            id="eventImage"
            accept="image/*"
            multiple // Allow multiple file uploads
            onChange={handleImageChange}
          />
          {imagePreviews.length > 0 && (
            <div className="mt-2">
              {imagePreviews.map((preview, index) => (
                <img
                  key={index}
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  className="img-thumbnail me-2"
                  style={{ width: '10%', maxHeight: '50px', objectFit: 'cover' }}
                />
              ))}
            </div>
          )}
        </div>

        <button type="submit" className="btn btn-primary">Create Event</button>
      </form>

      {/* Share Modal */}
      {modalShow && (
        <div className="modal show" style={{ display: 'block' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Share Event</h5>
                <button type="button" className="close" onClick={() => setModalShow(false)}>
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <p>Shareable Link: <strong>{currentShareLink}</strong></p>
                <button className="btn btn-primary" onClick={handleShareClick}>Copy Link</button>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setModalShow(false)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Overlay for modal */}
      {modalShow && <div className="modal-backdrop fade show"></div>}
    </div>
  );
};

export default EventForm;
