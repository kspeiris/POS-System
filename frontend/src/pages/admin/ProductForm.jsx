
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Upload, X } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Loader from '../../components/ui/Loader';
import { formatLKR } from '../../utils/money';

import { productApi } from '../../api/productApi';
import { categoryApi } from '../../api/categoryApi';

export default function ProductForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = !!id;

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [categories, setCategories] = useState([]);
    const [feedback, setFeedback] = useState('');
    const [imagePreview, setImagePreview] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});

    const [formData, setFormData] = useState({
        name: '',
        price: '',
        category: '',
        stockQty: '',
        description: '',
        imageUrl: '',
        isAvailable: true,
        barcode: '',
        sku: '',
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data: catData } = await categoryApi.getAll();
                setCategories(catData);

                if (isEdit) {
                    const { data: prodData } = await productApi.getById(id);
                    setFormData({
                        name: prodData.name,
                        price: prodData.price.toString(),
                        category: prodData.category,
                        stockQty: prodData.stockQty.toString(),
                        description: prodData.description || '',
                        imageUrl: prodData.imageUrl || '',
                        isAvailable: prodData.isAvailable,
                        barcode: prodData.barcode || '',
                        sku: prodData.sku || '',
                    });
                    setImagePreview(prodData.imageUrl || '');
                } else if (catData.length > 0) {
                    setFormData(prev => ({ ...prev, category: catData[0].name }));
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [isEdit, id]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleImageFile = (file) => {
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            const result = String(reader.result || '');
            setImagePreview(result);
            setFormData((prev) => ({ ...prev, imageUrl: result }));
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const nextErrors = {};

        if (!formData.name.trim()) nextErrors.name = 'Product name is required';
        if (!formData.category.trim()) nextErrors.category = 'Category is required';
        if (!formData.price || Number.isNaN(Number(formData.price)) || Number(formData.price) < 0) {
            nextErrors.price = 'Enter a valid price';
        }
        if (formData.stockQty === '' || Number.isNaN(Number(formData.stockQty)) || Number(formData.stockQty) < 0 || !Number.isInteger(Number(formData.stockQty))) {
            nextErrors.stockQty = 'Stock must be a whole number';
        }

        setFieldErrors(nextErrors);
        if (Object.keys(nextErrors).length > 0) return;

        setIsSaving(true);
        try {
            const payload = {
                ...formData,
                price: parseFloat(formData.price),
                stockQty: parseInt(formData.stockQty),
            };

            if (isEdit) {
                await productApi.update(id, payload);
            } else {
                await productApi.create(payload);
            }
            navigate('/admin/products');
        } catch (error) {
            setFeedback(error.response?.data?.message || 'Failed to save product');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) return <Loader fullPage />;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {feedback && (
                <div className="rounded-2xl border border-light-red bg-light-red px-4 py-3 text-sm text-danger">
                    {feedback}
                </div>
            )}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate('/admin/products')}
                    className="p-2 rounded-full hover:bg-white/80 transition-colors shadow-sm"
                >
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <p className="text-sm font-semibold text-primary uppercase tracking-[0.18em]">Catalog</p>
                    <h1 className="text-3xl font-bold text-dark">
                    {isEdit ? 'Edit Product' : 'Add New Product'}
                    </h1>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Image Upload Area */}
                <div className="md:col-span-1 space-y-6">
                    <Card title="Product Image" subtitle="Use a clean image that is easy to scan">
                        <div className="flex flex-col items-center gap-4">
                            <label className="w-full aspect-square rounded-3xl bg-light border-2 border-dashed border-border flex flex-col items-center justify-center text-gray group hover:border-primary hover:bg-primary/5 transition-all cursor-pointer overflow-hidden relative">
                                {imagePreview ? (
                                    <img src={imagePreview} alt="Product preview" className="absolute inset-0 h-full w-full object-cover" />
                                ) : (
                                    <>
                                        <Upload size={32} className="mb-2 group-hover:text-primary transition-colors" />
                                        <span className="text-xs font-medium group-hover:text-primary transition-colors">Click to Upload</span>
                                        <span className="text-[10px]">PNG, JPG up to 5MB</span>
                                    </>
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => handleImageFile(e.target.files?.[0])}
                                />
                            </label>
                            <p className="text-xs text-center text-gray">
                                Recommend style: Clear image with simple background.
                            </p>
                        </div>
                    </Card>

                    <Card title="Status" subtitle="Control whether the item is shown in the menu">
                        <div className="space-y-4">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <div className="relative inline-flex items-center">
                                    <input
                                        type="checkbox"
                                        name="isAvailable"
                                        className="sr-only peer"
                                        checked={formData.isAvailable}
                                        onChange={handleChange}
                                    />
                                    <div className="w-11 h-6 bg-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                </div>
                                <span className="text-sm font-medium text-dark-2">Display in Menu</span>
                            </label>
                        </div>
                    </Card>
                </div>

                {/* Info Area */}
                <div className="md:col-span-2 space-y-6">
                    <Card title="General Information" subtitle="Core product details and pricing">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <Input
                                    label="Product Name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="e.g. Classic Cheeseburger"
                                    required
                                />
                                {fieldErrors.name && <p className="mt-1 text-sm text-danger">{fieldErrors.name}</p>}
                            </div>
                            <div className="md:col-span-2">
                                <Input
                                    label="Image URL"
                                    name="imageUrl"
                                    value={formData.imageUrl}
                                    onChange={handleChange}
                                    placeholder="https://images.unsplash.com/..."
                                />
                            </div>
                            <Input
                                label="Barcode"
                                name="barcode"
                                value={formData.barcode}
                                onChange={handleChange}
                                placeholder="Scan or enter barcode"
                            />
                            <Input
                                label="SKU"
                                name="sku"
                                value={formData.sku}
                                onChange={handleChange}
                                placeholder="e.g. BURG-001"
                            />
                            <Input
                                label="Price ($)"
                                name="price"
                                type="number"
                                step="0.01"
                                    value={formData.price}
                                    onChange={handleChange}
                                    placeholder="0.00"
                                    required
                                />
                                {fieldErrors.price && <p className="mt-1 text-sm text-danger">{fieldErrors.price}</p>}
                            <div className="md:col-span-2 rounded-2xl bg-light p-4 text-sm text-dark-2">
                                Price preview: <span className="font-semibold text-dark">{formatLKR(formData.price || 0)}</span>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-medium text-dark-2">Category</label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border-border bg-white py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                    required
                                >
                                    <option value="">Select Category</option>
                                    {categories.map(cat => (
                                        <option key={cat._id} value={cat.name}>{cat.name}</option>
                                    ))}
                                </select>
                                {fieldErrors.category && <p className="mt-1 text-sm text-danger">{fieldErrors.category}</p>}
                            </div>
                            <Input
                                label="Initial Stock"
                                name="stockQty"
                                type="number"
                                value={formData.stockQty}
                                onChange={handleChange}
                                placeholder="0"
                                required
                            />
                            {fieldErrors.stockQty && <p className="mt-1 text-sm text-danger">{fieldErrors.stockQty}</p>}
                            <div className="md:col-span-2 flex flex-col gap-1.5">
                                <label className="text-sm font-medium text-dark-2">Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows={4}
                                    className="w-full rounded-lg border-border bg-white py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                    placeholder="Brief description of the product..."
                                />
                            </div>
                        </div>
                    </Card>

                    <div className="flex justify-end gap-3">
                        <Button
                            variant="secondary"
                            type="button"
                            onClick={() => navigate('/admin/products')}
                            disabled={isSaving}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="px-8"
                            isLoading={isSaving}
                        >
                            <Save size={18} className="mr-2" />
                            {isEdit ? 'Update Product' : 'Save Product'}
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
}
