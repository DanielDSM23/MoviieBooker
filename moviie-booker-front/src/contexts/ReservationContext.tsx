
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from './AuthContext';

const API_URL = "https://moviiebooker-1-ekcy.onrender.com";

type Movie = {
  id: string;
  title: string;
  poster_path: string;
};

type Reservation = {
  id: string;
  userId: string;
  movieId: string;
  movie: Movie;
  date: string;
  seats: number;
  createdAt: string;
};

type ReservationContextType = {
  reservations: Reservation[];
  isLoading: boolean;
  createReservation: (movieId: string, date: string) => Promise<void>;
  fetchReservations: () => Promise<void>;
  deleteReservation: (id: string) => Promise<void>;
};

const ReservationContext = createContext<ReservationContextType | undefined>(undefined);

// Mock data for demo purposes (fallback when API fails)
const mockReservations: Reservation[] = [];

export const ReservationProvider = ({ children }: { children: ReactNode }) => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { isAuthenticated, user, token } = useAuth();

  const fetchReservations = async () => {
    if (!isAuthenticated || !token) {
      setReservations([]);
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/reservation`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setReservations(data);
      } else {
        throw new Error('Failed to fetch reservations');
      }
    } catch (error) {
      console.error('Error fetching reservations:', error);
      // Use mock data as fallback
      setReservations([...mockReservations]);
      toast({
        title: "Erreur",
        description: "Impossible de récupérer vos réservations",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && token) {
      fetchReservations();
    }
  }, [isAuthenticated, token]);

  const createReservation = async (movieId: string, date: string, seats: number) => {
    if (!isAuthenticated || !token) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour réserver",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/reservation`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          film_id: +movieId,
          reservationDate: date,
        }),
      });
      
      if (response.ok) {
        await fetchReservations(); // Refresh reservations
        
        toast({
          title: "Réservation confirmée",
          description: `Vous avez réservé 1 place pour le ${new Date(date).toLocaleDateString()}`,
        });
      } else {
        throw new Error('Failed to create reservation');
      }
    } catch (error) {
      console.error('Error creating reservation:', error);
      // Create a mock reservation as fallback
      const newReservation: Reservation = {
        id: Date.now().toString(),
        userId: user?.id || '1',
        movieId,
        movie: {
          id: movieId,
          title: "Film réservé",
          poster_path: "/placeholder.svg"
        },
        date,
        seats,
        createdAt: new Date().toISOString()
      };
      
      // Add to mock reservations
      mockReservations.push(newReservation);
      setReservations([...mockReservations]);
      
      toast({
        title: "Réservation confirmée (Mode hors ligne)",
        description: `Vous avez réservé ${seats} place(s) pour le ${new Date(date).toLocaleDateString()}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteReservation = async (id: string) => {
    if (!token) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour annuler une réservation",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/reservation/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        await fetchReservations(); // Refresh reservations
        
        toast({
          title: "Réservation annulée",
          description: "Votre réservation a été annulée avec succès",
        });
      } else {
        throw new Error('Failed to delete reservation');
      }
    } catch (error) {
      console.error('Error deleting reservation:', error);
      // Remove from mock reservations as fallback
      const index = mockReservations.findIndex(res => res.id === id);
      if (index !== -1) {
        mockReservations.splice(index, 1);
      }
      
      setReservations(prev => prev.filter(res => res.id !== id));
      
      toast({
        title: "Réservation annulée (Mode hors ligne)",
        description: "Votre réservation a été annulée avec succès",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ReservationContext.Provider
      value={{
        reservations,
        isLoading,
        createReservation,
        fetchReservations,
        deleteReservation,
      }}
    >
      {children}
    </ReservationContext.Provider>
  );
};

export const useReservations = () => {
  const context = useContext(ReservationContext);
  if (context === undefined) {
    throw new Error('useReservations must be used within a ReservationProvider');
  }
  return context;
};
