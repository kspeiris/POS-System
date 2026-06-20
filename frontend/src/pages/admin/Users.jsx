
import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { Plus, Edit2, Trash2, Mail, Shield, User } from 'lucide-react';
import Card from '../../components/ui/Card';
import Table, { TableRow, TableCell } from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import Loader from '../../components/ui/Loader';

import { userApi } from '../../api/userApi';
const ROLES = ['admin', 'cashier'];

export default function Users() {
    const [isLoading, setIsLoading] = useState(true);
    const [users, setUsers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [formData, setFormData] = useState({ name: '', email: '', role: 'cashier', password: '' });
    const [feedback, setFeedback] = useState('');

    const fetchUsers = async () => {
        try {
            setIsLoading(true);
            const { data } = await userApi.getAll();
            setUsers(data);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const openModal = (user = null) => {
        setCurrentUser(user);
        setFormData(user ? { ...user, password: '' } : { name: '', email: '', role: 'cashier', password: '' });
        setIsModalOpen(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            if (currentUser) {
                await userApi.update(currentUser._id, formData);
            } else {
                await userApi.create(formData);
            }
            fetchUsers();
            setIsModalOpen(false);
        } catch (error) {
            setFeedback(error.response?.data?.message || 'Failed to save user');
        }
    };

    if (isLoading) return <Loader fullPage />;

    return (
        <div className="space-y-6">
            {feedback && (
                <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {feedback}
                </div>
            )}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <p className="text-sm font-semibold text-primary uppercase tracking-[0.18em]">Staff</p>
                    <h1 className="text-3xl font-bold text-dark mt-1">User Management</h1>
                    <p className="text-slate-500 text-sm">Manage staff access and permissions.</p>
                </div>
                <Button className="flex items-center gap-2" onClick={() => openModal()}>
                    <Plus size={18} />
                    Add Staff Member
                </Button>
            </div>

            <Card noPadding>
                <Table headers={['Name', 'Email', 'Role', 'Status', 'Joined', 'Actions']}>
                    {users.map((user) => (
                        <TableRow key={user._id}>
                            <TableCell>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                        <User size={18} />
                                    </div>
                                    <span className="font-medium text-dark">{user.name}</span>
                                </div>
                            </TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                                <Badge variant={user.role === 'admin' ? 'primary' : 'neutral'}>
                                    {user.role}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <Badge variant={user.isActive ? 'success' : 'danger'}>
                                    {user.isActive ? 'Active' : 'Inactive'}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-gray-500 text-xs">{dayjs(user.createdAt).format('MMM D, YYYY')}</TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <button
                                        className="p-2 text-gray-400 hover:text-primary transition-colors"
                                        onClick={() => openModal(user)}
                                    >
                                        <Edit2 size={18} />
                                    </button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </Table>
            </Card>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={currentUser ? 'Edit Staff Member' : 'Add Staff Member'}
            >
                <form onSubmit={handleSave} className="space-y-4">
                    <Input
                        label="Full Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                    />
                    <Input
                        label="Email Address"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                    />
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-gray-700">Role</label>
                        <select
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            className="w-full rounded-lg border border-gray-200 bg-white py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        >
                            {ROLES.map(role => (
                                <option key={role} value={role}>{role}</option>
                            ))}
                        </select>
                    </div>
                    {!currentUser && (
                        <Input
                            label="Password"
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                        />
                    )}
                    <div className="pt-4 flex gap-3">
                        <Button variant="ghost" className="flex-1" type="button" onClick={() => setIsModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button className="flex-1" type="submit">
                            Save Member
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
