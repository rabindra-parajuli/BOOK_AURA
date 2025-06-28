import React, { useState, useEffect } from 'react';
import { Info, X, Calendar, Star, Tag, Users, BookOpen, Loader, AlertCircle } from 'lucide-react';

const EnrichedBookInfo = ({ book, onClose }) => {
  const [enrichedData, setEnrichedData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEnrichedInfo = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await fetch('http://localhost:8000/enriched_book_info', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            book_name: book.book_name,
            summary: book.summary, // This gets renamed to description in backend
            category: book.category
          }),
        });

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('No enriched information found for this book.');
          }
          throw new Error(`Failed to fetch enriched info: ${response.status}`);
        }

        const data = await response.json();
        
        // Parse the response string into structured data
        const parsedData = parseEnrichedResponse(data.response);
        setEnrichedData(parsedData);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEnrichedInfo();
  }, [book]);

  const parseEnrichedResponse = (responseString) => {
    const lines = responseString.split('\n').filter(line => line.trim());
    const data = {};
    
    lines.forEach(line => {
      const [key, ...valueParts] = line.split(':');
      if (key && valueParts.length > 0) {
        const value = valueParts.join(':').trim();
        data[key.trim()] = value;
      }
    });

    return {
      author: data.author || 'Unknown',
      release_year: data.release_year || 'Unknown',
      rating: data.rating || 'Not rated',
      tags: data.tags ? data.tags.split(',').map(tag => tag.trim()) : [],
      similar_books: data.similar_books ? data.similar_books.split(',').map(book => book.trim()) : [],
      target_audience: data.target_audience || 'General audience'
    };
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full">
          <div className="flex items-center justify-center space-x-3">
            <Loader className="h-8 w-8 animate-spin text-indigo-600" />
            <span className="text-lg font-medium text-slate-700">Loading enriched information...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-800">Error</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="flex items-center space-x-3 p-4 bg-red-50 rounded-xl">
            <AlertCircle className="h-6 w-6 text-red-600" />
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Info className="h-6 w-6" />
              <div>
                <h2 className="text-xl font-bold">Book Details</h2>
                <p className="text-indigo-100 text-sm">Enriched information for "{book.book_name}"</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-50 rounded-xl p-4">
              <div className="flex items-center space-x-2 mb-2">
                <BookOpen className="h-5 w-5 text-indigo-600" />
                <span className="font-semibold text-slate-700">Author</span>
              </div>
              <p className="text-slate-800 font-medium">{enrichedData.author}</p>
            </div>

            <div className="bg-slate-50 rounded-xl p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Calendar className="h-5 w-5 text-indigo-600" />
                <span className="font-semibold text-slate-700">Release Year</span>
              </div>
              <p className="text-slate-800 font-medium">{enrichedData.release_year}</p>
            </div>

            <div className="bg-slate-50 rounded-xl p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Star className="h-5 w-5 text-yellow-500" />
                <span className="font-semibold text-slate-700">Rating</span>
              </div>
              <p className="text-slate-800 font-medium">{enrichedData.rating}</p>
            </div>

            <div className="bg-slate-50 rounded-xl p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Users className="h-5 w-5 text-indigo-600" />
                <span className="font-semibold text-slate-700">Category</span>
              </div>
              <p className="text-slate-800 font-medium">{book.category}</p>
            </div>
          </div>

          {/* Tags */}
          {enrichedData.tags.length > 0 && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4">
              <div className="flex items-center space-x-2 mb-3">
                <Tag className="h-5 w-5 text-indigo-600" />
                <span className="font-semibold text-slate-700">Tags</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {enrichedData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Target Audience */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4">
            <div className="flex items-center space-x-2 mb-3">
              <Users className="h-5 w-5 text-green-600" />
              <span className="font-semibold text-slate-700">Target Audience</span>
            </div>
            <p className="text-slate-800 leading-relaxed">{enrichedData.target_audience}</p>
          </div>

          {/* Similar Books */}
          {enrichedData.similar_books.length > 0 && (
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4">
              <div className="flex items-center space-x-2 mb-3">
                <BookOpen className="h-5 w-5 text-purple-600" />
                <span className="font-semibold text-slate-700">Similar Books</span>
              </div>
              <div className="space-y-2">
                {enrichedData.similar_books.map((similarBook, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-2 p-2 bg-white rounded-lg"
                  >
                    <BookOpen className="h-4 w-4 text-purple-600" />
                    <span className="text-slate-800">{similarBook}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Original Summary */}
          <div className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-xl p-4">
            <div className="flex items-center space-x-2 mb-3">
              <Info className="h-5 w-5 text-slate-600" />
              <span className="font-semibold text-slate-700">Summary</span>
            </div>
            <p className="text-slate-800 leading-relaxed">{book.summary}</p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default EnrichedBookInfo;