import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet'; // Import Helmet
import CountdownClock from './CountdownClock';
import './Event.css';
import Video from '../asset/bg.mp4';
import BirthdayCanvas from '../Celebration/BirthdayScene';

const EventDetail = () => {
    const { id } = useParams(); // Get the ID from the URL
    const [event, setEvent] = useState(null);
    const [date, setDate] = useState('');

    useEffect(() => {
        // Fetch the event using the ID from the URL
        const fetchEvent = async () => {
            const response = await fetch(`https://codexx-app-default-rtdb.firebaseio.com/User-events.json`);
            const allEvents = await response.json();

            for (const dateKey in allEvents) {
                if (allEvents[dateKey]) {
                    for (const eventKey in allEvents[dateKey]) {
                        if (eventKey === id) {
                            setEvent(allEvents[dateKey][eventKey]); // Fetch the entire event object
                            setDate(dateKey); // Save the date of the event
                            return;
                        }
                    }
                }
            }

            setEvent(null); // If event not found
        };

        fetchEvent();
    }, [id]);

    // Determine the current date and the event date
    const currentDate = new Date();
    const eventDate = new Date(date);

    const isToday = eventDate.toDateString() === currentDate.toDateString();
    const isPast = eventDate < currentDate;
    const isUpcoming = eventDate > currentDate;

    if (event === null) {
        return (
            <div className="container text-center mt-5">
                <div className="alert alert-danger">Event not found</div>
            </div>
        );
    }

    // Format the user's name
    const formattedUserName = event.userName
        ? event.userName.split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ')
        : 'Guest';

    // Static fallback image if event image is not available
    const fallbackImage = "https://cdn-icons-png.flaticon.com/512/7657/7657766.png";

    // Use the first event image if available, otherwise use the fallback image
    const eventImage = event.eventImages && event.eventImages.length > 0
        ? event.eventImages[0]
        : fallbackImage;

    return (
        <div className="event-detail-container">
            {/* Helmet to set dynamic title and meta tags */}
            <Helmet>
                <title>Happy Birthday {formattedUserName}</title>
                <meta property="og:image" content={eventImage} />
                <meta property="og:title" content={`Happy Birthday ${formattedUserName}`} />
                <meta property="og:description" content={event.eventText || 'Join us in celebrating this special occasion!'} />
            </Helmet>

            <div className="overlay">
                <div className="container mt-5 text-center">
                    <div className="">
                        <nav className="navbar navbar-light mt-0">
                            <a className="home navbar-brand" href="/">
                                <i className="bi bi-calendar-date me-2"></i><span>Go Back to Calendar</span>
                            </a>
                        </nav>
                        <div className="-body">
                            {isToday && (
                                <>
                                    <BirthdayCanvas />
                                    {/* Fullscreen Background Video */}
                                    <video autoPlay loop muted className="bg-video">
                                        <source src={Video} type="video/mp4" />
                                        Your browser does not support the video tag.
                                    </video>

                                    <div className='Details'>
                                        <h1>
                                            HAPPY BIRTHDAY {formattedUserName}
                                        </h1>

                                        <h3 className="subtitle mb-2" dangerouslySetInnerHTML={{ __html: event.eventText }}></h3>
                                        <h3>{eventDate.toDateString()}</h3>
                                    </div>

                                    {event.eventImages && event.eventImages.length > 0 && (
                                        <div className="image-gallery">
                                            {event.eventImages.map((imageUrl, index) => (
                                                <img key={index} src={imageUrl} alt={`Event ${index + 1}`} className="img-thumbnail " />
                                            ))}
                                        </div>
                                    )}
                                </>
                            )}

                            {isPast && !isToday && (
                                <h2 className="text-danger">Event Ended!</h2>
                            )}

                            {isUpcoming && (
                                <>
                                    <CountdownClock targetDate={date} />
                                    <h2 className="text-info">Event scheduled for {eventDate.toDateString()}</h2>
                                    {event.eventImages && event.eventImages.length > 0 && (
                                        <div className="image-gallery">
                                            {event.eventImages.map((imageUrl, index) => (
                                                <img key={index} src={imageUrl} alt={`Event ${index + 1}`} className="img-thumbnail me-2" style={{ width: '10%', maxHeight: '100px' }} />
                                            ))}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDetail;
