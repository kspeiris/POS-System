
import { useState } from 'react';
import { User, Camera, Key, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';

export default function Profile() {
    const { user, logout, updateProfile } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [isPasswordOpen, setIsPasswordOpen] = useState(false);
    const [feedback, setFeedback] = useState('');
    const [passwordState, setPasswordState] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [formState, setFormState] = useState({
        name: user?.name || '',
        email: user?.email || '',
    });

    const handleSaveProfile = () => {
        setFeedback('');
        updateProfile({
            name: formState.name.trim(),
            email: formState.email.trim().toLowerCase(),
        });
        setIsEditing(false);
        setFeedback('Profile updated.');
    };

    const handlePasswordSave = () => {
        if (!passwordState.newPassword || passwordState.newPassword.length < 6) {
            setFeedback('New password must be at least 6 characters.');
            return;
        }

        if (passwordState.newPassword !== passwordState.confirmPassword) {
            setFeedback('Passwords do not match.');
            return;
        }

        setPasswordState({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setIsPasswordOpen(false);
        setFeedback('Password changes are not connected to the backend yet.');
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {feedback && (
                <div className="rounded-2xl border border-border bg-white/80 px-4 py-3 text-sm text-dark-2 shadow-card">
                    {feedback}
                </div>
            )}
            <div className="flex items-center justify-between gap-4">
                <div>
                    <p className="text-sm font-semibold text-primary uppercase tracking-[0.18em]">Account</p>
                    <h1 className="text-3xl font-bold text-dark mt-1">My Profile</h1>
                </div>
                <Button variant="ghost" className="text-danger hover:bg-light-red" onClick={logout}>
                    <LogOut size={18} className="mr-2" />
                    Sign Out
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                    <Card className="text-center">
                        <div className="relative inline-block mb-4">
                            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary border-4 border-white shadow-card overflow-hidden">
                                <User size={48} />
                            </div>
                            <button type="button" className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-card border border-border text-gray hover:text-primary transition-all">
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

                <div className="md:col-span-2 space-y-6">
                    <Card title="Account Settings">
                        <form className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input
                                    label="Full Name"
                                    value={formState.name}
                                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                                    disabled={!isEditing}
                                />
                                <Input
                                    label="Email Address"
                                    value={formState.email}
                                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                                    disabled={!isEditing}
                                />
                            </div>
                            <div className="pt-4 flex justify-end gap-3">
                                {isEditing ? (
                                    <>
                                    <Button variant="ghost" type="button" onClick={() => setIsEditing(false)}>Cancel</Button>
                                    <Button type="button" onClick={handleSaveProfile}>Save Changes</Button>
                                </>
                            ) : (
                                <Button type="button" onClick={() => setIsEditing(true)}>Edit Profile</Button>
                                )}
                            </div>
                        </form>
                    </Card>

                    <Card title="Security" subtitle="Manage your password and authentication">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-light rounded-2xl border border-border">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white rounded-xl text-gray">
                                        <Key size={20} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-dark text-sm">Change Password</p>
                                        <p className="text-xs text-gray">Last changed 3 months ago</p>
                                    </div>
                                </div>
                                <Button variant="secondary" size="sm" type="button" onClick={() => setIsPasswordOpen(true)}>Update</Button>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>

            <Modal isOpen={isPasswordOpen} onClose={() => setIsPasswordOpen(false)} title="Change Password">
                <form className="space-y-4">
                    <Input
                        label="Current Password"
                        type="password"
                        value={passwordState.currentPassword}
                        onChange={(e) => setPasswordState((prev) => ({ ...prev, currentPassword: e.target.value }))}
                    />
                    <Input
                        label="New Password"
                        type="password"
                        value={passwordState.newPassword}
                        onChange={(e) => setPasswordState((prev) => ({ ...prev, newPassword: e.target.value }))}
                    />
                    <Input
                        label="Confirm New Password"
                        type="password"
                        value={passwordState.confirmPassword}
                        onChange={(e) => setPasswordState((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                    />
                    <div className="pt-4 flex gap-3">
                        <Button variant="ghost" type="button" className="flex-1" onClick={() => setIsPasswordOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="button" className="flex-1" onClick={handlePasswordSave}>
                            Save Password
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
