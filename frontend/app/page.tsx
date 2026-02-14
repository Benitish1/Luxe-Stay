'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 glass">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-primary-400 to-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-xl font-bold">L</span>
            </div>
            <span className="text-white text-2xl font-bold">LuxeStay</span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <Link href="#rooms" className="text-gray-300 hover:text-white transition-colors">Rooms</Link>
            <Link href="#amenities" className="text-gray-300 hover:text-white transition-colors">Amenities</Link>
            <Link href="#contact" className="text-gray-300 hover:text-white transition-colors">Contact</Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/login" className="text-white hover:text-primary-300 transition-colors font-medium">
              Sign In
            </Link>
            <Link href="/register" className="bg-gradient-to-r from-primary-500 to-primary-700 text-white px-6 py-2 rounded-full hover:shadow-lg hover:shadow-primary-500/30 transition-all duration-300">
              Register
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6 pt-20">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent-gold rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className={`relative z-10 text-center max-w-4xl mx-auto transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-block px-4 py-2 bg-white/10 rounded-full text-primary-300 text-sm font-medium mb-6 backdrop-blur-sm border border-white/20">
            ✨ Experience Luxury Like Never Before
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Welcome to{' '}
            <span className="bg-gradient-to-r from-primary-400 via-purple-400 to-accent-gold bg-clip-text text-transparent">
              LuxeStay
            </span>
          </h1>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            Discover unparalleled comfort and elegance. From stunning suites to world-class amenities, 
            your perfect stay awaits.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/rooms" className="group relative inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-700 text-white font-semibold rounded-full overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-primary-500/40 hover:-translate-y-1">
              <span className="relative z-10">Explore Rooms</span>
              <svg className="relative z-10 ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link href="/login" className="inline-flex items-center px-8 py-4 text-white font-semibold rounded-full border border-white/30 hover:bg-white/10 transition-all duration-300">
              Book Now
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-white/50 rounded-full animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 bg-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Why Choose LuxeStay?</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Experience the perfect blend of luxury, comfort, and convenience</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: '🏨', title: 'Premium Rooms', desc: 'Elegantly designed spaces with modern amenities for your comfort' },
              { icon: '🍽️', title: 'Fine Dining', desc: 'World-class cuisine prepared by renowned chefs' },
              { icon: '💆', title: 'Spa & Wellness', desc: 'Rejuvenate your body and mind with our spa services' },
            ].map((feature, index) => (
              <div key={index} className="group p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-primary-500/50 hover:bg-white/10 transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-purple-500 rounded-xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-6 md:mb-0">
            <div className="w-8 h-8 bg-gradient-to-r from-primary-400 to-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">L</span>
            </div>
            <span className="text-white text-xl font-bold">LuxeStay</span>
          </div>
          <p className="text-gray-500 text-sm">© 2024 LuxeStay Hotel Management. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
