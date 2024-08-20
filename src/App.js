import React, { useEffect, useState } from 'react';
import './App.css';
import UploadProducts from './Components/Pages/UploadProducts/uploadProducts';
import { Routes, Route } from 'react-router-dom';
import Homepage from './Components/Pages/Homepage/homepage';
import DefaultRoute from './Components/Pages/DefaultRoute/defaultRoute';
import Login from './Components/Pages/Login/login';
import Topbar from './Components/Pages/Topbar/topbar';
import cookies from './Components/Others/Cookies/cookies';
import Sidedrawer from './Components/Others/Sidedrawer/sidedrawer';
import Backdrop from './Components/Others/Backdrop/backdrop';
import { disableScroll } from './Components/Others/Utility/utility';
import Products from './Components/Pages/Products/products';
import Product from './Components/Pages/Product/product';
import OrderStatus from './Components/Pages/OrderStatus/orderStatus';
import { ToastContainer, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AuthContext from './Components/Others/AuthContext/authContext';

function App() {

  const cookie = cookies.get('token');
  const [sidedrawer, setSidedrawer] = useState(false);
  const [backdrop, setBackdrop] = useState(false);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('https://boxdelabonita.com/api/fetch-all-products').then(res => res.json()).then(result => {
      if (result.status === 'success'){
        setProducts(result.data);
      }
    }).catch(err => console.log(err))
  }, [])

  useEffect(() => {
    if (backdrop){
      disableScroll();
    }
    else {
      window.onscroll = { };
    }
  }, [backdrop])

  const toggleSidedrawer = () => {
    setSidedrawer((sidedrawer) => !sidedrawer)
    setBackdrop((backdrop) => !backdrop);
  }
  
  return (
    <div className="App">
      <AuthContext.Provider value={{ products }}>
        {cookie !== undefined ? <Topbar toggleSidedrawer={toggleSidedrawer}/> : null}
        <ToastContainer autoClose={1800} hideProgressBar={true} pauseOnHover theme='colored' style={{fontSize: '13px'}} transition={Slide}/>
        <Sidedrawer sidedrawer={sidedrawer} />
        <Backdrop backdrop={backdrop} toggleBackdrop={toggleSidedrawer} />
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/welcome' element={<Homepage /> } />
          <Route path='/orders' element={<OrderStatus />} />
          <Route path='/upload-products' element={<UploadProducts />} />
          <Route path='/products' element={<Products />} />
          <Route path='/products/:product' element={<Product />} />
          <Route path='*' element={<DefaultRoute />} />
        </Routes>
      </AuthContext.Provider>
    </div>
  );
}

export default App;
