import React, { useState, useEffect } from 'react';
import { Search, BookOpen, Sparkles, ArrowRight, Filter, Star, ShoppingCart, MessageCircle, Info } from 'lucide-react';
import BookChatBot from '../components/BookChatBot';
import EnrichedBookInfo from '../components/EnrichedBookInfo';

const HomePage = () => {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  
  // Modal states
  const [showChatBot, setShowChatBot] = useState(false);
  const [showEnrichedInfo, setShowEnrichedInfo] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);

  const categories = [
    'science', 'biography', 'politics', 'economics', 'environment', 'relationships',
    'happiness', 'money', 'productivity', 'psychology', 'motivation', 'marketing',
    'management', 'health', 'business', 'creativity', 'education', 'communication',
    'religion', 'technology', 'work', 'mindfulness'
  ];

  // Scroll to top and trigger load animation on component mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleSearch = async () => {
    if (!query.trim()) {
      setError('Please enter a search query');
      return;
    }

    setLoading(true);
    setError('');
    setHasSearched(true);

    try {
      const requestBody = {
        query: query.trim(),
        ...(category && { category })
      };

      const response = await fetch('http://localhost:8000/book_search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('No matching books found. Try a different search term.');
        }
        throw new Error(`Search failed: ${response.status}`);
      }

      const data = await response.json();
      
      // Sort by relevance (highest first)
      const sortedResults = data.sort((a, b) => (b.relevance || 0) - (a.relevance || 0));
      setResults(sortedResults);
      
    } catch (err) {
      setError(err.message);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const formatRelevance = (relevance) => {
    if (relevance === null || relevance === undefined) return 'N/A';
    return `${(relevance * 100).toFixed(1)}%`;
  };

  const getRelevanceColor = (relevance) => {
    if (relevance === null || relevance === undefined) return 'text-gray-500';
    if (relevance >= 0.7) return 'text-green-600';
    if (relevance >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handleChatWithBot = (book) => {
    setSelectedBook(book);
    setShowChatBot(true);
  };

  const handleViewEnrichedInfo = (book) => {
    setSelectedBook(book);
    setShowEnrichedInfo(true);
  };

  const handleBuyBook = (bookName) => {
    const searchQuery = `buy "${bookName}" book online`;
    const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;
    window.open(googleSearchUrl, '_blank');
  };

  const closeChatBot = () => {
    setShowChatBot(false);
    setSelectedBook(null);
  };

  const closeEnrichedInfo = () => {
    setShowEnrichedInfo(false);
    setSelectedBook(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      
      {/* Header Section with parallax effect */}
      <section className="relative bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16 overflow-hidden">
        <div 
          className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-purple-600/20"
          style={{
            transform: `translateY(${scrollY * 0.3}px)`,
          }}
        />
        <div className={`max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'}`}>
          <div className="flex items-center justify-center space-x-2 mb-6 animate-fade-in">
            <BookOpen className="h-8 w-8" />
            <Sparkles className="h-6 w-6 text-yellow-300" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-slide-up">
            Discover Your Perfect Book
          </h1>
          <p className="text-xl text-indigo-100 animate-slide-up-delay">
            Tell us what you're looking for and let AI find your next great read
          </p>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Search Form */}
          <div className={`bg-white rounded-2xl shadow-xl border border-slate-200 p-8 mb-12 transition-all duration-1000 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="space-y-6">
              
              {/* Query Input */}
              <div className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  What kind of book are you looking for?
                </label>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="e.g., teaches the ancient Buddhist practice of mindfulness."
                    className="w-full pl-12 pr-4 py-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-700"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div className="animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Category (Optional)
                </label>
                <div className="relative">
                  <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <select 
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-700"
                    disabled={loading}
                  >
                    <option value="">All Categories</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 animate-fade-in">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              {/* Search Button */}
              <div className="animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
                <button 
                  type="button"
                  onClick={handleSearch}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-semibold text-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Searching...</span>
                    </>
                  ) : (
                    <>
                      <Search className="h-5 w-5" />
                      <span>Find My Books</span>
                      <ArrowRight className="h-5 w-5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Results Section */}
          {hasSearched && (
            <div className="space-y-8">
              {results.length > 0 ? (
                <>
                  <div className="text-center animate-fade-in">
                    <h2 className="text-2xl font-bold text-slate-700 mb-2">
                      Found {results.length} Book{results.length !== 1 ? 's' : ''} for You
                    </h2>
                    <p className="text-slate-600">
                      Sorted by relevance to your search
                    </p>
                  </div>

                  <div className="grid gap-6">
                    {results.map((book, index) => (
                      <div 
                        key={index} 
                        className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-shadow duration-300 animate-fade-in-up"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="text-xl font-bold text-slate-800">
                                {book.book_name}
                              </h3>
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                {book.category}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2 mb-3">
                              <Star className="h-4 w-4 text-yellow-500" />
                              <span className={`text-sm font-medium ${getRelevanceColor(book.relevance)}`}>
                                {formatRelevance(book.relevance)} match
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-2xl font-bold text-slate-300">
                              #{index + 1}
                            </span>
                          </div>
                        </div>
                        
                        <p className="text-slate-700 leading-relaxed mb-6">
                          {book.summary}
                        </p>
                        
                        {/* Action Buttons */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          <button 
                            onClick={() => handleChatWithBot(book)}
                            className="flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-xl hover:from-blue-600 hover:to-cyan-700 transition-all duration-300 font-medium"
                          >
                            <MessageCircle className="h-4 w-4" />
                            <span>Chat with Expert</span>
                          </button>
                          
                          <button 
                            onClick={() => handleViewEnrichedInfo(book)}
                            className="flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl hover:from-purple-600 hover:to-pink-700 transition-all duration-300 font-medium"
                          >
                            <Info className="h-4 w-4" />
                            <span>View Details</span>
                          </button>
                          
                          <button 
                            onClick={() => handleBuyBook(book.book_name)}
                            className="flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 font-medium"
                          >
                            <ShoppingCart className="h-4 w-4" />
                            <span>Buy This Book</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : !loading && (
                <div className="text-center py-16 animate-fade-in">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-100 to-orange-100 rounded-full mb-6">
                    <Search className="h-10 w-10 text-red-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-700 mb-4">
                    No Books Found
                  </h2>
                  <p className="text-slate-600 max-w-md mx-auto">
                    Try adjusting your search terms or selecting a different category.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Placeholder Section (shown when no search has been made) */}
          {!hasSearched && (
            <div className={`text-center py-16 transition-all duration-1000 delay-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full mb-6 animate-pulse-slow">
                <BookOpen className="h-10 w-10 text-indigo-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-700 mb-4 animate-slide-up">
                Ready to Discover Amazing Books?
              </h2>
              <p className="text-slate-600 max-w-md mx-auto animate-slide-up-delay">
                Enter your search query above and let our AI find the perfect book recommendations for you.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Features Preview */}
      <section className={`py-16 bg-white/50 transition-all duration-1000 delay-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-4 animate-slide-up">
              What You'll Get
            </h2>
            <p className="text-lg text-slate-600 animate-slide-up-delay">
              Each book recommendation comes with powerful features
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Search, title: "Smart Recommendations", desc: "AI-powered suggestions based on your query", color: "from-blue-500 to-cyan-600" },
              { icon: MessageCircle, title: "Literary Expert Chat", desc: "Ask questions and get insights about any book", color: "from-green-500 to-teal-600" },
              { icon: Info, title: "Enriched Details", desc: "Comprehensive book information and recommendations", color: "from-purple-500 to-pink-600" },
              { icon: ShoppingCart, title: "Easy Purchase", desc: "Quick links to buy your favorite books online", color: "from-green-500 to-emerald-600" }
            ].map((feature, index) => (
              <div 
                key={index}
                className="text-center p-6 bg-white rounded-2xl shadow-lg border border-slate-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-fade-in-up"
                style={{ animationDelay: `${1 + index * 0.1}s` }}
              >
                <div className={`inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br ${feature.color} rounded-2xl mb-4`}>
                  <feature.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modal Components */}
      {showChatBot && selectedBook && (
        <BookChatBot 
          book={selectedBook} 
          onClose={closeChatBot} 
        />
      )}

      {showEnrichedInfo && selectedBook && (
        <EnrichedBookInfo 
          book={selectedBook} 
          onClose={closeEnrichedInfo} 
        />
      )}

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes pulse-slow {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
        
        .animate-slide-up {
          animation: slide-up 0.8s ease-out 0.2s both;
        }
        
        .animate-slide-up-delay {
          animation: slide-up 0.8s ease-out 0.4s both;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out both;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default HomePage;