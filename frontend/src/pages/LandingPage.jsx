import React, { useEffect, useState } from 'react';
import { ArrowRight, BookOpen, Brain, Search, MessageCircle, ExternalLink, Sparkles, Star, Users, TrendingUp, ShoppingCart, Info, Bot, Calendar, Tag, UserCheck, Scroll, ChevronUp } from 'lucide-react';

const LandingPage = ({ setCurrentPage }) => {
  const [scrollY, setScrollY] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    // Scroll to top when component loads
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const handleScroll = () => {
      setScrollY(window.scrollY);
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Recommendations',
      description: 'Get personalized book suggestions using advanced semantic search and machine learning algorithms.',
      color: 'from-purple-500 to-indigo-600'
    },
    {
      icon: Search,
      title: 'Smart Search',
      description: 'Find books based on your interests, mood, or specific topics with our intelligent search system.',
      color: 'from-blue-500 to-cyan-600'
    },
    {
      icon: Info,
      title: 'Enriched Book Details',
      description: 'Get comprehensive information including author, publication date, target audience, and detailed insights.',
      color: 'from-emerald-500 to-teal-600'
    },
    {
      icon: Bot,
      title: 'Literary Expert Chat',
      description: 'Engage with our AI literary expert for deep discussions and detailed analysis of any book.',
      color: 'from-pink-500 to-rose-600'
    },
    {
      icon: ShoppingCart,
      title: 'Quick Purchase Links',
      description: 'Find and buy your recommended books instantly with integrated purchase options.',
      color: 'from-orange-500 to-amber-600'
    },
    {
      icon: MessageCircle,
      title: 'Interactive Experience',
      description: 'Chat with our AI to get detailed information and personalized answers about any book.',
      color: 'from-violet-500 to-purple-600'
    }
  ];

  const stats = [
    { icon: BookOpen, value: '1,200+', label: 'Books in Database' },
    { icon: Users, value: '10K+', label: 'Happy Readers' },
    { icon: Star, value: '4.9/5', label: 'User Rating' },
    { icon: TrendingUp, value: '98%', label: 'Match Accuracy' }
  ];

  const categories = [
    'Science', 'Biography', 'Politics', 'Economics', 'Environment', 'Relationships',
    'Happiness', 'Money', 'Productivity', 'Psychology', 'Motivation', 'Marketing',
    'Management', 'Health', 'Business', 'Creativity', 'Education', 'Communication',
    'Religion', 'Technology', 'Work', 'Mindfulness'
  ];

  const bookFeatures = [
    {
      icon: Calendar,
      title: 'Publication Details',
      description: 'Release dates, editions, and publishing information'
    },
    {
      icon: UserCheck,
      title: 'Target Audience',
      description: 'Perfect reader profiles and recommended age groups'
    },
    {
      icon: Tag,
      title: 'Smart Tags',
      description: 'Genre tags, themes, and content classifications'
    },
    {
      icon: Info,
      title: 'Author Insights',
      description: 'Author background and other notable works'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 relative overflow-x-hidden">
      
      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-3 rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 hover:from-indigo-700 hover:to-purple-700"
        >
          <ChevronUp className="h-6 w-6" />
        </button>
      )}

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Elements with parallax effect */}
        <div 
          className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 to-purple-600/10"
          style={{ transform: `translateY(${scrollY * 0.5}px)` }}
        ></div>
        <div 
          className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-purple-600/20 rounded-full blur-3xl"
          style={{ transform: `translate(${scrollY * 0.3}px, ${scrollY * 0.2}px)` }}
        ></div>
        <div 
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-cyan-400/20 to-blue-600/20 rounded-full blur-3xl"
          style={{ transform: `translate(${-scrollY * 0.2}px, ${scrollY * 0.3}px)` }}
        ></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
          <div className="text-center">
            
            {/* Badge with animation */}
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full px-6 py-2 mb-8 animate-slideUpFade opacity-0" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
              <Sparkles className="h-4 w-4 text-indigo-600 animate-spin" />
              <span className="text-sm font-medium text-indigo-700">AI-Powered Book Discovery</span>
            </div>

            {/* Main Headline with enhanced gradients and slide up animation */}
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight animate-slideUpFade opacity-0" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient bg-300% bg-size-300 ">
                Discover Your
              </span>
              <br />
              <span className="text-slate-800 relative">
                Perfect Book
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 blur-xl -z-10 rounded-lg"></div>
              </span>
            </h1>

            {/* Enhanced Subtitle with slide up animation */}
            <p className="text-xl md:text-2xl text-slate-600 mb-12 max-w-3xl mx-auto leading-relaxed animate-slideUpFade opacity-0" style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}>
              Let AI understand your reading preferences and discover books with enriched details, 
              expert insights, and instant purchase options - all powered by advanced literary intelligence.
            </p>

            {/* Enhanced CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 animate-slideUpFade opacity-0" style={{ animationDelay: '0.8s', animationFillMode: 'forwards' }}>
              <button
                onClick={() => setCurrentPage('home')}
                className="group relative bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 flex items-center space-x-2 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative z-10">Start Discovering</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform relative z-10" />
              </button>
              
              <button
                onClick={() => setCurrentPage('learn')}
                className="px-8 py-4 rounded-xl font-semibold text-lg border-2 border-slate-300 text-slate-700 hover:border-indigo-300 hover:text-indigo-600 transition-all duration-300 hover:bg-white/50 hover:shadow-lg transform hover:-translate-y-0.5"
              >
                Learn More
              </button>
            </div>

            {/* Enhanced Stats with animations */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div 
                  key={index} 
                  className="text-center group transform hover:scale-105 transition-all duration-300 animate-slideUpFade opacity-0"
                  style={{ animationDelay: `${1.0 + (index * 0.1)}s`, animationFillMode: 'forwards' }}
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl mb-3 group-hover:shadow-lg transition-shadow duration-300">
                    <stat.icon className="h-6 w-6 text-indigo-600 group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <div className="text-2xl font-bold text-slate-800 group-hover:text-indigo-600 transition-colors duration-300">{stat.value}</div>
                  <div className="text-sm text-slate-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section className="py-24 bg-white/50 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-50/30 to-transparent"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6 animate-slideUpFade opacity-0" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
              Powerful Features for
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"> Book Lovers</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto animate-slideUpFade opacity-0" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
              Everything you need to discover, explore, analyze, and purchase your next great read
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border border-slate-100 relative overflow-hidden animate-slideUpFade opacity-0"
                style={{ animationDelay: `${0.6 + (index * 0.1)}s`, animationFillMode: 'forwards' }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-slate-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className={`relative inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="relative text-xl font-bold text-slate-800 mb-3 group-hover:text-indigo-600 transition-colors duration-300">{feature.title}</h3>
                <p className="relative text-slate-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* New Enriched Info Section */}
      <section className="py-24 bg-gradient-to-br from-white to-indigo-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6 animate-slideUpFade opacity-0" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
              Get 
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent"> Complete Book Insights</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto animate-slideUpFade opacity-0" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
              Access comprehensive book information beyond just summaries - know everything about your next read
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {bookFeatures.map((feature, index) => (
              <div
                key={index}
                className="group p-6 bg-white/80 backdrop-blur-sm rounded-xl border border-slate-200 hover:border-emerald-300 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl animate-slideUpFade opacity-0"
                style={{ animationDelay: `${0.6 + (index * 0.1)}s`, animationFillMode: 'forwards' }}
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-lg mb-4 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="h-6 w-6 text-emerald-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-600">{feature.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-full px-6 py-3 animate-slideUpFade opacity-0" style={{ animationDelay: '1.0s', animationFillMode: 'forwards' }}>
              <Bot className="h-5 w-5 text-emerald-600" />
              <span className="text-emerald-700 font-medium">Chat with our Literary Expert for deeper insights</span>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section with enhanced design */}
      <section className="py-24 bg-gradient-to-br from-indigo-50 to-purple-50 relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(120,119,198,0.1),transparent_50%)]"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6 animate-slideUpFade opacity-0" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
              Explore 
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"> Categories</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto animate-slideUpFade opacity-0" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
              Browse through our carefully curated categories with AI-powered recommendations for each
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category, index) => (
              <span
                key={index}
                className="px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full text-slate-700 font-medium hover:bg-gradient-to-r hover:from-indigo-500 hover:to-purple-500 hover:text-white transition-all duration-300 cursor-pointer transform hover:scale-105 shadow-sm hover:shadow-lg border border-white/50 hover:border-transparent animate-slideUpFade opacity-0"
                style={{ 
                  animationDelay: `${0.6 + (index * 0.05)}s`,
                  animationFillMode: 'forwards'
                }}
              >
                {category}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-24 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 animate-slideUpFade opacity-0" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
            Ready to Find Your Next Favorite Book?
          </h2>
          <p className="text-xl text-indigo-100 mb-10 max-w-2xl mx-auto animate-slideUpFade opacity-0" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
            Join thousands of readers discovering amazing books with AI-powered recommendations, 
            expert insights, and instant purchase options.
          </p>
          <button
            onClick={() => setCurrentPage('home')}
            className="group relative bg-white text-indigo-600 px-10 py-4 rounded-xl font-bold text-lg hover:bg-gray-50 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 flex items-center space-x-2 mx-auto overflow-hidden animate-slideUpFade opacity-0"
            style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <span className="relative z-10">Get Started Now</span>
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform relative z-10" />
          </button>
        </div>
      </section>

      <style jsx>{`
        @keyframes slideUpFade {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        .animate-slideUpFade {
          animation: slideUpFade 0.8s ease-out;
        }

        .animate-gradient {
          animation: gradient 3s ease infinite;
        }

        .bg-300% {
          background-size: 300% 300%;
        }

        .bg-size-300 {
          background-size: 300% 300%;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;