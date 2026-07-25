import { createContext, useContext, useState, useCallback } from 'react';

const BookingContext = createContext(null);

export const BookingProvider = ({ children }) => {
  const [selectedConcert, setSelectedConcert] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]); // [{category, quantity}]
  const [bookingSummary, setBookingSummary] = useState(null);

  const reset = useCallback(() => {
    setSelectedConcert(null);
    setSelectedSeats([]);
    setSelectedCategories([]);
    setBookingSummary(null);
  }, []);

  const toggleSeat = useCallback((seat) => {
    setSelectedSeats(prev => {
      const exists = prev.find(s => s.id === seat.id);
      if (exists) return prev.filter(s => s.id !== seat.id);
      return [...prev, seat];
    });
  }, []);

  const totalAmount = selectedCategories.reduce((sum, item) => {
    return sum + (parseFloat(item.category?.price || 0) * item.quantity);
  }, 0);

  return (
    <BookingContext.Provider value={{
      selectedConcert, setSelectedConcert,
      selectedSeats, setSelectedSeats, toggleSeat,
      selectedCategories, setSelectedCategories,
      bookingSummary, setBookingSummary,
      totalAmount,
      reset,
    }}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error('useBooking must be used within BookingProvider');
  return ctx;
};
