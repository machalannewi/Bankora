import React, { useState, useRef } from 'react';
import { UserCog, Bell, Camera, X, Edit2, User, Phone, Mail, AtSign } from 'lucide-react';
import { BellIcon } from '@heroicons/react/24/solid';
import useUIStore from '@/stores/uiStore';

const ProfileHeader = ({ user, time, handleLogOut, isLoading }) => {
  const [profileImage, setProfileImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: user?.user.firstName + " " + user?.user.lastName || '',
    username: user?.user.username || '',
    mobile: user?.user.phone || '',
    email: user?.user.email || ''
  });
  const fileInputRef = useRef(null);



  const { isEditProfileModalOpen, setEditProfileModalOpen } = useUIStore();
  
   if (!user) return null;
  

  const handleProfileImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveProfile = () => {
    // Here you would typically make an API call to update the profile
    console.log('Saving profile data:', profileData);
    setIsEditing(false);
    // You can add your API call here
  };

  const getInitials = (name) => {
    if (!name) return 'W';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <>
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <button className="w-10 h-10 bg-black rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors cursor-pointer">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-white font-bold text-lg">
                    {getInitials(profileData.fullName || profileData.username)}
                  </span>
                )}
              </button>
              <div>
                <p className="text-sm text-gray-500">
                  {time < 12
                    ? "Good Morning"
                    : time >= 12 && time < 18
                    ? "Good Afternoon"
                    : "Good Evening"},
                </p>
                <p className="font-semibold">{profileData.username}</p>
              </div>
            </div>
           
            <div className="flex items-center space-x-4">      
              <button
               onClick={() => setEditProfileModalOpen(true)}
               className="w-10 h-10 text-black bg-blue-100 rounded-full flex items-center justify-center">
                <UserCog />
              </button>
              <div className="w-10 h-10 text-black bg-blue-100 rounded-full flex items-center justify-center">
                <BellIcon className="h-6"/>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Modal */}
      {isEditProfileModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold">Profile</h2>
              <button
                onClick={() => setEditProfileModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Profile Picture Section */}
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-black flex items-center justify-center overflow-hidden">
                    {profileImage ? (
                      <img
                        src={profileImage}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-white font-bold text-2xl">
                        {getInitials(profileData.fullName || profileData.username)}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"
                  >
                    <Camera size={14} />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleProfileImageUpload}
                    className="hidden"
                  />
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="text-blue-500 hover:text-blue-600 text-sm font-medium"
                >
                  Change Profile Picture
                </button>
              </div>

              {/* Profile Details */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Profile Details</h3>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="flex items-center space-x-1 text-blue-500 hover:text-blue-600"
                  >
                    <Edit2 size={16} />
                    <span className="text-sm">{isEditing ? 'Cancel' : 'Edit'}</span>
                  </button>
                </div>

                {/* Full Name */}
                <div className="space-y-2">
                  <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                    <User size={16} />
                    <span>Full Name</span>
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your full name"
                    />
                  ) : (
                    <p className="text-gray-900 py-2">{profileData.fullName || 'Not set'}</p>
                  )}
                </div>

                {/* Username */}
                <div className="space-y-2">
                  <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                    <AtSign size={16} />
                    <span>Username</span>
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.username}
                      onChange={(e) => handleInputChange('username', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your username"
                    />
                  ) : (
                    <p className="text-gray-900 py-2">{profileData.username || 'Not set'}</p>
                  )}
                </div>

                {/* Mobile Number */}
                <div className="space-y-2">
                  <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                    <Phone size={16} />
                    <span>Mobile Number</span>
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={profileData.mobile}
                      onChange={(e) => handleInputChange('mobile', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your mobile number"
                    />
                  ) : (
                    <p className="text-gray-900 py-2">{profileData.mobile || 'Not set'}</p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                    <Mail size={16} />
                    <span>Email</span>
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your email"
                    />
                  ) : (
                    <p className="text-gray-900 py-2">{profileData.email || 'Not set'}</p>
                  )}
                </div>
              </div>

              {/* Save Button */}
              {isEditing && (
                <div className="flex space-x-3">
                  <button
                    onClick={handleSaveProfile}
                    className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors font-medium"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                </div>
              )}

              {/* Logout Button */}
              <div className="border-t pt-4">
                <button
                  onClick={handleLogOut}
                  disabled={isLoading}
                  className="w-full px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  {isLoading ? "Logging Out..." : "Log Out"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfileHeader;