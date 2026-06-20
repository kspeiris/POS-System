
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Edit2, Trash2, Filter } from 'lucide-react';
import Card from '../../components/ui/Card';
import Table, { TableRow, TableCell } from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';
import Loader from '../../components/ui/Loader';

import { productApi } from '../../api/productApi';

export default function Products() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [products, setProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchProducts = async () => {
        try {
            setIsLoading(true);
            const { data } = await productApi.getAll();
            setProducts(data);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await productApi.delete(id);
                fetchProducts();
            } catch (error) {
                alert('Failed to delete product');
            }
        }
    };

    if (isLoading) return <Loader fullPage />;

    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-dark">Products</h1>
                    <p className="text-gray-500 text-sm">Manage your restaurant menu items</p>
                </div>
                <Button
                    className="flex items-center gap-2"
                    onClick={() => navigate('/admin/products/new')}
                >
                    <Plus size={18} />
                    Add Product
                </Button>
            </div>

            <Card className="flex flex-col">
                <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full md:w-96">
                        <Input
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            icon={Search}
                        />
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Filter size={16} />
                        <span>Filter by Category:</span>
                        <select className="bg-transparent border-none focus:ring-0 font-medium text-dark">
                            <option>All Categories</option>
                            <option>Burgers</option>
                            <option>Sides</option>
                            <option>Beverages</option>
                        </select>
                    </div>
                </div>

                <Table headers={['Product', 'Category', 'Price', 'Stock', 'Status', 'Actions']}>
                    {filteredProducts.map((product) => (
                        <TableRow key={product._id}>
                            <TableCell>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center font-bold text-gray-400 overflow-hidden">
                                        {product.imageUrl ? (
                                            <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                                        ) : product.name.charAt(0)}
                                    </div>
                                    <span className="font-medium text-dark">{product.name}</span>
                                </div>
                            </TableCell>
                            <TableCell>{product.category}</TableCell>
                            <TableCell className="font-bold">${product.price.toFixed(2)}</TableCell>
                            <TableCell>{product.stockQty} units</TableCell>
                            <TableCell>
                                <Badge variant={product.stockQty > 10 ? 'success' : product.stockQty > 0 ? 'warning' : 'danger'}>
                                    {product.stockQty > 0 ? 'In Stock' : 'Out of Stock'}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => navigate(`/admin/products/${product._id}/edit`)}
                                        className="p-2 text-gray-400 hover:text-primary transition-colors"
                                    >
                                        <Edit2 size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(product._id)}
                                        className="p-2 text-gray-400 hover:text-danger transition-colors"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </Table>
            </Card>
        </div>
    );
}
