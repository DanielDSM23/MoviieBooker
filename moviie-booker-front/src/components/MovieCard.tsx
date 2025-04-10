import React, { useState } from 'react';
import { StarIcon, Ticket } from 'lucide-react';
import { cn } from '@/lib/utils';
import { type Movie } from '@/services/movieService';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useReservations } from '@/contexts/ReservationContext';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

type MovieCardProps = {
  movie: Movie;
  className?: string;
};

const MovieCard = ({ movie, className }: MovieCardProps) => {
  const [showReservationDialog, setShowReservationDialog] = useState(false);
  const [reservationDate, setReservationDate] = useState('');
  const [reservationTime, setReservationTime] = useState('18:00');
  const { createReservation } = useReservations();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleCardClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowReservationDialog(true);
  };

  const handleReservation = () => {
    if (!isAuthenticated) {
      toast({
        title: "Connexion requise",
        description: "Vous devez être connecté pour réserver",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }

    if (!reservationDate || !reservationTime) {
      toast({
        title: "Formulaire incomplet",
        description: "Veuillez remplir tous les champs du formulaire",
        variant: "destructive",
      });
      return;
    }

    try {
      const datetime = `${reservationDate}T${reservationTime}:00`;
      createReservation(movie.id.toString(), datetime, 1); // valeur par défaut pour la compatibilité
      setShowReservationDialog(false);
      toast({
        title: "Réservation confirmée",
        description: `Vous avez réservé pour ${movie.title} le ${new Date(reservationDate).toLocaleDateString()} à ${reservationTime}`,
      });
    } catch (error) {
      console.error('Error creating reservation:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la réservation",
        variant: "destructive",
      });
    }
  };

  const availableDates = Array.from({ length: 14 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return date;
  });

  const generateScreeningTimes = () => {
    const times = [];
    for (let hour = 10; hour <= 23; hour++) {
      times.push(`${hour.toString().padStart(2, '0')}:00`);
      times.push(`${hour.toString().padStart(2, '0')}:30`);
    }
    return times;
  };

  const screeningTimes = generateScreeningTimes();

  return (
    <>
      <div 
        onClick={handleCardClick}
        className={cn("block cursor-pointer", className)}
      >
        <div className="movie-card group relative overflow-hidden rounded-lg h-full bg-card border border-border hover:border-primary transition-colors duration-300">
          <div className="aspect-[2/3] relative overflow-hidden">
            <img
              src={"https://image.tmdb.org/t/p/w500"+movie.poster_path}
              alt={movie.title}
              className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 poster-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          <div className="p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold line-clamp-1">{movie.title}</h3>
              <div className="flex items-center text-amber-400">
                <StarIcon className="h-4 w-4 mr-1 fill-current" />
                <span className="text-sm">{movie.vote_average.toFixed(1)}</span>
              </div>
            </div>
            <div className="mt-1 text-xs text-muted-foreground">
              {new Date(movie.release_date).getFullYear()}
            </div>
            <div className="mt-2 flex flex-wrap gap-1">
              {movie.genres?.slice(0, 2).map((genre) => (
                <span
                  key={genre.id}
                  className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground"
                >
                  {genre.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Dialog open={showReservationDialog} onOpenChange={setShowReservationDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Réserver pour {movie.title}</DialogTitle>
            <DialogDescription>
              Sélectionnez la date et l'heure pour votre réservation.
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
                <SelectContent className="max-h-[200px]">
                  {screeningTimes.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
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
              onClick={handleReservation}
              disabled={!reservationDate || !reservationTime}
            >
              <Ticket className="mr-2 h-4 w-4" />
              Confirmer la réservation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MovieCard;
