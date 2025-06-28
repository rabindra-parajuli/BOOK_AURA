import React, { useEffect, useState } from 'react';
import { ArrowLeft, Database, Brain, Zap, Code, Search, MessageCircle, ShoppingCart, Server, Globe, Layers, GitBranch, Cpu, Cloud, BookOpen, TrendingUp, Users, Star, ChevronUp, User, Calendar, Tag, Target, Coffee, ExternalLink } from 'lucide-react';

const LearnMore = ({ setCurrentPage }) => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);
      setShowScrollTop(currentScrollY > 300);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const techStack = [
    {
      category: 'Backend',
      icon: Server,
      color: 'from-green-500 to-emerald-600',
      technologies: [
        { name: 'FastAPI', description: 'High-performance Python web framework for building APIs' },
        { name: 'MindsDB', description: 'AI-powered database with ML capabilities and knowledge base' },
        { name: 'Docker Desktop', description: 'Containerization for consistent development environment' },
        { name: 'Python', description: 'Core backend programming language' }
      ]
    },
    {
      category: 'Frontend',
      icon: Globe,
      color: 'from-blue-500 to-cyan-600',
      technologies: [
        { name: 'React 18', description: 'Modern JavaScript library for building user interfaces' },
        { name: 'Vite', description: 'Lightning-fast build tool and development server' },
        { name: 'Tailwind CSS', description: 'Utility-first CSS framework for rapid UI development' },
        { name: 'Lucide React', description: 'Beautiful & customizable SVG icons' }
      ]
    },
    {
      category: 'AI & Data',
      icon: Brain,
      color: 'from-purple-500 to-indigo-600',
      technologies: [
        { name: 'MindsDB Agents', description: 'Intelligent agents for automated book information retrieval' },
        { name: 'Knowledge Base', description: 'Semantic search with 1,200+ book descriptions' },
        { name: 'Google Search API', description: 'Real-time book purchase link generation' },
        { name: 'Semantic Search', description: 'Advanced NLP for understanding user queries' }
      ]
    }
  ];

  const features = [
    {
      icon: Search,
      title: 'Intelligent Book Discovery',
      description: 'Our AI analyzes your query using semantic search to understand context, mood, and preferences beyond simple keyword matching.',
      technical: 'MindsDB Knowledge Base with 1,200+ book descriptions, semantic embedding, and relevance scoring'
    },
    {
      icon: Brain,
      title: 'AI-Powered Literary Expert',
      description: 'Chat with our specialized AI literary expert that understands books deeply and can provide thoughtful analysis, interpretations, and discussions.',
      technical: 'Custom conversational agent using MindsDB with literary knowledge and contextual understanding'
    },
    {
      icon: BookOpen,
      title: 'Enriched Book Information',
      description: 'Get comprehensive book details including author information, publication dates, tags, target audience, and curated metadata.',
      technical: 'Enhanced metadata extraction with author profiles, publication history, genre classification, and audience targeting'
    },
    {
      icon: ShoppingCart,
      title: 'Instant Purchase Links',
      description: 'One-click access to book purchasing options through intelligent search integration with trusted online retailers.',
      technical: 'Google Custom Search API integration with real-time availability checking and purchase link generation'
    }
  ];

  const dataSpecs = [
    { icon: BookOpen, label: 'Books in Database', value: '1,200+', description: 'Curated collection with detailed descriptions' },
    { icon: Layers, label: 'Categories', value: '22', description: 'From Science to Mindfulness, covering all interests' },
    { icon: TrendingUp, label: 'Search Accuracy', value: '95%+', description: 'Semantic matching with high relevance scores' },
    { icon: Zap, label: 'Response Time', value: '<2s', description: 'Fast API responses with optimized queries' },
    { icon: User, label: 'Author Profiles', value: '800+', description: 'Comprehensive author information and biographies' },
    { icon: MessageCircle, label: 'Chat Interactions', value: 'Unlimited', description: 'Deep literary discussions with AI expert' }
  ];

  const apiEndpoints = [
    {
      endpoint: '/book_search',
      method: 'POST',
      description: 'Semantic search for books based on user queries',
      color: 'bg-blue-500'
    },
    {
      endpoint: '/book_bot',
      method: 'POST', 
      description: 'Chat with AI literary expert about specific books',
      color: 'bg-purple-500'
    },
    {
      endpoint: '/enriched_book_info',
      method: 'POST',
      description: 'Get comprehensive book metadata and details',
      color: 'bg-green-500'
    }
  ];

  const architecture = [
    {
      layer: 'Frontend Layer',
      icon: Globe,
      color: 'bg-blue-500',
      components: ['React Components', 'Tailwind Styling', 'Responsive Design', 'State Management']
    },
    {
      layer: 'API Layer',
      icon: Server,
      color: 'bg-green-500',
      components: ['FastAPI Routes', 'CORS Middleware', 'Request Validation', 'Error Handling']
    },
    {
      layer: 'AI Layer',
      icon: Brain,
      color: 'bg-purple-500',
      components: ['MindsDB Connection', 'Knowledge Base Query', 'Agent Orchestration', 'Semantic Search']
    },
    {
      layer: 'Data Layer',
      icon: Database,
      color: 'bg-indigo-500',
      components: ['Book Metadata', 'Category Classification', 'Relevance Scoring', 'JSON Parsing']
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      
      {/* Header with parallax effect */}
      <section className="relative bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-20 overflow-hidden">
        <div 
          className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-purple-600/20"
          style={{
            transform: `translateY(${scrollY * 0.5}px)`,
          }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <button
            onClick={() => setCurrentPage('landing')}
            className="inline-flex items-center space-x-2 mb-8 text-indigo-200 hover:text-white transition-colors group"
          >
            <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Home</span>
          </button>
          
          <div className="max-w-4xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
              How BookAura Works
            </h1>
            <p className="text-xl text-indigo-100 leading-relaxed animate-fade-in-delay">
              Dive deep into the technology powering BookAura's intelligent book recommendation system. 
              Built with cutting-edge AI, modern web technologies, and a passion for connecting readers with perfect books.
            </p>
          </div>
        </div>
      </section>

      {/* Data Specifications with animation */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">Platform Specifications</h2>
            <p className="text-lg text-slate-600">Core metrics and capabilities of our book recommendation engine</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {dataSpecs.map((spec, index) => (
              <div 
                key={index} 
                className="text-center p-6 bg-gradient-to-br from-slate-50 to-white rounded-2xl shadow-lg border border-slate-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                style={{
                  animationDelay: `${index * 0.1}s`,
                }}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mb-4">
                  <spec.icon className="h-8 w-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-slate-800 mb-2">{spec.value}</div>
                <div className="text-lg font-semibold text-slate-700 mb-2">{spec.label}</div>
                <div className="text-sm text-slate-600">{spec.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* API Endpoints Section */}
      {/* <section className="py-16 bg-gradient-to-br from-slate-100 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">API Endpoints</h2>
            <p className="text-lg text-slate-600">RESTful APIs powering BookAura's intelligent features</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {apiEndpoints.map((api, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className={`${api.color} text-white p-4 text-center`}>
                  <div className="text-sm font-mono opacity-90">{api.method}</div>
                  <div className="text-lg font-bold">{api.endpoint}</div>
                </div>
                <div className="p-6">
                  <p className="text-slate-600 text-sm leading-relaxed">{api.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Architecture Overview */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">System Architecture</h2>
            <p className="text-lg text-slate-600">Multi-layered architecture ensuring scalability, performance, and reliability</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {architecture.map((layer, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className={`${layer.color} text-white p-6 text-center`}>
                  <layer.icon className="h-8 w-8 mx-auto mb-3" />
                  <h3 className="text-lg font-bold">{layer.layer}</h3>
                </div>
                <div className="p-6">
                  <ul className="space-y-2">
                    {layer.components.map((component, idx) => (
                      <li key={idx} className="flex items-center space-x-2 text-sm text-slate-600">
                        <div className="w-1.5 h-1.5 bg-slate-400 rounded-full"></div>
                        <span>{component}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="py-16 bg-gradient-to-br from-slate-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">Technology Stack</h2>
            <p className="text-lg text-slate-600">Modern, scalable technologies powering every aspect of BookAura</p>
          </div>
          
          <div className="space-y-12">
            {techStack.map((stack, index) => (
              <div key={index} className="bg-gradient-to-br from-white to-slate-50 rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
                <div className={`bg-gradient-to-r ${stack.color} text-white p-6`}>
                  <div className="flex items-center space-x-3">
                    <stack.icon className="h-8 w-8" />
                    <h3 className="text-2xl font-bold">{stack.category}</h3>
                  </div>
                </div>
                <div className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {stack.technologies.map((tech, idx) => (
                      <div key={idx} className="border-l-4 border-indigo-200 pl-4 hover:border-indigo-400 transition-colors">
                        <h4 className="text-lg font-semibold text-slate-800 mb-2">{tech.name}</h4>
                        <p className="text-slate-600">{tech.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Deep Dive */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">Core Features</h2>
            <p className="text-lg text-slate-600">Technical implementation details of BookAura's intelligent capabilities</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-gradient-to-br from-white to-slate-50 rounded-2xl shadow-lg border border-slate-200 p-8 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl">
                    <feature.icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800">{feature.title}</h3>
                </div>
                
                <p className="text-slate-600 mb-6 leading-relaxed">{feature.description}</p>
                
                <div className="bg-gradient-to-r from-slate-100 to-indigo-50 rounded-xl p-4">
                  <h4 className="text-sm font-semibold text-slate-700 mb-2">Technical Implementation:</h4>
                  <p className="text-sm text-slate-600">{feature.technical}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Development Info */}
      <section className="py-16 bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl text-white p-12 shadow-2xl">
            <Code className="h-16 w-16 mx-auto mb-6 opacity-90" />
            <h2 className="text-3xl font-bold mb-4">Built for Developers</h2>
            <p className="text-xl text-indigo-100 mb-8 leading-relaxed">
              BookAura showcases modern web development practices with clean APIs, 
              responsive design, and scalable architecture. Perfect for learning and extending.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setCurrentPage('home')}
                className="bg-white text-indigo-600 px-8 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors hover:scale-105 transform"
              >
                Try the App
              </button>
              
              <button
              onClick={() => setCurrentPage('')} 
              className="border-2 border-white/30 text-white px-8 py-3 rounded-xl font-semibold hover:bg-white/10 transition-colors hover:scale-105 transform">
                Find More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-50 hover:scale-110 transform"
        >
          <ChevronUp className="h-6 w-6" />
        </button>
      )}

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fade-in-delay {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
        
        .animate-fade-in-delay {
          animation: fade-in-delay 0.8s ease-out 0.3s both;
        }
      `}</style>
    </div>
  );
};

export default LearnMore;