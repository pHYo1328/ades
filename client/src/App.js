import { Routes, Route } from 'react-router-dom';
import Home from './pages/Login/Home';
import Login from './pages/Login/Login';
import Register from './pages/Login/Register';
import Homepage from './pages/Login/Homepage';
import ProductDetails from './pages/Products/ProductDetails';
import ProductsPage from './pages/Products/ProductsPage';
import ProductsByBrand from './pages/Products/ProductsByBrand';
import ProductsByCategory from './pages/Products/ProductsByCategory';
import Cart from './pages/Cart/Cart';
import LandingPage from './pages/Home/LandingPage';
import ProductCreate from './pages/Products/ProductCreate';
import ProductEdit from './pages/Products/ProductEdit';
import { CartProvider } from './context/CartContext';
import Payment from './pages/Stripe/Payment';
import './App.css';
import './input.css';

function App() {
  return (
    <>
      <div className="App">
        <header className="App-header">
          <CartProvider>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/homepage" element={<Homepage />} />
              <Route path="/product/:productID" element={<ProductDetails />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route
                path="/products/brand/:brandID"
                element={<ProductsByBrand />}
              />
              <Route
                path="/products/category/:categoryID"
                element={<ProductsByCategory />}
              />
              <Route path="/cart" element={<Cart />} />
              <Route path="/home" element={<LandingPage />} />
              <Route path="/products/create" element={<ProductCreate />} />
              <Route
                path="/products/edit/:productID"
                element={<ProductEdit />}
              />
              <Route path="/payment" element = {<Payment/>} />
            </Routes>
          </CartProvider>
          {/* Hello, we are ready to develop our ades project. */}
        </header>
      </div>
    </>
  );
}

export default App;
