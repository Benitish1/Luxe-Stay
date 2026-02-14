'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { roomsAPI, roomTypesAPI } from '@/lib/api';

interface RoomType {
  id: number;
  name: string;
  description: string;
  base_price: number;
  capacity: number;
  image_url: string;
}

interface Room {
  id: number;
  room_number: string;
  room_type_id: number;
  is_available: boolean;
  room_type?: RoomType;
}

export default function RoomsPublicPage() {
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [typesData, roomsData] = await Promise.all([
        roomTypesAPI.getAll().catch(() => []),
        roomsAPI.getAll().catch(() => []),
      ]);
      setRoomTypes(typesData);
      setRooms(roomsData);
    } catch (error) {
      console.error('Failed to load rooms:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getAvailableCount = (typeId: number) => {
    return rooms.filter((r) => r.room_type_id === typeId && r.is_available).length;
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 glass">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-primary-400 to-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-xl font-bold">L</span>
            </div>
            <span className="text-white text-2xl font-bold">LuxeStay</span>
          </Link>
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

      {/* Hero */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Explore Our <span className="bg-gradient-to-r from-primary-400 to-purple-400 bg-clip-text text-transparent">Rooms</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Discover our selection of elegantly designed rooms, each offering comfort and luxury
          </p>
        </div>
      </section>

      {/* Room Types */}
      <section className="px-6 pb-24">
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : roomTypes.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🏨</div>
              <h2 className="text-2xl font-bold text-white mb-2">Coming Soon</h2>
              <p className="text-gray-400">Our rooms are being prepared. Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {roomTypes.map((type, index) => (
                <div
                  key={type.id}
                  className="group bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden hover:border-primary-500/50 transition-all duration-300"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Image */}
                  <div className="h-56 bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center relative overflow-hidden">
                    <span className="text-7xl group-hover:scale-110 transition-transform duration-300">🛏️</span>
                    <div className="absolute top-4 right-4 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium">
                      {getAvailableCount(type.id)} available
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-bold text-white">{type.name}</h3>
                      <div className="text-right">
                        <span className="text-2xl font-bold text-primary-400">${type.base_price}</span>
                        <span className="text-gray-400 text-sm">/night</span>
                      </div>
                    </div>

                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                      {type.description || 'Experience comfort and elegance in our beautifully designed room.'}
                    </p>

                    <div className="flex items-center space-x-4 text-sm text-gray-400 mb-6">
                      <span className="flex items-center">
                        <span className="mr-1">👥</span>
                        {type.capacity} guests
                      </span>
                      <span className="flex items-center">
                        <span className="mr-1">🛏️</span>
                        Premium bed
                      </span>
                    </div>

                    <Link
                      href="/login"
                      className="block w-full text-center py-3 bg-gradient-to-r from-primary-500 to-primary-700 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-primary-500/30 transition-all duration-300"
                    >
                      Book Now
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto text-center text-gray-500 text-sm">
          © 2024 LuxeStay Hotel Management. All rights reserved.
        </div>
      </footer>
    </main>
  );
}
