import React, { useState, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
import { getMovies, getGenres, type Movie, type Genre } from '@/services/movieService';
import MovieCard from '@/components/MovieCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';

const MoviesList = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [searchTitle, setSearchTitle] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  // Pagination states
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const genreData = await getGenres();
        setGenres(genreData.genres);
      } catch (error) {
        console.error('Error fetching genres:', error);
      }
    };

    fetchGenres();
  }, []);

  useEffect(() => {
    const fetchMovies = async () => {
      setIsLoading(true);
      try {
        const genreId = selectedGenre && selectedGenre !== 'all' ? parseInt(selectedGenre) : undefined;
        const moviesData = await getMovies(searchTitle || undefined, genreId, page);
        setMovies(moviesData.results);
        setTotalPages(moviesData.total_pages);
      } catch (error) {
        console.error('Error fetching movies:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchMovies();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTitle, selectedGenre, page]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTitle(e.target.value);
    setPage(1); // reset page on new search
  };

  const handleGenreChange = (value: string) => {
    setSelectedGenre(value);
    setPage(1); // reset page on new genre
  };

  const handleClearFilters = () => {
    setSearchTitle('');
    setSelectedGenre('');
    setPage(1);
  };

  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Films à l'affiche</h1>
        <p className="text-muted-foreground mt-2">
          Découvrez notre sélection de films et réservez vos places
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder="Rechercher un film..."
            value={searchTitle}
            onChange={handleSearch}
            className="pl-10"
          />
        </div>

        <div className="w-full md:w-64">
          <Select value={selectedGenre} onValueChange={handleGenreChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Tous les genres" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les genres</SelectItem>
              {genres.map((genre) => (
                <SelectItem key={genre.id} value={genre.id.toString()}>
                  {genre.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {(searchTitle || selectedGenre) && (
          <Button variant="outline" onClick={handleClearFilters} className="md:w-auto">
            <Filter className="h-4 w-4 mr-2" />
            Effacer les filtres
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {Array.from({ length: 10 }).map((_, index) => (
            <div key={index} className="space-y-3">
              <Skeleton className="aspect-[2/3] w-full rounded-lg" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      ) : movies.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-center items-center gap-4 mt-8">
            <Button variant="outline" onClick={handlePrevPage} disabled={page === 1}>
              Page précédente
            </Button>
            <span className="text-muted-foreground">
              Page {page} sur {totalPages}
            </span>
            <Button variant="outline" onClick={handleNextPage} disabled={page === totalPages}>
              Page suivante
            </Button>
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium">Aucun film trouvé</h3>
          <p className="text-muted-foreground mt-2">
            Essayez de modifier vos critères de recherche
          </p>
        </div>
      )}
    </div>
  );
};

export default MoviesList;
