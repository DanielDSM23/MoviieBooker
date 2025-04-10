
// Types for the movie service
export type Movie = {
  id: string;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path?: string;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
  genres?: Genre[];
};

export type Genre = {
  id: number;
  name: string;
};

export type MovieResponse = {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
};

const API_URL = "https://moviiebooker-1-ekcy.onrender.com";

// Helper to get token from localStorage
const getAuthToken = () => localStorage.getItem('auth_token');

// Movie service functions
export const getMovies = async (title?: string, genreId?: number, page: number = 1): Promise<MovieResponse> => {
  try {
    let url = `${API_URL}/movie/movies`;
    const params = new URLSearchParams();
    
    if (title) {
      params.append('search', title);
    }
    
    if (genreId) {
      params.append('genre', genreId.toString());
    }
    
    params.append('page', page.toString());
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }
    
    const token = getAuthToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(url, {
      headers
    });
    
    if (!response.ok) {
      throw new Error(`Error fetching movies: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
    
  } catch (error) {
    console.error("Failed to fetch movies:", error);
    // Fallback to mockMovies in case of error during development
    return {
      page: 1,
      results: addGenresToMovies(mockMovies, mockGenres),
      total_pages: 1,
      total_results: mockMovies.length
    };
  }
};

export const getFeaturedMovies = async (): Promise<Movie[]> => {
  try {
    const data = await getMovies(undefined, undefined, 1);
    return data.results.slice(0, 5);
  } catch (error) {
    console.error("Error fetching featured movies:", error);
    return mockMovies.slice(0, 5);
  }
};

export const getMovieById = async (id: string): Promise<Movie | null> => {
  try {
    const token = getAuthToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${API_URL}/movie/movies/${id}`, {
      headers
    });
    
    if (!response.ok) {
      throw new Error(`Error fetching movie: ${response.status}`);
    }
    
    const movie = await response.json();
    
    // Fetch genres to add to movie
    const genres = await getGenres();
    if (!movie) return null;
    
    return {
      ...movie,
      genres: movie.genre_ids.map(id => genres.find(genre => genre.id === id)).filter(Boolean) as Genre[]
    };
    
  } catch (error) {
    console.error(`Failed to fetch movie with id ${id}:`, error);
    // Fallback to mockMovies in case of error during development
    const movie = mockMovies.find(m => m.id === id);
    if (!movie) return null;
    
    return {
      ...movie,
      genres: movie.genre_ids.map(id => mockGenres.find(genre => genre.id === id)).filter(Boolean) as Genre[]
    };
  }
};

export const getGenres = async (): Promise<Genre[]> => {
  try {
    const token = getAuthToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${API_URL}/movie/genres`, {
      headers
    });
    
    if (!response.ok) {
      throw new Error(`Error fetching genres: ${response.status}`);
    }
    
    return await response.json();
    
  } catch (error) {
    console.error("Failed to fetch genres:", error);
    // Fallback to mockGenres in case of error during development
    return [...mockGenres];
  }
};

// Mock data for development fallback
const mockGenres: Genre[] = [
  { id: 28, name: "Action" },
  { id: 12, name: "Aventure" },
  { id: 16, name: "Animation" },
  { id: 35, name: "Comédie" },
  { id: 80, name: "Crime" },
  { id: 18, name: "Drame" },
  { id: 10751, name: "Familial" },
  { id: 14, name: "Fantastique" },
  { id: 36, name: "Histoire" },
  { id: 27, name: "Horreur" },
  { id: 10402, name: "Musique" },
  { id: 9648, name: "Mystère" },
  { id: 10749, name: "Romance" },
  { id: 878, name: "Science-Fiction" },
  { id: 53, name: "Thriller" },
];

const mockMovies: Movie[] = [
  {
    id: "1",
    title: "Inception",
    overview: "Dom Cobb est un voleur expérimenté, le meilleur dans l'art dangereux de l'extraction...",
    poster_path: "https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/original/s3TBrRGB1iav7gFOCNx3H31MoES.jpg",
    release_date: "2010-07-16",
    vote_average: 8.4,
    genre_ids: [28, 878, 9648],
  },
  {
    id: "2",
    title: "The Dark Knight",
    overview: "Batman est plus que jamais déterminé à éradiquer le crime organisé qui sème la terreur en ville...",
    poster_path: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/original/nMKdUUepR0i5zn0y1T4CsSB5chy.jpg",
    release_date: "2008-07-18",
    vote_average: 8.5,
    genre_ids: [28, 80, 18],
  },
  {
    id: "3",
    title: "Pulp Fiction",
    overview: "L'odyssée sanglante et burlesque de petits malfrats dans la jungle d'Hollywood...",
    poster_path: "https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/original/suaEOtk1N1sgg2MTM7oZd2cfVp3.jpg",
    release_date: "1994-10-14",
    vote_average: 8.5,
    genre_ids: [80, 53],
  },
  {
    id: "4",
    title: "Le Voyage de Chihiro",
    overview: "Chihiro, une fillette de 10 ans, est en route vers sa nouvelle demeure en compagnie de ses parents...",
    poster_path: "https://image.tmdb.org/t/p/w500/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/original/Ab8mkHmkYADjU7wQiOkia9BzGvS.jpg",
    release_date: "2001-07-20",
    vote_average: 8.5,
    genre_ids: [16, 10751, 14],
  },
  {
    id: "5",
    title: "Forrest Gump",
    overview: "Quelques décennies d'histoire américaine, des années 1950 à la fin du XXème siècle, à travers le regard et l'étrange odyssée d'un homme simple et pur...",
    poster_path: "https://image.tmdb.org/t/p/w500/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/original/3h1JZGDhZ8nzxdgvkxha0qBqi05.jpg",
    release_date: "1994-06-23",
    vote_average: 8.5,
    genre_ids: [35, 18, 10749],
  },
  {
    id: "6",
    title: "Parasite",
    overview: "Toute la famille de Ki-taek est au chômage. Elle s'intéresse particulièrement au train de vie de la richissime famille Park...",
    poster_path: "https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/original/TU9NIjwzjoKPwQHoHshkFcQUCG.jpg",
    release_date: "2019-05-30",
    vote_average: 8.5,
    genre_ids: [35, 53, 18],
  },
];

// Helper function to add genre details to movies
const addGenresToMovies = (movies: Movie[], genres: Genre[]): Movie[] => {
  return movies.map(movie => ({
    ...movie,
    genres: movie.genre_ids.map(id => genres.find(genre => genre.id === id)).filter(Boolean) as Genre[]
  }));
};
