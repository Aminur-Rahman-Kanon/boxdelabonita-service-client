import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import styles from './products.module.css';
import cookies from '../../Others/Cookies/cookies';
import Backdrop from '../../Others/Backdrop/backdrop';
import AuthContext from '../../Others/AuthContext/authContext';

function Products() {

    // const cookie = cookies.get('token');

    const context = useContext(AuthContext);

    const [products, setProducts] = useState([]);

    const [sidePanel, setSidePanel] = useState(false);

    const [backdrop, setBackdrop] = useState(false);

    useEffect(() => {
        fetch('https://boxdelabonita-server.onrender.com/fetch-products').then(res => res.json()).then(result => {
            if (result.status === 'success'){
                console.log(result);
                setProducts(result.data);
            }
            else {
                setProducts([]);
            }
        })
    }, []);

    let displayProducts;

    if (products.length){
        displayProducts = products.map(item => <Link to={`/products/${item.title}`} key={item.id} className={styles.product}>
            <div className={styles.productImgContainer}>
                <img src={Object.values(item.img || [])[0]} alt="img" className={styles.productImg} />
            </div>
            <div className={styles.productDetailsContainer}>
                <p className={styles.productDetailsP}>Category: {item.category}</p>
                <p className={styles.productDetailsP}>Sub-Category: {item.subcategory}</p>
                <p className={styles.productDetailsP}>Title: {item.title}</p>
            </div>
        </Link>)
    }
    else {
        displayProducts = <div className={styles.defaultproductDisplay}>
            <h4>No item</h4>
        </div>
    }

    const toggleSidepanel = () => {
        setSidePanel((sidePanel) => !sidePanel);
        setBackdrop((backdrop) => !backdrop);
    }

    // if (cookie === undefined) return window.location.href = '/';
    return (
        <>
        <Backdrop backdrop={backdrop} toggleBackdrop={toggleSidepanel}/>
        <section className={styles.productsContainer}>
            <div className={styles.productDisplayContainer}>
                {displayProducts}
            </div>
        </section>
        </>
    )
}

export default Products