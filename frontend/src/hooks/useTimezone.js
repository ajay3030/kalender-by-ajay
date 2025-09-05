// frontend/src/hooks/useTimezone.js
import { useState, useEffect } from 'react';

export const useTimezone = () => {
  const [clientTimezone, setClientTimezone] = useState('');

  useEffect(() => {
    setClientTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone);
  }, []);

  return { clientTimezone };
};