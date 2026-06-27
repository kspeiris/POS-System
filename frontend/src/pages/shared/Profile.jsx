
import { useState } from 'react';
import { User, Mail, Shield, Camera, Key, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';

export default function Profile() {
    const { user, logout } = useAuth();
    const [isEditing, setIsEditing] = useState(false);

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
                                <User size={48} />
                            </div>
                            <button
                    className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-md border border-border text-gray hover:text-primary transition-all"
                >
                                <Camera size={16} />
                            </button>
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
                        <form className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input label="Full Name" defaultValue={user?.name} disabled={!isEditing} />
                                <Input label="Email Address" defaultValue={user?.email} disabled={!isEditing} />
                            </div>
                            <div className="pt-4 flex justify-end gap-3">
                                {isEditing ? (
                                    <>
                                        <Button variant="ghost" onClick={() => setIsEditing(false)}>Cancel</Button>
                                        <Button onClick={() => setIsEditing(false)}>Save Changes</Button>
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
