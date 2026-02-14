'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { usersAPI } from '@/lib/api';

interface User {
  id: number;
  email: string;
  full_name: string;
  role: 'admin' | 'staff' | 'guest';
  created_at: string;
}

export default function UsersPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await usersAPI.getAll();
      setUsers(data);
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleChange = async (userId: number, newRole: string) => {
    try {
      await usersAPI.updateRole(userId, newRole);
      loadUsers();
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Failed to update role');
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-700';
      case 'staff':
        return 'bg-blue-100 text-blue-700';
      case 'guest':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  if (user?.role !== 'admin') {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🔒</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
        <p className="text-gray-500">Only administrators can access this page</p>
      </div>
    );
  }

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
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Users</h1>
        <p className="text-gray-500 mt-1">Manage user accounts and roles</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {['admin', 'staff', 'guest'].map((role) => (
          <div key={role} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm capitalize">{role}s</p>
                <p className="text-2xl font-bold text-gray-900">
                  {users.filter((u) => u.role === role).length}
                </p>
              </div>
              <span className={`w-10 h-10 rounded-lg flex items-center justify-center ${getRoleColor(role)}`}>
                {role === 'admin' ? '👑' : role === 'staff' ? '👔' : '👤'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr className="text-left text-gray-600 text-sm">
                <th className="px-6 py-4 font-semibold">User</th>
                <th className="px-6 py-4 font-semibold">Email</th>
                <th className="px-6 py-4 font-semibold">Role</th>
                <th className="px-6 py-4 font-semibold">Joined</th>
                <th className="px-6 py-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((u) => (
                <tr key={u.id} className="text-gray-700 hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-primary-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {u.full_name?.charAt(0) || 'U'}
                      </div>
                      <span className="font-medium">{u.full_name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{u.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getRoleColor(u.role)}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {new Date(u.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    {u.id !== user?.id && (
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                        className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="guest">Guest</option>
                        <option value="staff">Staff</option>
                        <option value="admin">Admin</option>
                      </select>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
