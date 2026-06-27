
import { useState } from 'react';
import { User, Mail, Shield, Camera, Key, LogOut, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';
import api from '../../api/axios';

export default function Profile() {
    const { user, updateUser, logout } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [isProfilePicRemoved, setIsProfilePicRemoved] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const handleProfilePicChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
            setIsProfilePicRemoved(false);
        }
    };

    const removeProfilePic = () => {
        setSelectedFile(null);
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setPreviewUrl('');
        setIsProfilePicRemoved(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setName(user?.name || '');
        setEmail(user?.email || '');
        setSelectedFile(null);
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setPreviewUrl('');
        setIsProfilePicRemoved(false);
    };

    const handleProfileSave = async () => {
        setIsUploading(true);
        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('email', email);
            if (selectedFile) {
                formData.append('profilePic', selectedFile);
            } else if (isProfilePicRemoved) {
                formData.append('profilePic', '');
            }
            const { data } = await api.put('/auth/me', formData);
            updateUser(data);
            setIsEditing(false);
            setSelectedFile(null);
            if (previewUrl) URL.revokeObjectURL(previewUrl);
            setPreviewUrl('');
            setIsProfilePicRemoved(false);
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-dark">My Profile</h1>
                <Button
                    variant="ghost"
                    className="text-danger hover:bg-light-red"
                    onClick={logout}
                >
                    <LogOut size={18} className="mr-2" />
                    Sign Out
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* User Avatar Card */}
                <div className="md:col-span-1">
                    <Card className="text-center">
                        <div className="relative inline-block mb-4">
                            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary border-4 border-white shadow-lg overflow-hidden">
                                {previewUrl || (user?.profilePic && !isProfilePicRemoved) ? (
                                    <img src={previewUrl || user.profilePic} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <User size={48} />
                                )}
                            </div>
                            {isEditing && (
                                <button
                                    type="button"
                                    onClick={() => document.getElementById('profile-pic-input').click()}
                                    className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-md border border-border text-gray hover:text-primary transition-all"
                                >
                                    <Camera size={16} />
                                </button>
                            )}
                            {(previewUrl || (user?.profilePic && !isProfilePicRemoved)) && isEditing && (
                                <button
                                    type="button"
                                    onClick={removeProfilePic}
                                    className="absolute -top-1 -right-1 p-1 bg-white rounded-full shadow-md border border-border text-gray hover:text-danger transition-all"
                                >
                                    <X size={12} />
                                </button>
                            )}
                            <input
                                id="profile-pic-input"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleProfilePicChange}
                            />
                        </div>
                        <h2 className="text-xl font-bold text-dark">{user?.name}</h2>
                        <p className="text-sm text-gray mb-4">{user?.email}</p>
                        <Badge variant={user?.role === 'admin' ? 'primary' : 'neutral'}>
                            {user?.role}
                        </Badge>
                    </Card>
                </div>

                {/* Account Details */}
                <div className="md:col-span-2 space-y-6">
                    <Card title="Account Settings">
                        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input 
                                    label="Full Name" 
                                    value={name} 
                                    onChange={(e) => setName(e.target.value)} 
                                    disabled={!isEditing} 
                                />
                                <Input 
                                    label="Email Address" 
                                    value={email} 
                                    onChange={(e) => setEmail(e.target.value)} 
                                    disabled={!isEditing} 
                                />
                            </div>
                            <div className="pt-4 flex justify-end gap-3">
                                {isEditing ? (
                                    <>
                                        <Button variant="ghost" onClick={handleCancel} disabled={isUploading}>Cancel</Button>
                                        <Button onClick={handleProfileSave} isLoading={isUploading}>
                                            Save Changes
                                        </Button>
                                    </>
                                ) : (
                                    <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
                                )}
                            </div>
                        </form>
                    </Card>

                    <Card title="Security" subtitle="Manage your password and authentication">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-light rounded-xl border border-border">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white rounded-lg text-gray">
                                        <Key size={20} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-dark text-sm">Change Password</p>
                                        <p className="text-xs text-gray">Last changed 3 months ago</p>
                                    </div>
                                </div>
                                <Button variant="secondary" size="sm">Update</Button>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
