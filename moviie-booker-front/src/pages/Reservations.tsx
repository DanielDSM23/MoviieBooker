import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Calendar, Users } from 'lucide-react';
import { useReservations } from '@/contexts/ReservationContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const Reservations = () => {
  const { reservations, isLoading, fetchReservations, deleteReservation } = useReservations();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Appel de la fonction seulement si l'utilisateur est connecté
    fetchReservations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Date invalide';

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Date invalide';

    const formattedDate = date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    const formattedTime = date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    });

    return `${formattedDate} à ${formattedTime}`;
  };

  const handleDeleteReservation = async (id: string) => {
    try {
      await deleteReservation(id);
    } catch (error) {
      console.error('Erreur lors de la suppression :', error);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Mes Réservations</h1>
          <p className="text-muted-foreground mt-2">
            Consultez et gérez vos réservations de films
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, index) => (
            <Card key={index} className="overflow-hidden">
              <CardHeader className="p-0">
                <Skeleton className="h-48 w-full" />
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
              <CardFooter className="flex justify-between p-6 pt-0">
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-10" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Mes Réservations</h1>
        <p className="text-muted-foreground mt-2">
          Consultez et gérez vos réservations de films
        </p>
      </div>

      {reservations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reservations.map((reservation) => (
            <Card key={reservation.id} className="overflow-hidden border border-border">
              <CardHeader>
                <CardTitle>
                  {reservation.movieTitle || 'Titre indisponible'}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  ID du film : <span className="font-mono">{reservation.film_id}</span>
                </p>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex items-center text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>{formatDate(reservation.reservationDate)}</span>
                </div>
              </CardContent>

              <CardFooter className="flex justify-between pt-0">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="icon">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Annuler cette réservation ?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Cette action est irréversible.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Retour</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDeleteReservation(reservation.id)}
                        className="bg-red-500 hover:bg-red-600"
                      >
                        Oui, annuler
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border border-border rounded-lg bg-card">
          <h3 className="text-xl font-medium">Aucune réservation</h3>
          <p className="text-muted-foreground mt-2">
            Vous n'avez pas encore de réservations
          </p>
          <Button asChild className="mt-6">
            <Link to="/movies">Parcourir les films</Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default Reservations;
