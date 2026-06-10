import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ShopPage from './pages/ShopPage';
import ProductDetailPage from './pages/ProductDetailPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import CartView from './pages/CartPage'; 


function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-white">
        <Navbar />
        
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<ShopPage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            
            <Route path="/cart" element={<ProtectedRoute element={<CartView />} />} />
            
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="*" element={<ShopPage />} />
          </Routes>
        </div>
        
        <div className="w-full bg-black h-12" /> 
        <Footer />
      </div>
    </Router>
  );
}

export default App;