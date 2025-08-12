import React, { useState, useEffect } from 'react';
import './App.css';
import {
  NetflixHeader,
  HeroBanner,
  ContentRow,
  MovieDetailModal,
  VideoPlayerModal,
  NetflixFooter
} from './components';

const TMDB_API_KEYS = [
  'c8dea14dc917687ac631a52620e4f7ad',
  '3cb41ecea3bf606c56552db3d17adefd'
];
let currentAPIKeyIndex = 0;

const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
const BACKDROP_BASE_URL = 'https://image.tmdb.org/t/p/original';

function App() {
  const [featuredContent, setFeaturedContent] = useState([]);
  const [contentRows, setContentRows] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showMovieModal, setShowMovieModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Mock user profiles
  const profiles = [
    {
      id: 1,
      name: 'User 1',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face'
    },
    {
      id: 2,
      name: 'User 2', 
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b55fd5bb?w=100&h=100&fit=crop&crop=face'
    }
  ];

  const [currentProfile, setCurrentProfile] = useState(profiles[0]);

  // Get current API key with rotation
  const getCurrentAPIKey = () => {
    return TMDB_API_KEYS[currentAPIKeyIndex];
  };

  // Rotate to next API key if rate limited
  const rotateAPIKey = () => {
    currentAPIKeyIndex = (currentAPIKeyIndex + 1) % TMDB_API_KEYS.length;
  };

  // Fetch data from TMDB
  const fetchFromTMDB = async (endpoint, retries = 1) => {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}?api_key=${getCurrentAPIKey()}`);
      
      if (response.status === 429) { // Rate limited
        if (retries > 0) {
          rotateAPIKey();
          return fetchFromTMDB(endpoint, retries - 1);
        } else {
          throw new Error('Rate limited on all API keys');
        }
      }
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('TMDB API Error:', error);
      return null;
    }
  };

  // Fetch YouTube trailer
  const fetchTrailer = async (movieId, mediaType = 'movie') => {
    try {
      const data = await fetchFromTMDB(`/${mediaType}/${movieId}/videos`);
      if (data && data.results) {
        const trailer = data.results.find(video => 
          video.type === 'Trailer' && video.site === 'YouTube'
        );
        return trailer ? trailer.key : null;
      }
      return null;
    } catch (error) {
      console.error('Error fetching trailer:', error);
      return null;
    }
  };

  // Transform TMDB data to our format
  const transformTMDBData = (item, mediaType = 'movie') => {
    return {
      id: item.id,
      title: item.title || item.name,
      overview: item.overview,
      backdropImage: item.backdrop_path ? 
        `${BACKDROP_BASE_URL}${item.backdrop_path}` : 
        'https://images.unsplash.com/photo-1543257455-a880cca3bb40?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzV8MHwxfHNlYXJjaHwxfHxjaW5lbWElMjBlbnRlcnRhaW5tZW50fGVufDB8fHxibGFja3wxNzU0OTY1ODk1fDA&ixlib=rb-4.1.0&q=85',
      posterImage: item.poster_path ? 
        `${IMAGE_BASE_URL}${item.poster_path}` : 
        'https://images.unsplash.com/photo-1590179068383-b9c69aacebd3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzh8MHwxfHNlYXJjaHwxfHxtb3ZpZSUyMHBvc3RlcnN8ZW58MHx8fGJsYWNrfDE3NTQ5NjEyMzZ8MA&ixlib=rb-4.1.0&q=85',
      year: (item.release_date || item.first_air_date)?.substring(0, 4) || '2024',
      rating: item.adult ? 'R' : 'PG-13',
      match: Math.floor(Math.random() * 20) + 80, // Mock match percentage
      duration: mediaType === 'movie' ? '2h 5m' : '3 Seasons',
      cast: 'Ryan Reynolds, Blake Lively, Emma Stone', // Mock cast
      genres: 'Action, Comedy, Drama',
      director: 'Christopher Nolan',
      mediaType
    };
  };

  // Mock data fallback if API fails
  const getMockData = () => {
    const mockItems = [
      {
        id: 1,
        title: 'The Dark Knight',
        overview: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests.',
        backdropImage: 'https://images.unsplash.com/photo-1543257455-a880cca3bb40?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzV8MHwxfHNlYXJjaHwxfHxjaW5lbWElMjBlbnRlcnRhaW5tZW50fGVufDB8fHxibGFja3wxNzU0OTY1ODk1fDA&ixlib=rb-4.1.0&q=85',
        year: '2008',
        rating: 'PG-13',
        match: 98,
        duration: '2h 32m',
        cast: 'Christian Bale, Heath Ledger, Aaron Eckhart',
        genres: 'Action, Crime, Drama',
        director: 'Christopher Nolan',
        trailerKey: 'EXeTwQWrcwY'
      },
      {
        id: 2,
        title: 'Inception',
        overview: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
        backdropImage: 'https://images.unsplash.com/photo-1485095329183-d0797cdc5676?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzV8MHwxfHNlYXJjaHwyfHxjaW5lbWElMjBlbnRlcnRhaW5tZW50fGVufDB8fHxibGFja3wxNzU0OTY1ODk1fDA&ixlib=rb-4.1.0&q=85',
        year: '2010',
        rating: 'PG-13',
        match: 95,
        duration: '2h 28m',
        cast: 'Leonardo DiCaprio, Marion Cotillard, Tom Hardy',
        genres: 'Action, Sci-Fi, Thriller',
        director: 'Christopher Nolan',
        trailerKey: 'YoHD9XEInc0'
      },
      {
        id: 3,
        title: 'Interstellar',
        overview: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
        backdropImage: 'https://images.unsplash.com/photo-1608170825938-a8ea0305d46c?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzV8MHwxfHNlYXJjaHwzfHxjaW5lbWElMjBlbnRlcnRhaW5tZW50fGVufDB8fHxibGFja3wxNzU0OTY1ODk1fDA&ixlib=rb-4.1.0&q=85',
        year: '2014',
        rating: 'PG-13',
        match: 92,
        duration: '2h 49m',
        cast: 'Matthew McConaughey, Anne Hathaway, Jessica Chastain',
        genres: 'Adventure, Drama, Sci-Fi',
        director: 'Christopher Nolan',
        trailerKey: 'zSWdZVtXT7E'
      }
    ];

    return mockItems;
  };

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load popular movies for hero banner
        const popularData = await fetchFromTMDB('/movie/popular');
        if (popularData && popularData.results) {
          const heroContent = popularData.results.slice(0, 5).map(item => 
            transformTMDBData(item, 'movie')
          );
          
          // Fetch trailers for hero content
          for (let content of heroContent) {
            content.trailerKey = await fetchTrailer(content.id, 'movie');
          }
          
          setFeaturedContent(heroContent);
        } else {
          // Use mock data if API fails
          setFeaturedContent(getMockData());
        }

        // Load different categories
        const categories = [
          { title: 'Trending Now', endpoint: '/trending/all/week' },
          { title: 'Netflix Originals', endpoint: '/discover/tv?with_networks=213' },
          { title: 'Popular Movies', endpoint: '/movie/popular' },
          { title: 'Top Rated Movies', endpoint: '/movie/top_rated' },
          { title: 'Action Movies', endpoint: '/discover/movie?with_genres=28' },
          { title: 'Comedy Movies', endpoint: '/discover/movie?with_genres=35' },
          { title: 'Horror Movies', endpoint: '/discover/movie?with_genres=27' },
          { title: 'TV Shows', endpoint: '/tv/popular' }
        ];

        const rows = [];
        for (let category of categories) {
          const data = await fetchFromTMDB(category.endpoint);
          if (data && data.results) {
            const items = data.results.slice(0, 20).map(item => {
              const mediaType = category.endpoint.includes('/tv/') || category.endpoint.includes('tv?') ? 'tv' : 'movie';
              return transformTMDBData(item, mediaType);
            });
            
            // Fetch some trailers
            for (let i = 0; i < Math.min(items.length, 5); i++) {
              items[i].trailerKey = await fetchTrailer(items[i].id, items[i].mediaType);
            }
            
            rows.push({
              title: category.title,
              items: items
            });
          } else {
            // Use mock data for this category
            rows.push({
              title: category.title,
              items: getMockData()
            });
          }
        }
        
        setContentRows(rows);
      } catch (error) {
        console.error('Error loading data:', error);
        // Fallback to mock data
        setFeaturedContent(getMockData());
        setContentRows([
          { title: 'Popular Movies', items: getMockData() },
          { title: 'Trending Now', items: getMockData() },
          { title: 'Action Movies', items: getMockData() }
        ]);
      }
    };

    loadData();
  }, []);

  // Handle search
  const handleSearch = async (query) => {
    if (!query.trim()) {
      setIsSearching(false);
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const data = await fetchFromTMDB(`/search/multi?query=${encodeURIComponent(query)}`);
      if (data && data.results) {
        const results = data.results
          .filter(item => item.media_type !== 'person')
          .slice(0, 20)
          .map(item => transformTMDBData(item, item.media_type));
        setSearchResults(results);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    }
  };

  // Handle movie selection
  const handleMovieClick = (movie) => {
    setSelectedMovie(movie);
    setShowMovieModal(true);
  };

  // Handle trailer play
  const handlePlayTrailer = async (movie) => {
    let trailerKey = movie.trailerKey;
    
    if (!trailerKey) {
      trailerKey = await fetchTrailer(movie.id, movie.mediaType || 'movie');
    }
    
    if (trailerKey) {
      setCurrentVideo({ key: trailerKey, title: movie.title });
      setShowVideoModal(true);
      setShowMovieModal(false);
    } else {
      // Fallback to a generic movie trailer
      setCurrentVideo({ 
        key: 'EXeTwQWrcwY', // Dark Knight trailer as fallback
        title: movie.title 
      });
      setShowVideoModal(true);
      setShowMovieModal(false);
    }
  };

  return (
    <div className="bg-black min-h-screen">
      <NetflixHeader
        onSearch={handleSearch}
        profiles={profiles}
        currentProfile={currentProfile}
        onProfileSelect={setCurrentProfile}
      />

      {!isSearching ? (
        <>
          {featuredContent.length > 0 && (
            <HeroBanner
              featuredContent={featuredContent}
              onPlayTrailer={handlePlayTrailer}
            />
          )}

          <div className="pt-8">
            {contentRows.map((row, index) => (
              <ContentRow
                key={index}
                title={row.title}
                items={row.items}
                onItemClick={handleMovieClick}
              />
            ))}
          </div>
        </>
      ) : (
        <div className="pt-20 px-4 md:px-16">
          <h2 className="text-white text-2xl font-semibold mb-6">Search Results</h2>
          {searchResults.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {searchResults.map((item) => (
                <div
                  key={item.id}
                  className="cursor-pointer transform hover:scale-105 transition-transform"
                  onClick={() => handleMovieClick(item)}
                >
                  <img
                    src={item.posterImage}
                    alt={item.title}
                    className="w-full h-64 object-cover rounded"
                  />
                  <h3 className="text-white text-sm mt-2 truncate">{item.title}</h3>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No results found.</p>
          )}
        </div>
      )}

      <NetflixFooter />

      <MovieDetailModal
        movie={selectedMovie}
        isOpen={showMovieModal}
        onClose={() => setShowMovieModal(false)}
        onPlayTrailer={handlePlayTrailer}
      />

      <VideoPlayerModal
        videoId={currentVideo?.key}
        title={currentVideo?.title}
        isOpen={showVideoModal}
        onClose={() => setShowVideoModal(false)}
      />
    </div>
  );
}

export default App;