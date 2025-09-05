// frontend/src/context/PublicBookingContext.js
import { createContext, useContext, useState } from 'react';

const PublicBookingContext = createContext();

export const PublicBookingProvider = ({ children }) => {
  const [eventType, setEventType] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [clientData, setClientData] = useState({});

  return (
    <PublicBookingContext.Provider value={{ eventType, setEventType, selectedDate, setSelectedDate, selectedTime, setSelectedTime, clientData, setClientData }}>
      {children}
    </PublicBookingContext.Provider>
  );
};

export const usePublicBooking = () => useContext(PublicBookingContext);