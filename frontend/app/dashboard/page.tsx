'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { roomsAPI, bookingsAPI } from '@/lib/api';

interface Stats {
  totalRooms: number;
  availableRooms: number;
  totalBookings: number;
  pendingBookings: number;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats>({
    totalRooms: 0,
    availableRooms: 0,
    totalBookings: 0,
    pendingBookings: 0,
  });
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [roomsData, bookingsData] = await Promise.all([
        roomsAPI.getAll().catch(() => []),
        user?.role === 'guest' 
          ? bookingsAPI.getMyBookings().catch(() => [])
          : bookingsAPI.getAll().catch(() => []),
      ]);

      setStats({
        totalRooms: roomsData.length,
        availableRooms: roomsData.filter((r: any) => r.is_available).length,
        totalBookings: bookingsData.length,
        pendingBookings: bookingsData.filter((b: any) => b.status === 'pending').length,
      });

      setRecentBookings(bookingsData.slice(0, 5));
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Rooms',
      value: stats.totalRooms,
      icon: '🛏️',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Available Rooms',
      value: stats.availableRooms,
      icon: '✅',
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: user?.role === 'guest' ? 'My Bookings' : 'Total Bookings',
      value: stats.totalBookings,
      icon: '📅',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Pending',
      value: stats.pendingBookings,
      icon: '⏳',
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className={`w-14 h-14 ${stat.bgColor} rounded-xl flex items-center justify-center text-2xl`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Recent Bookings</h2>
        </div>
        <div className="p-6">
          {recentBookings.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-5xl mb-4">📅</div>
              <p className="text-gray-500">No bookings yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-gray-500 text-sm">
                    <th className="pb-4 font-medium">Booking ID</th>
                    <th className="pb-4 font-medium">Room</th>
                    <th className="pb-4 font-medium">Check-in</th>
                    <th className="pb-4 font-medium">Check-out</th>
                    <th className="pb-4 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {recentBookings.map((booking) => (
                    <tr key={booking.id} className="text-gray-700">
                      <td className="py-4 font-medium">#{booking.id}</td>
                      <td className="py-4">Room {booking.room_id}</td>
                      <td className="py-4">{new Date(booking.start_date).toLocaleDateString()}</td>
                      <td className="py-4">{new Date(booking.end_date).toLocaleDateString()}</td>
                      <td className="py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            booking.status === 'confirmed'
                              ? 'bg-green-100 text-green-700'
                              : booking.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-700'
                              : booking.status === 'cancelled'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {booking.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      {user?.role !== 'guest' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-r from-primary-500 to-primary-700 rounded-2xl p-6 text-white">
            <h3 className="text-lg font-semibold mb-2">Add New Room</h3>
            <p className="text-primary-100 text-sm mb-4">Create a new room listing for guests to book</p>
            <a
              href="/dashboard/rooms"
              className="inline-flex items-center px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors text-sm font-medium"
            >
              Go to Rooms →
            </a>
          </div>
          <div className="bg-gradient-to-r from-purple-500 to-purple-700 rounded-2xl p-6 text-white">
            <h3 className="text-lg font-semibold mb-2">Manage Bookings</h3>
            <p className="text-purple-100 text-sm mb-4">View and manage all booking requests</p>
            <a
              href="/dashboard/bookings"
              className="inline-flex items-center px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors text-sm font-medium"
            >
              Go to Bookings →
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
