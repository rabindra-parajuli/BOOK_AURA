import React from 'react';
import { BookOpen, Sparkles, Heart, Github, Twitter, Mail, MessageCircle, Info, ShoppingCart, Search, Bot, Calendar, User, Tag } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { label: 'Home', href: '#' },
    { label: 'Discover Books', href: '#' },
    { label: 'Categories', href: '#' },
    { label: 'Chat with Expert', href: '#' },
    { label: 'Learn More', href: '#' },
  ];

  const categories = [
    'Science', 'Biography', 'Psychology', 'Business',
    'Technology', 'Health', 'Creativity', 'Mindfulness'
  ];

  const socialLinks = [
    { icon: Github, href: '#', label: 'GitHub' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Mail, href: '#', label: 'Email' },
  ];

  const coreFeatures = [
    { icon: Search, text: 'AI-Powered Recommendations', color: 'bg-indigo-400' },
    { icon: Bot, text: 'Literary Expert Chat Bot', color: 'bg-purple-400' },
    { icon: Info, text: 'Enriched Book Details', color: 'bg-blue-400' },
    { icon: ShoppingCart, text: 'Quick Purchase Links', color: 'bg-green-400' },
  ];

  const enrichedFeatures = [
    { icon: User, text: 'Author Information', color: 'bg-pink-400' },
    { icon: Calendar, text: 'Publication Dates', color: 'bg-yellow-400' },
    { icon: Tag, text: 'Smart Tags & Categories', color: 'bg-orange-400' },
    { icon: MessageCircle, text: 'Interactive Book Discussions', color: 'bg-cyan-400' },
  ];

  return (
    <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 bg-indigo-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-purple-500 rounded-full blur-3xl"></div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="relative">
                <BookOpen className="h-8 w-8 text-indigo-400" />
                <Sparkles className="h-4 w-4 text-yellow-400 absolute -top-1 -right-1 animate-pulse" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                BookAura
              </span>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed mb-6">
              Your intelligent book companion. Discover personalized recommendations, 
              chat with our literary expert, and explore enriched book details with 
              our advanced AI-powered platform.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="text-slate-400 hover:text-indigo-400 transition-all duration-300 transform hover:scale-110 hover:rotate-6"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white flex items-center">
              <div className="w-2 h-2 bg-indigo-400 rounded-full mr-2"></div>
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-slate-300 hover:text-indigo-400 transition-all duration-200 text-sm flex items-center group"
                  >
                    <span className="w-0 group-hover:w-2 h-0.5 bg-indigo-400 transition-all duration-200 mr-0 group-hover:mr-2"></span>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white flex items-center">
              <div className="w-2 h-2 bg-purple-400 rounded-full mr-2"></div>
              Popular Categories
            </h3>
            <ul className="space-y-3">
              {categories.slice(0, 6).map((category, index) => (
                <li key={index}>
                  <a
                    href="#"
                    className="text-slate-300 hover:text-purple-400 transition-all duration-200 text-sm flex items-center group"
                  >
                    <span className="w-0 group-hover:w-2 h-0.5 bg-purple-400 transition-all duration-200 mr-0 group-hover:mr-2"></span>
                    {category}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Core Features */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white flex items-center">
              <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></div>
              Core Features
            </h3>
            <ul className="space-y-3">
              {coreFeatures.map((feature, index) => (
                <li key={index} className="flex items-center space-x-3 group">
                  <div className={`w-2 h-2 ${feature.color} rounded-full group-hover:scale-125 transition-transform duration-200`}></div>
                  <feature.icon className="h-4 w-4 text-slate-400 group-hover:text-indigo-400 transition-colors duration-200" />
                  <span className="text-slate-300 text-sm group-hover:text-white transition-colors duration-200">
                    {feature.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Enhanced Features Section */}
        <div className="mt-12 pt-8 border-t border-slate-700">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-white mb-2 flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-yellow-400 mr-2 animate-pulse" />
              Enhanced Book Intelligence
              <Sparkles className="h-6 w-6 text-yellow-400 ml-2 animate-pulse" />
            </h3>
            <p className="text-slate-400 text-sm">
              Powered by advanced AI for the ultimate book discovery experience
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {enrichedFeatures.map((feature, index) => (
              <div key={index} className="flex flex-col items-center text-center group hover:scale-105 transition-transform duration-300">
                <div className={`w-12 h-12 ${feature.color} rounded-full flex items-center justify-center mb-3 group-hover:rotate-12 transition-transform duration-300`}>
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <span className="text-slate-300 text-sm group-hover:text-white transition-colors duration-200">
                  {feature.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-700 bg-slate-900/50 backdrop-blur-sm relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-slate-400 text-sm flex items-center">
              © {currentYear} BookAura. Made with{' '}
              <Heart className="inline h-4 w-4 text-pink-500 mx-1 animate-pulse" />
              for book lovers everywhere.{' '}
              <Bot className="inline h-4 w-4 text-indigo-400 ml-2" />
              <span className="text-indigo-400 ml-1">AI-Powered</span>
            </div>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-slate-400 hover:text-indigo-400 text-sm transition-colors hover:underline">
                Privacy Policy
              </a>
              <a href="#" className="text-slate-400 hover:text-indigo-400 text-sm transition-colors hover:underline">
                Terms of Service
              </a>
              <a href="#" className="text-slate-400 hover:text-indigo-400 text-sm transition-colors hover:underline">
                API Docs
              </a>
              <a href="#" className="text-slate-400 hover:text-indigo-400 text-sm transition-colors hover:underline">
                Contact
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;