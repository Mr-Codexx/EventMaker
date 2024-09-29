import React, { useState, useEffect } from 'react';
import moment from 'moment';

const BirthdayCountdown = () => {
  const [targetDate, setTargetDate] = useState('');
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [timer, setTimer] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    if (targetDate) {
      const interval = setInterval(() => {
        const now = moment();
        const then = moment(targetDate);

        const countdown = then.diff(now);

        if (countdown <= 0) {
          setIsTimeUp(true);
          clearInterval(interval);
        } else {
          const duration = moment.duration(countdown);

          setTimer({
            days: duration.days(),
            hours: duration.hours(),
            minutes: duration.minutes(),
            seconds: duration.seconds(),
          });
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [targetDate]);

  const handleDateSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const date = formData.get('date') + ' ' + formData.get('time');
    setTargetDate(date);
  };

  return (
    <div className="vh-100 d-flex justify-content-center align-items-center text-center bg-light">
      {!targetDate ? (
        <form onSubmit={handleDateSubmit} className="p-4 bg-white shadow rounded">
          <h3 className="mb-4">Set Your Birthday Date & Time</h3>
          <div className="mb-3">
            <label htmlFor="date" className="form-label">Select Date:</label>
            <input type="date" id="date" name="date" className="form-control" required />
          </div>
          <div className="mb-3">
            <label htmlFor="time" className="form-label">Select Time:</label>
            <input type="time" id="time" name="time" className="form-control" required />
          </div>
          <button type="submit" className="btn btn-primary">Start Timer</button>
        </form>
      ) : (
        <>
          {!isTimeUp ? (
            <div className="bg-white shadow p-5 rounded">
              <h2>Time left until your birthday!</h2>
              <div className="d-flex justify-content-around my-4">
                <div>
                  <h3>{timer.days}</h3>
                  <span>Days</span>
                </div>
                <div>
                  <h3>{timer.hours}</h3>
                  <span>Hours</span>
                </div>
                <div>
                  <h3>{timer.minutes}</h3>
                  <span>Minutes</span>
                </div>
                <div>
                  <h3>{timer.seconds}</h3>
                  <span>Seconds</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-success text-white p-5 rounded">
              <h1>🎉 Happy Birthday! 🎉</h1>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BirthdayCountdown;
