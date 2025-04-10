
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Search, Ticket, Film } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getMovies, type Movie } from '@/services/movieService';
import MovieCard from '@/components/MovieCard';

const Index = () => {
  const [featuredMovies, setFeaturedMovies] = useState<Movie[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedMovies = async () => {
      setIsLoading(true);
      try {
        const movies = await getMovies();
        setFeaturedMovies(movies.slice(0, 4));
      } catch (error) {
        console.error('Error fetching featured movies:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedMovies();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/movies?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="py-12 md:py-24 relative overflow-hidden">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            Réservez vos places de cinéma facilement
          </h1>
          <p className="text-xl text-muted-foreground">
            Découvrez les meilleurs films et réservez vos places en quelques clics sur MoovieBooker
          </p>
          
          <form onSubmit={handleSearch} className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Rechercher un film..."
              className="pl-10 pr-20"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button
              type="submit"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8"
              size="sm"
            >
              Rechercher
            </Button>
          </form>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button asChild size="lg">
              <Link to="/movies">
                <Film className="mr-2 h-5 w-5" />
                Voir tous les films
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/reservations">
                <Ticket className="mr-2 h-5 w-5" />
                Mes réservations
              </Link>
            </Button>
          </div>
        </div>
        
        <div className="absolute top-0 left-0 w-full h-full -z-10 bg-gradient-to-b from-cinema-dark/20 to-transparent pointer-events-none" />
      </section>

      {/* Featured Movies Section */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">Films à l'affiche</h2>
          <Button variant="ghost" asChild>
            <Link to="/movies" className="flex items-center">
              Voir tout <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {featuredMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-card rounded-lg border border-border">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Pourquoi choisir MoovieBooker ?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-muted p-6 rounded-lg">
              <div className="w-12 h-12 bg-cinema-primary rounded-full flex items-center justify-center mb-4">
                <Search className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Recherche facile</h3>
              <p className="text-muted-foreground">
                Trouvez rapidement les films qui vous intéressent grâce à notre moteur de recherche avancé.
              </p>
            </div>
            
            <div className="bg-muted p-6 rounded-lg">
              <div className="w-12 h-12 bg-cinema-primary rounded-full flex items-center justify-center mb-4">
                <Ticket className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Réservation simple</h3>
              <p className="text-muted-foreground">
                Réservez vos places en quelques clics et gérez facilement vos réservations.
              </p>
            </div>
            
            <div className="bg-muted p-6 rounded-lg">
              <div className="w-12 h-12 bg-cinema-primary rounded-full flex items-center justify-center mb-4">
                <Film className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Large sélection</h3>
              <p className="text-muted-foreground">
                Accédez à un vaste catalogue de films et trouvez toujours quelque chose à regarder.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-cinema-primary text-primary-foreground rounded-lg p-8 text-center">
        <h2 className="text-3xl font-bold mb-4">Prêt à réserver votre prochaine séance ?</h2>
        <p className="text-lg mb-6 max-w-2xl mx-auto">
          Inscrivez-vous maintenant et commencez à profiter de l'expérience MoovieBooker pour vos réservations de cinéma.
        </p>
        <Button asChild variant="secondary" size="lg">
          <Link to="/register">Créer un compte</Link>
        </Button>
      </section>
    </div>
  );
};

export default Index;
