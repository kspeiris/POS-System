
import { useState, useEffect } from 'react';
import ProductGrid from '../../components/pos/ProductGrid';
import CartPanel from '../../components/pos/CartPanel';
import { useCart } from '../../context/CartContext';
import { Search } from 'lucide-react';
import { productApi } from '../../api/productApi';
import { categoryApi } from '../../api/categoryApi';
import Loader from '../../components/ui/Loader';

export default function POS() {
    const { addToCart } = useCart();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState(['All']);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [productsRes, categoriesRes] = await Promise.all([
                    productApi.getAll(),
                    categoryApi.getAll()
                ]);
                setProducts(productsRes.data);
                setCategories(['All', ...categoriesRes.data.map(c => c.name)]);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const filteredProducts = products.filter(product => {
        const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    if (isLoading) return <Loader fullPage />;

    return (
        <div className="flex h-full relative">
            {/* Main Content Area */}
            <div className="flex-1 lg:pr-[25.5rem] p-4 sm:p-6 overflow-hidden flex flex-col gap-5">
                {/* Header / Filters */}
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div>
                            <p className="text-sm font-semibold text-primary uppercase tracking-[0.18em]">Checkout</p>
                            <h1 className="text-3xl font-bold text-dark mt-1">Menu</h1>
                            <p className="text-sm text-gray">Search and add products quickly.</p>
                        </div>
                        <div className="relative w-full sm:w-80">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray w-5 h-5 dark:text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 rounded-2xl border border-border shadow-sm focus:ring-2 focus:ring-primary/20 transition-all text-dark placeholder:text-gray dark:bg-[rgba(255,255,255,0.05)] dark:border-gray-700 dark:text-gray-100 dark:placeholder:text-gray-400"
                            />
                        </div>
                    </div>

                    {/* Categories */}
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        {categories.map(category => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-4 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${selectedCategory === category
                                        ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                        : 'bg-white/80 text-gray hover:bg-light border border-border'
                                        }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Product Grid */}
                <ProductGrid products={filteredProducts} onAddToCart={addToCart} />
            </div>

            {/* Cart Panel - Fixed Right */}
            <CartPanel />
        </div>
    );
}
