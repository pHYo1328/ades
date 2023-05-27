import { Routes, Route } from 'react-router-dom';
import Home from './pages/Login/Home';

import Login from './pages/Login/Login';
import ForgotPassword from './pages/Login/ForgetPassword';
import Register from './pages/Login/Register';
import OTPPage from './pages/Login/OTPPage';
import Homepage from './pages/Login/Homepage';
import UserInfo from './pages/Login/UserInfo';

import AdminHomepage from './pages/Login/admin/adminHomepage';
import AdminRegister from './pages/Login/admin/adminRegister';
import AdminLogin from './pages/Login/admin/adminLogin';
import AdminForgotPassword from './pages/Login/admin/adminForgotPassword';
import AdminOTPPage from './pages/Login/admin/adminOTPPage';

import ProductDetails from './pages/Products/Public/ProductDetails';
import SearchResults from './pages/Products/Public/SearchResults';
import ProductsPage from './pages/Products/Public/ProductsPage';
import ProductsByBrand from './pages/Products/Public/ProductsByBrand';
import ProductsByCategory from './pages/Products/Public/ProductsByCategory';
import Cart from './pages/Cart/Cart';
import Header from './components/header/header';
import OrderToShip from './pages/Order/OrderToShip/OrderToShip';
import OrderDelivered from './pages/Order/OrderDelivered/OrderDelivered';
import OrderToDeliver from './pages/Order/OrderToDeliver/OrderToDeliver';
import OrderToPay from './pages/Order/OrderToPay/OrderToPay';
import OrderAdmin from './pages/Order/Admin/OrderAdmin';
import LandingPage from './pages/Home/LandingPage';
import ProductCreate from './pages/Products/Admin/ProductCreate';
import ProductEdit from './pages/Products/Admin/ProductEdit';
// import ProductModify from './pages/Products/Admin/ProductModify';
import Payment from './pages/Stripe/Payment';
import RefundPayment from './pages/Stripe/Refund';
// import Brands from './pages/Products/Admin/Brands';
// import Categories from './pages/Products/Admin/Categories';
// import AllCategories from './pages/Products/Public/AllCategories';
import AllBrandsAndCategories from './pages/Products/Public/AllBrandsAndCategories';
import AdminDashboard from './pages/Products/Admin/AdminDashboard';
import './App.css';
import './input.css';
import { improve } from '@cloudinary/url-gen/actions/adjust';

function App() {
  return (
    <>
      <div className="App">
        <header className="App-header">
          <Header />

          <Routes>
            <Route path="/" element={<Home />} />

            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/verify-otp" element={<OTPPage />} />
            <Route path="/forgot" element={<ForgotPassword />} />
            <Route path="/homepage" element={<Homepage />} />
            <Route path="/users" element={<UserInfo />} />

            <Route path="/homepage-admin" element={<AdminHomepage />} />
            <Route path="/register-admin" element={<AdminRegister />} />
            <Route path="/login-admin" element={<AdminLogin />} />
            <Route path="/forgot-admin" element={<AdminForgotPassword />} />
            <Route path="/verify-otp-admin" element={<AdminOTPPage />} />

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
            <Route path="/orderToShip" element={<OrderToShip />} />
            <Route path="/orderDelivered" element={<OrderDelivered />} />
            <Route path="/orderToDeliver" element={<OrderToDeliver />} />
            <Route path="/orderToPay" element={<OrderToPay />} />
            <Route path="/admin/orderStatus" element={<OrderAdmin />} />
            <Route path="/home" element={<LandingPage />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/products/create" element={<ProductCreate />} />
            {/* <Route path="/products/admin" element={<ProductModify />} /> */}
            {/* <Route path="/admin/brands" element={<Brands />} /> */}
            {/* <Route path="/admin/categories" element={<Categories />} /> */}
            <Route
              path="/brands/categories"
              element={<AllBrandsAndCategories />}
            />
            <Route path="/brands/:brandID" element={<ProductsByBrand />} />
            <Route
              path="/categories/:categoryID"
              element={<ProductsByCategory />}
            />
            <Route path="/admin" element={<AdminDashboard />} />

            <Route path="/products/edit/:productID" element={<ProductEdit />} />
            <Route path="/payment/:orderID" element={<Payment />} />
            <Route
              path="/payment-refund/:orderID"
              element={<RefundPayment />}
            />
          </Routes>
          {/* Hello, we are ready to develop our ades project. */}
        </header>
      </div>
    </>
  );
}

export default App;
