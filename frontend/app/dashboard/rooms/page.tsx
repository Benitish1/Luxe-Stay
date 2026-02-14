'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { roomsAPI, roomTypesAPI } from '@/lib/api';

interface Room {
  id: number;
  room_number: string;
  room_type_id: number;
  is_available: boolean;
  room_type?: {
    id: number;
    name: string;
    description: string;
    base_price: number;
    capacity: number;
    image_url: string;
  };
}

interface RoomType {
  id: number;
  name: string;
  description: string;
  base_price: number;
  capacity: number;
  image_url: string;
}

export default function RoomsPage() {
  const { user } = useAuth();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [formData, setFormData] = useState({
    room_number: '',
    room_type_id: '',
    is_available: true,
  });
  const [typeFormData, setTypeFormData] = useState({
    name: '',
    description: '',
    base_price: '',
    capacity: '',
    image_url: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [roomsData, typesData] = await Promise.all([
        roomsAPI.getAll().catch(() => []),
        roomTypesAPI.getAll().catch(() => []),
      ]);
      setRooms(roomsData);
      setRoomTypes(typesData);
    } catch (error) {
      console.error('Failed to load rooms:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await roomsAPI.create({
        room_number: formData.room_number,
        room_type_id: parseInt(formData.room_type_id),
        is_available: formData.is_available,
      });
      setShowModal(false);
      setFormData({ room_number: '', room_type_id: '', is_available: true });
      loadData();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to create room');
    }
  };

  const handleCreateType = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await roomTypesAPI.create({
        name: typeFormData.name,
        description: typeFormData.description,
        base_price: parseFloat(typeFormData.base_price),
        capacity: parseInt(typeFormData.capacity),
        image_url: typeFormData.image_url || 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800',
      });
      setShowTypeModal(false);
      setTypeFormData({ name: '', description: '', base_price: '', capacity: '', image_url: '' });
      loadData();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to create room type');
    }
  };

  const handleDeleteRoom = async (id: number) => {
    if (!confirm('Are you sure you want to delete this room?')) return;
    try {
      await roomsAPI.delete(id);
      loadData();
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Failed to delete room');
    }
  };

  const canManage = user?.role === 'admin' || user?.role === 'staff';

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
          <h1 className="text-2xl font-bold text-gray-900">Rooms</h1>
          <p className="text-gray-500 mt-1">Manage hotel rooms and room types</p>
        </div>
        {canManage && (
          <div className="flex space-x-3">
            <button
              onClick={() => setShowTypeModal(true)}
              className="px-4 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors"
            >
              + Add Room Type
            </button>
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
            >
              + Add Room
            </button>
          </div>
        )}
      </div>

      {/* Room Types */}
      {roomTypes.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Room Types</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {roomTypes.map((type) => (
              <div key={type.id} className="border border-gray-200 rounded-xl p-4 hover:border-primary-300 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary-400 to-primary-600 rounded-lg flex items-center justify-center text-white text-xl">
                    🛏️
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{type.name}</h3>
                    <p className="text-sm text-gray-500">${type.base_price}/night • {type.capacity} guests</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Rooms Grid */}
      {rooms.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
          <div className="text-6xl mb-4">🏨</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No rooms yet</h3>
          <p className="text-gray-500 mb-6">Start by adding room types and rooms to your hotel</p>
          {canManage && (
            <button
              onClick={() => setShowTypeModal(true)}
              className="px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
            >
              Create First Room Type
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <div
              key={room.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="h-48 bg-gradient-to-r from-slate-700 to-slate-800 flex items-center justify-center">
                <span className="text-6xl">🛏️</span>
              </div>
              <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Room {room.room_number}</h3>
                    <p className="text-sm text-gray-500">{room.room_type?.name || 'Standard'}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      room.is_available
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {room.is_available ? 'Available' : 'Occupied'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                  <span>💰 ${room.room_type?.base_price || 0}/night</span>
                  <span>👥 {room.room_type?.capacity || 2} guests</span>
                </div>
                {canManage && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleDeleteRoom(room.id)}
                      className="flex-1 px-4 py-2 text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Room Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Add New Room</h2>
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>
            )}
            <form onSubmit={handleCreateRoom} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Room Number</label>
                <input
                  type="text"
                  value={formData.room_number}
                  onChange={(e) => setFormData({ ...formData, room_number: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="e.g., 101"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Room Type</label>
                <select
                  value={formData.room_type_id}
                  onChange={(e) => setFormData({ ...formData, room_type_id: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">Select a type</option>
                  {roomTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name} - ${type.base_price}/night
                    </option>
                  ))}
                </select>
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
                  Create Room
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Room Type Modal */}
      {showTypeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Add Room Type</h2>
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>
            )}
            <form onSubmit={handleCreateType} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type Name</label>
                <input
                  type="text"
                  value={typeFormData.name}
                  onChange={(e) => setTypeFormData({ ...typeFormData, name: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="e.g., Deluxe Suite"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={typeFormData.description}
                  onChange={(e) => setTypeFormData({ ...typeFormData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Describe the room type..."
                  rows={2}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price/Night ($)</label>
                  <input
                    type="number"
                    value={typeFormData.base_price}
                    onChange={(e) => setTypeFormData({ ...typeFormData, base_price: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="150"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
                  <input
                    type="number"
                    value={typeFormData.capacity}
                    onChange={(e) => setTypeFormData({ ...typeFormData, capacity: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="2"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowTypeModal(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  Create Type
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
