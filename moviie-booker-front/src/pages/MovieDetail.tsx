
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Clock, Star, ArrowLeft, Ticket } from 'lucide-react';
import { getMovieById, type Movie } from '@/services/movieService';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useReservations } from '@/contexts/ReservationContext';
import { useAuth } from '@/contexts/AuthContext';

const MovieDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showReservationDialog, setShowReservationDialog] = useState(false);
  const [reservationDate, setReservationDate] = useState('');
  const [reservationTime, setReservationTime] = useState('18:00');
  const [seats, setSeats] = useState('1');
  const { createReservation } = useReservations();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchMovie = async () => {
      setIsLoading(true);
      try {
        if (id) {
          const movieData = await getMovieById(id);
          setMovie(movieData);
        }
      } catch (error) {
        console.error('Error fetching movie details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleReservation = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setShowReservationDialog(true);
  };

  const handleConfirmReservation = async () => {
    if (!movie || !reservationDate || !reservationTime || !seats) return;
    
    try {
      const datetime = `${reservationDate}T${reservationTime}:00`;
      // Fix: Convert movie.id to string if it's a number
      await createReservation(movie.id.toString(), datetime, parseInt(seats));
      setShowReservationDialog(false);
    } catch (error) {
      console.error('Error creating reservation:', error);
    }
  };

  // Generate dates for the next two weeks
  const availableDates = Array.from({ length: 14 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return date;
  });

  // Generate possible screening times
  const screeningTimes = ['14:00', '16:30', '18:00', '20:30', '22:45'];

  if (isLoading) {
    return (
      <div className="space-y-8">
        <Button variant="ghost" onClick={handleBack} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour
        </Button>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Skeleton className="aspect-[2/3] w-full rounded-lg" />
          <div className="md:col-span-2 space-y-4">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold">Film non trouvé</h2>
        <p className="text-muted-foreground mt-2">
          Le film que vous recherchez n'existe pas ou a été supprimé.
        </p>
        <Button onClick={() => navigate('/movies')} className="mt-4">
          Voir tous les films
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Button variant="ghost" onClick={handleBack} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Retour
      </Button>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="rounded-lg overflow-hidden border border-border">
          <img
            src={movie.poster_path}
            alt={movie.title}
            className="w-full h-auto"
          />
        </div>
        
        <div className="md:col-span-2 space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{movie.title}</h1>
            <div className="flex items-center mt-2 text-muted-foreground">
              <Calendar className="h-4 w-4 mr-1" />
              <span className="mr-4">{new Date(movie.release_date).getFullYear()}</span>
              <Clock className="h-4 w-4 mr-1" />
              <span className="mr-4">120 min</span>
              <Star className="h-4 w-4 mr-1 text-yellow-400 fill-yellow-400" />
              <span>{movie.vote_average.toFixed(1)}/10</span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {movie.genres?.map((genre) => (
              <span
                key={genre.id}
                className="px-3 py-1 text-sm rounded-full bg-muted text-muted-foreground"
              >
                {genre.name}
              </span>
            ))}
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-2">Synopsis</h2>
            <p className="text-muted-foreground">{movie.overview}</p>
          </div>
          
          <Button onClick={handleReservation} className="mt-6">
            <Ticket className="mr-2 h-4 w-4" />
            Réserver
          </Button>
        </div>
      </div>
      
      <Dialog open={showReservationDialog} onOpenChange={setShowReservationDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Réserver pour {movie.title}</DialogTitle>
            <DialogDescription>
              Sélectionnez la date, l'heure et le nombre de places pour votre réservation.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="date">Date</Label>
              <Select value={reservationDate} onValueChange={setReservationDate}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez une date" />
                </SelectTrigger>
                <SelectContent>
                  {availableDates.map((date) => (
                    <SelectItem 
                      key={date.toISOString().split('T')[0]} 
                      value={date.toISOString().split('T')[0]}
                    >
                      {date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="time">Horaire</Label>
              <Select value={reservationTime} onValueChange={setReservationTime}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez un horaire" />
                </SelectTrigger>
                <SelectContent>
                  {screeningTimes.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="seats">Nombre de places</Label>
              <Select value={seats} onValueChange={setSeats}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez le nombre de places" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} {num === 1 ? 'place' : 'places'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowReservationDialog(false)}
            >
              Annuler
            </Button>
            <Button 
              onClick={handleConfirmReservation}
              disabled={!reservationDate || !reservationTime || !seats}
            >
              Confirmer la réservation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MovieDetail;
