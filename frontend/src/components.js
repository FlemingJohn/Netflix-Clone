import React, { useState, useEffect, useRef } from 'react';

// Netflix Header Component
export const NetflixHeader = ({ onSearch, profiles, currentProfile, onProfileSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [showProfiles, setShowProfiles] = useState(false);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black bg-opacity-90 backdrop-blur-sm transition-all duration-300">
      <div className="flex items-center justify-between px-4 md:px-16 py-4">
        {/* Logo */}
        <div className="flex items-center space-x-8">
          <h1 className="text-red-600 text-2xl md:text-3xl font-bold">NETFLIX</h1>
          <nav className="hidden md:flex space-x-6">
            <a href="#" className="text-white hover:text-gray-300 transition-colors">Home</a>
            <a href="#" className="text-white hover:text-gray-300 transition-colors">TV Shows</a>
            <a href="#" className="text-white hover:text-gray-300 transition-colors">Movies</a>
            <a href="#" className="text-white hover:text-gray-300 transition-colors">New & Popular</a>
            <a href="#" className="text-white hover:text-gray-300 transition-colors">My List</a>
          </nav>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative">
            {showSearch ? (
              <div className="flex items-center bg-black bg-opacity-75 border border-white rounded">
                <svg className="w-5 h-5 text-white ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Titles, people, genres"
                  value={searchTerm}
                  onChange={handleSearch}
                  className="bg-transparent text-white px-3 py-2 outline-none w-64"
                  autoFocus
                />
                <button 
                  onClick={() => setShowSearch(false)}
                  className="text-white pr-3 hover:text-gray-300"
                >
                  ×
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowSearch(true)}
                className="text-white hover:text-gray-300 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            )}
          </div>

          {/* Profile */}
          <div className="relative">
            <button
              onClick={() => setShowProfiles(!showProfiles)}
              className="flex items-center space-x-2"
            >
              <img
                src={currentProfile.avatar}
                alt="Profile"
                className="w-8 h-8 rounded"
              />
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showProfiles && (
              <div className="absolute right-0 mt-2 w-48 bg-black bg-opacity-95 rounded shadow-lg py-2">
                {profiles.map((profile) => (
                  <button
                    key={profile.id}
                    onClick={() => {
                      onProfileSelect(profile);
                      setShowProfiles(false);
                    }}
                    className="flex items-center space-x-3 px-4 py-2 w-full text-left hover:bg-gray-800 transition-colors"
                  >
                    <img src={profile.avatar} alt={profile.name} className="w-8 h-8 rounded" />
                    <span className="text-white">{profile.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

// Hero Banner Component
export const HeroBanner = ({ featuredContent, onPlayTrailer }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        (prevIndex + 1) % featuredContent.length
      );
    }, 8000);

    return () => clearInterval(timer);
  }, [featuredContent.length]);

  const currentContent = featuredContent[currentIndex];

  return (
    <div className="relative h-screen overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={currentContent.backdropImage}
          alt={currentContent.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center h-full px-4 md:px-16">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            {currentContent.title}
          </h1>
          <p className="text-lg md:text-xl text-white mb-6 line-clamp-3">
            {currentContent.overview}
          </p>
          <div className="flex space-x-4">
            <button
              onClick={() => onPlayTrailer(currentContent)}
              className="flex items-center bg-white text-black px-6 py-3 rounded font-semibold hover:bg-gray-200 transition-colors"
            >
              <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
              Play
            </button>
            <button className="flex items-center bg-gray-600 bg-opacity-70 text-white px-6 py-3 rounded font-semibold hover:bg-opacity-60 transition-colors">
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              More Info
            </button>
          </div>
        </div>
      </div>

      {/* Indicators */}
      <div className="absolute bottom-8 right-8 flex space-x-2">
        {featuredContent.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentIndex ? 'bg-red-600' : 'bg-gray-400'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

// Content Row Component
export const ContentRow = ({ title, items, onItemClick }) => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    const scrollAmount = 320;
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="px-4 md:px-16 mb-8">
      <h2 className="text-white text-xl md:text-2xl font-semibold mb-4">{title}</h2>
      <div className="relative group">
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-20 bg-black bg-opacity-50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-opacity-75"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <div
          ref={scrollRef}
          className="flex space-x-2 overflow-x-auto scrollbar-hide scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {items.map((item) => (
            <ContentCard
              key={item.id}
              item={item}
              onClick={() => onItemClick(item)}
            />
          ))}
        </div>

        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 z-20 bg-black bg-opacity-50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-opacity-75"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

// Content Card Component
export const ContentCard = ({ item, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative flex-shrink-0 w-72 h-40 cursor-pointer transition-all duration-300 transform hover:scale-105 hover:z-10"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <img
        src={item.backdropImage}
        alt={item.title}
        className="w-full h-full object-cover rounded"
      />
      
      {isHovered && (
        <div className="absolute inset-0 bg-black bg-opacity-75 rounded flex items-center justify-center">
          <div className="text-center p-4">
            <h3 className="text-white text-lg font-semibold mb-2">{item.title}</h3>
            <p className="text-gray-300 text-sm mb-3 line-clamp-2">{item.overview}</p>
            <div className="flex justify-center space-x-2">
              <button className="bg-white text-black p-2 rounded-full hover:bg-gray-200 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </button>
              <button className="bg-gray-600 text-white p-2 rounded-full hover:bg-gray-500 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </button>
              <button className="bg-gray-600 text-white p-2 rounded-full hover:bg-gray-500 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Movie Detail Modal Component
export const MovieDetailModal = ({ movie, isOpen, onClose, onPlayTrailer }) => {
  if (!isOpen || !movie) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="relative">
          <img
            src={movie.backdropImage}
            alt={movie.title}
            className="w-full h-64 object-cover rounded-t-lg"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 rounded-t-lg"></div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <h2 className="text-white text-3xl font-bold mb-4">{movie.title}</h2>
              <div className="flex items-center space-x-4 mb-4">
                <span className="text-green-500 font-semibold">{movie.match}% Match</span>
                <span className="text-gray-400">{movie.year}</span>
                <span className="text-gray-400 border border-gray-400 px-2 py-1 text-sm">
                  {movie.rating}
                </span>
                <span className="text-gray-400">{movie.duration}</span>
              </div>
              <p className="text-gray-300 mb-6">{movie.overview}</p>
              
              <div className="flex space-x-3 mb-6">
                <button
                  onClick={() => onPlayTrailer(movie)}
                  className="flex items-center bg-white text-black px-6 py-3 rounded font-semibold hover:bg-gray-200 transition-colors"
                >
                  <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                  Play
                </button>
                <button className="flex items-center bg-gray-600 text-white px-6 py-3 rounded font-semibold hover:bg-gray-500 transition-colors">
                  <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                  Add to List
                </button>
              </div>
            </div>

            <div className="flex-shrink-0 md:w-64">
              <div className="mb-4">
                <span className="text-gray-400">Cast: </span>
                <span className="text-white">{movie.cast}</span>
              </div>
              <div className="mb-4">
                <span className="text-gray-400">Genres: </span>
                <span className="text-white">{movie.genres}</span>
              </div>
              <div className="mb-4">
                <span className="text-gray-400">Director: </span>
                <span className="text-white">{movie.director}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Video Player Modal Component
export const VideoPlayerModal = ({ videoId, isOpen, onClose, title }) => {
  if (!isOpen || !videoId) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4">
      <div className="relative w-full max-w-6xl">
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75 transition-colors z-10"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
            title={title}
            className="w-full h-full"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        </div>
      </div>
    </div>
  );
};

// Netflix Footer Component
export const NetflixFooter = () => {
  return (
    <footer className="bg-black text-gray-400 px-4 md:px-16 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center mb-8">
          <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 24 24">
            <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
          </svg>
          <span>Follow us on social media</span>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white transition-colors">Audio Description</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Gift Cards</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Media Center</a></li>
            </ul>
          </div>
          <div>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white transition-colors">Investor Relations</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Jobs</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Use</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
            </ul>
          </div>
          <div>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white transition-colors">Legal Notices</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Cookie Preferences</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Corporate Information</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
            </ul>
          </div>
          <div>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white transition-colors">Account</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Ways to Watch</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Speed Test</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Only on Netflix</a></li>
            </ul>
          </div>
        </div>

        <button className="border border-gray-400 text-gray-400 px-4 py-2 mb-6 hover:text-white hover:border-white transition-colors">
          Service Code
        </button>

        <p className="text-sm">© 2025 Netflix Clone. This is a demo application.</p>
      </div>
    </footer>
  );
};