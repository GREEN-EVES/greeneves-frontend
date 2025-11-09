'use client';

import React, { useEffect, useState } from 'react';

interface CountdownProps {
  targetDate: string;
  className?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const Countdown: React.FC<CountdownProps> = ({ targetDate, className = '' }) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const target = new Date(targetDate).getTime();
      const distance = target - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    // Calculate immediately
    calculateTimeLeft();

    // Update every second
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <div className={`flex gap-4 sm:gap-8 justify-center ${className}`}>
      <div className="text-center">
        <div className="text-3xl sm:text-5xl font-bold">{timeLeft.days}</div>
        <div className="text-xs sm:text-sm opacity-80 mt-1">Days</div>
      </div>
      <div className="text-center">
        <div className="text-3xl sm:text-5xl font-bold">{timeLeft.hours}</div>
        <div className="text-xs sm:text-sm opacity-80 mt-1">Hours</div>
      </div>
      <div className="text-center">
        <div className="text-3xl sm:text-5xl font-bold">{timeLeft.minutes}</div>
        <div className="text-xs sm:text-sm opacity-80 mt-1">Minutes</div>
      </div>
      <div className="text-center">
        <div className="text-3xl sm:text-5xl font-bold">{timeLeft.seconds}</div>
        <div className="text-xs sm:text-sm opacity-80 mt-1">Seconds</div>
      </div>
    </div>
  );
};
