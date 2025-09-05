// frontend/src/context/EventTypeContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';
import { eventTypeAPI } from '../utils/eventTypeAPI';

const EventTypeContext = createContext();

export const EventTypeProvider = ({ children }) => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all | active | inactive

  const fetchList = async () => {
    try {
      setLoading(true);
      const { list: data } = await eventTypeAPI.getEventTypes();
      setList(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchList(); }, []);

  /* CRUD helpers */
  const add = item => setList(prev => [item, ...prev]);
  const update = item =>
    setList(prev => prev.map(i => (i._id === item._id ? item : i)));
  const remove = id => setList(prev => prev.filter(i => i._id !== id));

  const filtered = list.filter(item =>
    filter === 'all' ? true : filter === 'active' ? item.isActive : !item.isActive
  );

  const value = {
    list: filtered,
    loading,
    error,
    filter,
    setFilter,
    add,
    update,
    remove,
    refetch: fetchList,
  };

  return <EventTypeContext.Provider value={value}>{children}</EventTypeContext.Provider>;
};

export const useEventTypes = () => useContext(EventTypeContext);