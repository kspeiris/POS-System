
import { Plus } from 'lucide-react';

export default function ProductGrid({ products, onAddToCart }) {
    if (!products || products.length === 0) {
        return (
            <div className="flex items-center justify-center h-72 text-slate-500 bg-white/80 rounded-3xl border border-dashed border-slate-200 shadow-sm">
                <div className="text-center space-y-2">
                    <p className="font-semibold text-slate-700">No products found</p>
                    <p className="text-sm text-slate-500">Try a different search or category filter.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 overflow-y-auto pb-24">
            {products.map((product) => (
                <div key={product._id || product.id} className="surface rounded-3xl p-4 flex flex-col gap-3 hover:-translate-y-0.5 hover:shadow-xl transition-all duration-200">
                    <div className="h-32 bg-slate-50 rounded-2xl flex items-center justify-center overflow-hidden relative group">
                        {product.imageUrl ? (
                            <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                            <div className="text-4xl text-slate-200 font-bold select-none">{product.name.charAt(0)}</div>
                        )}
                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>

                    <div className="flex-1">
                        <h3 className="font-semibold text-dark line-clamp-1">{product.name}</h3>
                        <p className="text-slate-500 text-sm">{product.stockQty ?? product.stock} in stock</p>
                    </div>

                    <div className="flex items-center justify-between mt-auto">
                        <span className="font-bold text-primary text-lg">${product.price.toFixed(2)}</span>
                        <button
                            onClick={() => onAddToCart(product)}
                            className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                        >
                            <Plus className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}
