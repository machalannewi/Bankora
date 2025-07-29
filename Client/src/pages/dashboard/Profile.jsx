import React, { useState, useRef } from 'react';
import { Camera, X, Edit2, User, Phone, Mail, AtSign, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { toast } from "sonner";
import { useNavigate, Link } from 'react-router-dom';
import useUserStore from '@/stores/userStore';

const ProfileUpdate = () => {
    const {user, cancelUser, clearStorage } = useUserStore();

    const [profileImage, setProfileImage] = useState(user?.user.image || '');
    const [profileImageFile, setProfileImageFile] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    
    const [profileData, setProfileData] = useState({
      firstName: user?.user.firstName || '',
      lastName: user?.user.lastName || '',
      username: user?.user.username || '',
      mobile: user?.user.phone || '',
      email: user?.user.email || ''
    });
    
    const [passwordData, setPasswordData] = useState({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    
    const [successMessage, setSuccessMessage] = useState("");
    const [isUpdating, setIsUpdating] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
    const fileInputRef = useRef(null);

    const navigate = useNavigate();
    
    if (!user) return null;

    const handleProfileImageUpload = (event) => {
      const file = event.target.files[0];
      if (file) {
        setProfileImageFile(file);
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

    const handlePasswordChange = (field, value) => {
      setPasswordData(prev => ({
        ...prev,
        [field]: value
      }));
    };

    const handleSaveProfile = async () => {
      setSuccessMessage("");
      setIsUpdating(true);

      try {
        const formData = new FormData();
        formData.append('firstName', profileData.firstName);
        formData.append('lastName', profileData.lastName);
        formData.append('username', profileData.username);
        formData.append('phone', profileData.mobile);
        formData.append('email', profileData.email);

        if (profileImageFile) {
          formData.append('image', profileImageFile);
        }

        const res = await fetch(`https://bankora.onrender.com/api/profile/update/${user?.user.id}`, {
          method: "POST",
          body: formData
        });

        if (!res.ok) {
          const errorText = await res.text();
          console.error('Error response:', errorText);
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();

        if (data.success) {
          setIsEditing(false);
          setSuccessMessage("Profile has been updated successfully");
          
          setProfileData({
            firstName: data.user.first_name || '',
            lastName: data.user.last_name || '',
            username: data.user.username || '',
            mobile: data.user.phone || '',
            email: data.user.email || ''
          });

          if (data.user.image) {
            setProfileImage(data.user.image);
          }

          setProfileImageFile(null);
          
          setTimeout(() => setSuccessMessage(""), 3000);
        } else {
          console.error('Update failed:', data);
        }

      } catch (error) {
        console.error(error, "Error updating Profile");
        toast.error("Failed to update profile");
      } finally {
        setIsUpdating(false);
      }
    };

    const handleChangePassword = async () => {
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        toast.error("New passwords don't match");
        return;
      }

      if (passwordData.newPassword.length < 6) {
        toast.error("Password must be at least 6 characters");
        return;
      }

      setIsUpdatingPassword(true);

      try {
        const res = await fetch(`https://bankora.onrender.com/api/profile/change-password/${user?.user.id}`, {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            currentPassword: passwordData.currentPassword,
            newPassword: passwordData.newPassword
          })
        });

        const data = await res.json();

        if (data.success) {
          setIsChangingPassword(false);
          setPasswordData({
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
          });
          toast.success("Password changed successfully");
        } else {
          toast.error(data.message || "Failed to change password");
        }

      } catch (error) {
        console.error(error, "Error changing password");
        toast.error("Failed to change password");
      } finally {
        setIsUpdatingPassword(false);
      }
    };

    const getInitials = (name) => {
      if (!name) return 'W';
      return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    function handleLogOut() {
      setIsLoading(true);
      
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");
      
      toast.success("Logged out successfully!");
      
      setTimeout(() => {
        cancelUser();
        clearStorage();
        navigate("/login");
      }, 2000);
    }

  return (
    <div className="font-voyage min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link
            to="/wallet"
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-xl font-semibold text-gray-800">Profile</h1>
          <div className="w-6"></div>
        </div>

        {/* Profile Picture Card */}
        <div className="bg-white rounded-2xl p-6 mb-4 shadow-sm">
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
                    {getInitials(profileData.firstName || profileData.username)}
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
        </div>

        {/* Profile Details Card */}
        <div className="bg-white rounded-2xl p-6 mb-4 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Profile Details</h3>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center space-x-1 text-blue-500 hover:text-blue-600"
            >
              <Edit2 size={16} />
              <span className="text-sm">{isEditing ? 'Cancel' : 'Edit'}</span>
            </button>
          </div>

          <div className="space-y-4">
            {/* First Name */}
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                <User size={16} />
                <span>First Name</span>
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={profileData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your first name"
                />
              ) : (
                <div className="px-4 py-3 bg-gray-50 rounded-xl">
                  <p className="text-gray-900">{profileData.firstName || 'Not set'}</p>
                </div>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                <User size={16} />
                <span>Last Name</span>
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={profileData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your last name"
                />
              ) : (
                <div className="px-4 py-3 bg-gray-50 rounded-xl">
                  <p className="text-gray-900">{profileData.lastName || 'Not set'}</p>
                </div>
              )}
            </div>

            {/* Username */}
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                <AtSign size={16} />
                <span>Username</span>
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={profileData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your username"
                />
              ) : (
                <div className="px-4 py-3 bg-gray-50 rounded-xl">
                  <p className="text-gray-900">{profileData.username || 'Not set'}</p>
                </div>
              )}
            </div>

            {/* Mobile Number */}
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                <Phone size={16} />
                <span>Mobile Number</span>
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  value={profileData.mobile}
                  onChange={(e) => handleInputChange('mobile', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your mobile number"
                />
              ) : (
                <div className="px-4 py-3 bg-gray-50 rounded-xl">
                  <p className="text-gray-900">{profileData.mobile || 'Not set'}</p>
                </div>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                <Mail size={16} />
                <span>Email</span>
              </label>
              {isEditing ? (
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your email"
                />
              ) : (
                <div className="px-4 py-3 bg-gray-50 rounded-xl">
                  <p className="text-gray-900">{profileData.email || 'Not set'}</p>
                </div>
              )}
            </div>
          </div>

          {/* Save Button */}
          {isEditing && (
            <div className="flex space-x-3 mt-6">
              <button
                onClick={handleSaveProfile}
                disabled={isUpdating}
                className="flex-1 bg-blue-500 text-white py-3 px-4 rounded-xl hover:bg-blue-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUpdating ? "Updating..." : "Save Changes"}
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-xl hover:bg-gray-200 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* Security Card */}
        <div className="bg-white rounded-2xl p-6 mb-4 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Security</h3>
            <button
              onClick={() => setIsChangingPassword(!isChangingPassword)}
              className="flex items-center space-x-1 text-blue-500 hover:text-blue-600"
            >
              <Lock size={16} />
              <span className="text-sm">{isChangingPassword ? 'Cancel' : 'Change Password'}</span>
            </button>
          </div>

          {isChangingPassword ? (
            <div className="space-y-4">
              {/* Current Password */}
              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                  <Lock size={16} />
                  <span>Current Password</span>
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    value={passwordData.currentPassword}
                    onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                    className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                  <Lock size={16} />
                  <span>New Password</span>
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={passwordData.newPassword}
                    onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                    className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                  <Lock size={16} />
                  <span>Confirm New Password</span>
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={passwordData.confirmPassword}
                    onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                    className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={handleChangePassword}
                  disabled={isUpdatingPassword || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                  className="flex-1 bg-blue-500 text-white py-3 px-4 rounded-xl hover:bg-blue-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUpdatingPassword ? "Changing..." : "Change Password"}
                </button>
                <button
                  onClick={() => {
                    setIsChangingPassword(false);
                    setPasswordData({
                      currentPassword: '',
                      newPassword: '',
                      confirmPassword: ''
                    });
                  }}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-xl hover:bg-gray-200 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="px-4 py-3 bg-gray-50 rounded-xl">
              <p className="text-gray-600">••••••••</p>
            </div>
          )}
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl mb-4">
            {successMessage}
          </div>
        )}

        {/* Logout Button */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <button
            onClick={handleLogOut}
            disabled={isLoading}
            className="w-full px-4 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {isLoading ? "Logging Out..." : "Log Out"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileUpdate;