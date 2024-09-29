import React, { useEffect } from 'react';

const CountdownClock = ({ targetDate }) => {
  useEffect(() => {
    const loadScripts = async () => {
      // Load jQuery
      const scriptJquery = document.createElement('script');
      scriptJquery.src = 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js';
      scriptJquery.async = true;
      document.body.appendChild(scriptJquery);

      // Load moment.js
      const scriptMoment = document.createElement('script');
      scriptMoment.src = 'https://momentjs.com/downloads/moment.js';
      scriptMoment.async = true;
      document.body.appendChild(scriptMoment);

      // Load FlipClock.js
      const scriptFlipclock = document.createElement('script');
      scriptFlipclock.src = 'https://cdnjs.cloudflare.com/ajax/libs/flipclock/0.7.8/flipclock.js';
      scriptFlipclock.async = true;
      document.body.appendChild(scriptFlipclock);

      // Once all scripts are loaded, initialize the clock
      scriptFlipclock.onload = () => {
        const clock = window.$(".clock");
        const currentDate = new Date();
        const targetMoment = window.moment(targetDate); // Use the targetDate from props
        const diff = targetMoment / 1000 - currentDate.getTime() / 1000;

        if (diff <= 0) {
          clock.FlipClock(0, {
            clockFace: "DailyCounter",
            countdown: true,
            autostart: false,
          });
          console.log("Date has already passed!");
        } else {
          clock.FlipClock(diff, {
            clockFace: "DailyCounter",
            countdown: true,
            callbacks: {
              stop: function () {
                console.log("Timer has ended!");
              },
            },
          });
        }
      };
    };

    loadScripts();
  }, [targetDate]);

  return (
    <div className="container">
      <div className="clock" style={clockStyle}></div>
      
    </div>
  );
};

const clockStyle = {
  width: '650px',
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translateX(-50%) translateY(-50%)',
};

export default CountdownClock;
