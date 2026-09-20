import React, { useState } from 'react';
import { UserCog, Bell, Camera, X, Edit2, User, Phone, Mail, AtSign } from 'lucide-react';
import { BellIcon } from '@heroicons/react/24/solid';
import { useNavigate, Link } from 'react-router-dom';

const ProfileHeader = ({ user, time, notificationCount }) => {
  const [profileImage, setProfileImage] = useState(user?.user.image || '');
  const [profileData, setProfileData] = useState({
    firstName: user?.user.firstName || '',
    username: user?.user.username || '',
  });
  const [bellNotifications, setBellNotifications] = useState([]);
  const navigate = useNavigate();
  
  if (!user) return null;

  const getInitials = (name) => {
    if (!name) return 'W';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const handleBellClick = () => {
        // Mark all notifications as read
        setBellNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
        navigate("/notification")
  };
  // // Get the current profile image URL
  // const currentImageUrl = getImageUrl(profileImage);

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
                    {getInitials(profileData.firstName || profileData.username)}
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
              <Link
               to="/profile"
               className="w-10 h-10 text-black bg-blue-100 rounded-full flex items-center justify-center">
                <UserCog />
              </Link>
              <div
                onClick={handleBellClick}
                className="w-10 h-10 text-black bg-blue-100 rounded-full flex items-center justify-center relative cursor-pointer hover:bg-blue-200 transition-colors"
              >
                <BellIcon className="h-6"/>
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center min-w-[20px] px-1">
                    {notificationCount > 99 ? "99+" : notificationCount}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

    </>
  );
};

export default ProfileHeader;