
import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Folder } from 'lucide-react';
import Card from '../../components/ui/Card';
import Table, { TableRow, TableCell } from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import Loader from '../../components/ui/Loader';

import { categoryApi } from '../../api/categoryApi';

export default function Categories() {
    const [isLoading, setIsLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentCategory, setCurrentCategory] = useState(null);
    const [formData, setFormData] = useState({ name: '', description: '' });

    const fetchCategories = async () => {
        try {
            setIsLoading(true);
            const { data } = await categoryApi.getAll();
            setCategories(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const openModal = (cat = null) => {
        setCurrentCategory(cat);
        setFormData(cat ? { name: cat.name, description: cat.description || '' } : { name: '', description: '' });
        setIsModalOpen(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            if (currentCategory) {
                // Update not implemented in categoryApi yet, but I can add it if needed
                alert('Update category not yet implemented');
            } else {
                await categoryApi.create(formData);
                fetchCategories();
            }
            setIsModalOpen(false);
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to save category');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this category?')) {
            try {
                await categoryApi.delete(id);
                fetchCategories();
            } catch (error) {
                alert('Failed to delete category');
            }
        }
    };

    if (isLoading) return <Loader fullPage />;

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <p className="text-sm font-semibold text-primary uppercase tracking-[0.18em]">Catalog</p>
                    <h1 className="text-3xl font-bold text-dark mt-1">Categories</h1>
                    <p className="text-slate-500 text-sm">Organize your menu into groups.</p>
                </div>
                <Button className="flex items-center gap-2" onClick={() => openModal()}>
                    <Plus size={18} />
                    Add Category
                </Button>
            </div>

            <Card noPadding>
                <Table headers={['Category Name', 'Description', 'Actions']}>
                    {categories.length === 0 ? (
                        <tr>
                            <td className="px-6 py-10 text-slate-500" colSpan={3}>
                                No categories yet. Add one to start organizing products.
                            </td>
                        </tr>
                    ) : categories.map((cat) => (
                        <TableRow key={cat._id}>
                            <TableCell className="font-bold text-dark">{cat.name}</TableCell>
                            <TableCell className="text-gray-500 max-w-xs truncate">{cat.description || '-'}</TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <button
                                        className="p-2 text-gray-400 hover:text-primary transition-colors"
                                        onClick={() => openModal(cat)}
                                    >
                                        <Edit2 size={18} />
                                    </button>
                                    <button
                                        className="p-2 text-gray-400 hover:text-danger transition-colors"
                                        onClick={() => handleDelete(cat._id)}
                                    >
                                        <Trash2 size={18} />
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
                title={currentCategory ? 'Edit Category' : 'Add Category'}
            >
                <form onSubmit={handleSave} className="space-y-4">
                    <Input
                        label="Category Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                    />
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-gray-700">Description</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={3}
                            className="w-full rounded-lg border border-gray-200 bg-white py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                    </div>
                    <div className="pt-4 flex gap-3">
                        <Button variant="ghost" className="flex-1" type="button" onClick={() => setIsModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button className="flex-1" type="submit">
                            {currentCategory ? 'Update' : 'Create'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
