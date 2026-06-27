
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ThemeProvider } from './context/ThemeContext';
import AuthLayout from './components/layout/AuthLayout';
import AdminLayout from './components/layout/AdminLayout';
import CashierLayout from './components/layout/CashierLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import Landing from './pages/public/Landing';
import Login from './pages/public/Login';
import Unauthorized from './pages/public/Unauthorized';
import NotFound from './pages/public/NotFound';

// Admin Pages
import Dashboard from './pages/admin/Dashboard';
import Products from './pages/admin/Products';
import ProductForm from './pages/admin/ProductForm';
import Categories from './pages/admin/Categories';
import Users from './pages/admin/Users';
import ReportsDaily from './pages/admin/ReportsDaily';
import AnalysisAdmin from './pages/admin/Analysis';
import Settings from './pages/admin/Settings';

// Cashier Pages
import POS from './pages/cashier/POS';
import Orders from './pages/cashier/Orders';
import OrderDetails from './pages/cashier/OrderDetails';
import AnalysisCashier from './pages/cashier/Analysis';
import Receipt from './pages/cashier/Receipt';

// Shared Pages
import Profile from './pages/shared/Profile';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <CartProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route element={<AuthLayout />}>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/unauthorized" element={<Unauthorized />} />
            </Route>

            {/* Admin Routes (Protected) */}
            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="products" element={<Products />} />
                <Route path="products/new" element={<ProductForm />} />
                <Route path="products/:id/edit" element={<ProductForm />} />
                <Route path="categories" element={<Categories />} />
                <Route path="users" element={<Users />} />
                <Route path="reports/daily" element={<ReportsDaily />} />
                <Route path="analysis" element={<AnalysisAdmin />} />
                <Route path="settings" element={<Settings />} />
              </Route>
            </Route>

            {/* Cashier Routes (Protected) */}
            <Route element={<ProtectedRoute allowedRoles={['cashier', 'admin']} />}>
              <Route element={<CashierLayout />}>
                  <Route path="/pos" element={<POS />} />
                  <Route path="/orders" element={<Orders />} />
                  <Route path="/analysis" element={<AnalysisCashier />} />
                  <Route path="/orders/:id" element={<OrderDetails />} />
                <Route path="/profile" element={<Profile />} />
              </Route>
            </Route>

            {/* Thermal/Receipt view (No Layout) */}
            <Route path="/orders/:id/receipt" element={<Receipt />} />

            {/* Fallback */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
