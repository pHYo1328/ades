import { Routes, Route } from 'react-router-dom';
import Home from './pages/Login/Home';
import Login from './pages/Login/Login';
import ForgetPassword from './pages/Login/ForgetPassword';
import Register from './pages/Login/Register';
import OTPPage from './pages/Login/OTPPage';
import Homepage from './pages/Login/Homepage';
import ProductDetails from './pages/Products/Public/ProductDetails';
import ProductsPage from './pages/Products/Public/ProductsPage';
import ProductsByBrand from './pages/Products/Public/ProductsByBrand';
import ProductsByCategory from './pages/Products/Public/ProductsByCategory';
import Cart from './pages/Cart/Cart';
import LandingPage from './pages/Home/LandingPage';
import ProductCreate from './pages/Products/Admin/ProductCreate';
import ProductEdit from './pages/Products/Admin/ProductEdit';
import ProductModify from './pages/Products/Admin/ProductModify';
import { CartProvider } from './context/CartContext';
import Payment from './pages/Stripe/Payment';
import Brands from './pages/Products/Admin/Brands';
import Categories from './pages/Products/Admin/Categories';
// import AllCategories from './pages/Products/Public/AllCategories';
import AllBrandsAndCategories from './pages/Products/Public/AllBrandsAndCategories';
import AdminDashboard from './pages/Products/Admin/AdminDashboard';
import './App.css';
import './input.css';
import VerifyOTP from './pages/Login/OTPPage';


function App() {
  return (
    <>
      <div className="App">
        <header className="App-header">
          <CartProvider>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/verify-otp" element={<OTPPage />} />
              <Route path="/forgot" element={<ForgetPassword />} />
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
              <Route path="/products/admin" element={<ProductModify />} />
              <Route path="/admin/brands" element={<Brands />} />
              <Route path="/admin/categories" element={<Categories />} />
              <Route path="/admin/brands" element={<Brands />} />
              <Route path="/admin/categories" element={<Categories />} />
              <Route path="/brands/categories" element={<AllBrandsAndCategories />}/>
              <Route path="/brands/:brandID" element={<ProductsByBrand />}/>
              <Route path="/categories/:categoryID" element={<ProductsByCategory />}/>
              <Route path="/admin" element={<AdminDashboard/>}/>

              <Route
                path="/products/edit/:productID"
                element={<ProductEdit />}
              />
              <Route path="/payment/:orderID" element={<Payment />} />
            </Routes>
          </CartProvider>
          {/* Hello, we are ready to develop our ades project. */}
        </header>
      </div>
    </>
  );
}

export default App;
