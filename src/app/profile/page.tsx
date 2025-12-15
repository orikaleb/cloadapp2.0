'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import Navigation from '@/components/Navigation';
import { useRouter } from 'next/navigation';
import Toast from '@/components/Toast';

type UserProfile = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  createdAt: string;
};

export default function ProfilePage() {
  const { isAuthenticated, user, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
  });
  const [orders, setOrders] = useState<any[]>([]);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info'; isVisible: boolean }>({
    message: '',
    type: 'info',
    isVisible: false,
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login?redirect=/profile');
      return;
    }
    fetchProfile();
    fetchOrders();
  }, [isAuthenticated, router]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const authData = localStorage.getItem('userAuth');
      if (!authData) {
        router.push('/auth/login');
        return;
      }

      const userData = JSON.parse(authData);
      const userId = userData.id;
      
      if (!userId) {
        setToast({ message: 'User ID not found', type: 'error', isVisible: true });
        return;
      }

      // Fetch from API to get latest data from database
      const response = await fetch(`/api/customers/${userId}`);
      
      if (!response.ok) {
        // Fallback to localStorage data if API fails
        if (user) {
          const nameParts = user.name?.split(' ') || ['', ''];
          setProfile({
            id: user.id || userData.id || '',
            name: user.name || '',
            email: user.email || '',
            phone: user.phone || null,
            address: user.address || null,
            createdAt: userData.createdAt || new Date().toISOString(),
          });
          setFormData({
            firstName: nameParts[0] || '',
            lastName: nameParts.slice(1).join(' ') || '',
            email: user.email || '',
            phone: user.phone || '',
            address: user.address || '',
          });
        }
        return;
      }

      const customerData = await response.json();
      const nameParts = customerData.name?.split(' ') || ['', ''];
      
      setProfile({
        id: customerData.id,
        name: customerData.name,
        email: customerData.email,
        phone: customerData.phone,
        address: customerData.address,
        createdAt: customerData.createdAt,
      });
      
      setFormData({
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        email: customerData.email || '',
        phone: customerData.phone || '',
        address: customerData.address || '',
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      setToast({ message: 'Failed to load profile', type: 'error', isVisible: true });
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const authData = localStorage.getItem('userAuth');
      if (!authData) return;

      const userData = JSON.parse(authData);
      const response = await fetch(`/api/orders/my-orders?customerId=${userData.id}`);
      
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      const authData = localStorage.getItem('userAuth');
      if (!authData) {
        router.push('/auth/login');
        return;
      }

      const userData = JSON.parse(authData);
      const response = await fetch(`/api/customers/${userData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: `${formData.firstName} ${formData.lastName}`,
          phone: formData.phone || null,
          address: formData.address || null,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const updated = await response.json();
      
      // Update localStorage with new data
      const updatedAuth = {
        ...userData,
        name: updated.name,
        phone: updated.phone,
        address: updated.address,
      };
      localStorage.setItem('userAuth', JSON.stringify(updatedAuth));

      // Update profile state
      setProfile({
        ...profile!,
        name: updated.name,
        phone: updated.phone,
        address: updated.address,
      });

      // Update form data to reflect saved changes
      const nameParts = updated.name?.split(' ') || ['', ''];
      setFormData(prev => ({
        ...prev,
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        phone: updated.phone || '',
        address: updated.address || '',
      }));

      setToast({ message: 'Profile updated successfully!', type: 'success', isVisible: true });
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
      setToast({ message: 'Failed to update profile', type: 'error', isVisible: true });
    }
  };

  const tabs = [
    { id: 'profile', name: 'Profile', icon: '👤' },
    { id: 'orders', name: 'Orders', icon: '📦' },
    { id: 'addresses', name: 'Addresses', icon: '📍' },
  ];

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  if (loading || !profile) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <div className="text-gray-600">Loading profile...</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const nameParts = profile.name.split(' ');
  const displayFirstName = formData.firstName || nameParts[0] || '';
  const displayLastName = formData.lastName || nameParts.slice(1).join(' ') || '';

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={() => setToast({ ...toast, isVisible: false })}
      />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Account</h1>
          <p className="text-gray-600 mt-2">Manage your account settings and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-2xl mx-auto mb-3 text-white font-bold">
                  {displayFirstName.charAt(0).toUpperCase()}
                </div>
                <h3 className="font-semibold text-gray-900">{profile.name}</h3>
                <p className="text-sm text-gray-600">{profile.email}</p>
              </div>

              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <span className="mr-2">{tab.icon}</span>
                    {tab.name}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm p-6">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
                    <button
                      onClick={() => setIsEditing(!isEditing)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                    >
                      {isEditing ? 'Cancel' : 'Edit Profile'}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 text-gray-900"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 text-gray-900"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        disabled
                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600 cursor-not-allowed"
                      />
                      <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        placeholder="Enter your phone number"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 text-gray-900"
                      />
                    </div>
                  </div>

                  {isEditing && (
                    <div className="mt-6 flex justify-end space-x-3">
                      <button
                        onClick={() => {
                          setIsEditing(false);
                          fetchProfile(); // Reset form data
                        }}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                      >
                        Save Changes
                      </button>
                    </div>
                  )}

                  {/* Account Stats */}
                  <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-blue-600">{orders.length}</div>
                      <div className="text-sm text-gray-600">Total Orders</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-green-600">
                        ₵{orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0).toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-600">Total Spent</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {Math.floor((Date.now() - new Date(profile.createdAt).getTime()) / (1000 * 60 * 60 * 24))}
                      </div>
                      <div className="text-sm text-gray-600">Days as Member</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Orders Tab */}
              {activeTab === 'orders' && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Order History</h2>
                  {orders.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4">📦</div>
                      <p className="text-gray-600">No orders yet</p>
                      <a href="/products" className="text-blue-600 hover:text-blue-700 mt-4 inline-block">
                        Start Shopping
                      </a>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold text-gray-900">Order #{order.id.slice(-8).toUpperCase()}</h3>
                              <p className="text-sm text-gray-600">Placed on {new Date(order.orderDate).toLocaleDateString()}</p>
                              <p className="text-sm text-gray-600">{order.orderItems?.length || 0} item(s)</p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-gray-900">₵{order.totalAmount?.toFixed(2) || '0.00'}</p>
                              <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                                order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                                order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                                order.status === 'Confirmed' ? 'bg-purple-100 text-purple-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                {order.status || 'Pending'}
                              </span>
                            </div>
                          </div>
                          <div className="mt-3 flex space-x-3">
                            <a href={`/orders`} className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                              View Details
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Addresses Tab */}
              {activeTab === 'addresses' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Addresses</h2>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                    >
                      {profile.address ? 'Edit Address' : 'Add Address'}
                    </button>
                  </div>

                  {profile.address ? (
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="font-semibold text-gray-900">Default Address</h3>
                        <button
                          onClick={() => setIsEditing(true)}
                          className="text-blue-600 hover:text-blue-700 text-sm"
                        >
                          Edit
                        </button>
                      </div>
                      <div className="text-gray-600">
                        <p>{profile.address}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="border border-gray-200 rounded-lg p-8 text-center">
                      <p className="text-gray-600 mb-4">No address saved</p>
                      <button
                        onClick={() => setIsEditing(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                      >
                        Add Address
                      </button>
                    </div>
                  )}

                  {isEditing && (
                    <div className="mt-6 border-t pt-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Address
                        </label>
                        <input
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          placeholder="Enter your full address"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                        />
                      </div>
                      <div className="mt-4 flex justify-end space-x-3">
                        <button
                          onClick={() => setIsEditing(false)}
                          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSave}
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                          Save Address
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
