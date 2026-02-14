'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { bookingsAPI, roomsAPI } from '@/lib/api';

interface Booking {
  id: number;
  user_id: number;
  room_id: number;
  start_date: string;
  end_date: string;
  total_price: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  created_at: string;
}

interface Room {
  id: number;
  room_number: string;
  room_type_id: number;
  is_available: boolean;
}

export default function BookingsPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    room_id: '',
    start_date: '',
    end_date: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [bookingsData, roomsData] = await Promise.all([
        user?.role === 'guest'
          ? bookingsAPI.getMyBookings().catch(() => [])
          : bookingsAPI.getAll().catch(() => []),
        roomsAPI.getAll().catch(() => []),
      ]);
      setBookings(bookingsData);
      setRooms(roomsData.filter((r: Room) => r.is_available));
    } catch (error) {
      console.error('Failed to load bookings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await bookingsAPI.create({
        room_id: parseInt(formData.room_id),
        start_date: formData.start_date,
        end_date: formData.end_date,
      });
      setShowModal(false);
      setFormData({ room_id: '', start_date: '', end_date: '' });
      loadData();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to create booking');
    }
  };

  const handleUpdateStatus = async (id: number, status: string) => {
    try {
      await bookingsAPI.updateStatus(id, status);
      loadData();
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Failed to update booking');
    }
  };

  const handleCancel = async (id: number) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await bookingsAPI.cancel(id);
      loadData();
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Failed to cancel booking');
    }
  };

  const canManage = user?.role === 'admin' || user?.role === 'staff';

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      case 'completed':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bookings</h1>
          <p className="text-gray-500 mt-1">
            {user?.role === 'guest' ? 'Your bookings' : 'Manage all bookings'}
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
        >
          + New Booking
        </button>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {bookings.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No bookings yet</h3>
            <p className="text-gray-500 mb-6">Create your first booking to get started</p>
            <button
              onClick={() => setShowModal(true)}
              className="px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
            >
              Create Booking
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr className="text-left text-gray-600 text-sm">
                  <th className="px-6 py-4 font-semibold">Booking ID</th>
                  <th className="px-6 py-4 font-semibold">Room</th>
                  <th className="px-6 py-4 font-semibold">Check-in</th>
                  <th className="px-6 py-4 font-semibold">Check-out</th>
                  <th className="px-6 py-4 font-semibold">Total</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {bookings.map((booking) => (
                  <tr key={booking.id} className="text-gray-700 hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium">#{booking.id}</td>
                    <td className="px-6 py-4">Room {booking.room_id}</td>
                    <td className="px-6 py-4">{new Date(booking.start_date).toLocaleDateString()}</td>
                    <td className="px-6 py-4">{new Date(booking.end_date).toLocaleDateString()}</td>
                    <td className="px-6 py-4 font-semibold">${booking.total_price || 0}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        {canManage && booking.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleUpdateStatus(booking.id, 'confirmed')}
                              className="px-3 py-1 text-green-600 border border-green-200 rounded-lg hover:bg-green-50 text-sm"
                            >
                              Confirm
                            </button>
                          </>
                        )}
                        {booking.status !== 'cancelled' && booking.status !== 'completed' && (
                          <button
                            onClick={() => handleCancel(booking.id)}
                            className="px-3 py-1 text-red-600 border border-red-200 rounded-lg hover:bg-red-50 text-sm"
                          >
                            Cancel
                          </button>
                        )}
                        {canManage && booking.status === 'confirmed' && (
                          <button
                            onClick={() => handleUpdateStatus(booking.id, 'completed')}
                            className="px-3 py-1 text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 text-sm"
                          >
                            Complete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Booking Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">New Booking</h2>
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>
            )}
            {rooms.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-gray-500">No available rooms at the moment</p>
                <button
                  onClick={() => setShowModal(false)}
                  className="mt-4 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleCreateBooking} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Select Room</label>
                  <select
                    value={formData.room_id}
                    onChange={(e) => setFormData({ ...formData, room_id: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="">Choose a room</option>
                    {rooms.map((room) => (
                      <option key={room.id} value={room.id}>
                        Room {room.room_number}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Check-in Date</label>
                  <input
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    required
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Check-out Date</label>
                  <input
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    required
                    min={formData.start_date || new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                  >
                    Book Now
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
