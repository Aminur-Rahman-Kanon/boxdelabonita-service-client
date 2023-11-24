import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import styles from './homepage.module.css';
import cookies from '../../Others/Cookies/cookies';

function Homepage() {

    // const cookie = cookies.get('token');

    const [products, setProducts] = useState({});

    // useEffect(() => {
    //     fetch('https://boxdelabonita-server.onrender.com/fetch-products').then(res => res.json()).then(data => {
    //        console.log(data.data); 
    //     }).catch(err => console.log(err));
    // }, [])

    // if (cookie === undefined) return window.location.href = '/';

    return (
        <section className={styles.homepageMain}>
            <div className={styles.homepageContainer}>
                <div className={styles.rows}>
                    <div className={styles.header}>Hot Deals:</div>
                    {/* <div className={styles.count}>{Object.keys(products).length ? products.hotDealsProduct.length : 0}</div> */}
                    <Link to="/product/hot deals" className={styles.checkBtn}>Check</Link>
                </div>
                <div className={styles.rows}>
                    <div className={styles.header}>Popular Products:</div>
                    {/* <div className={styles.count}>{Object.keys(products).length ? products.popularProducts.length : 0}</div> */}
                    <Link to="/product/popular products" className={styles.checkBtn}>Check</Link>
                </div>
                <div className={styles.rows}>
                    <div className={styles.header}>Trending Products:</div>
                    {/* <div className={styles.count}>{Object.keys(products).length ? products.trendingProducts.length : 0}</div> */}
                    <Link to="/product/trending products" className={styles.checkBtn}>Check</Link>
                </div>
                <div className={styles.rows}>
                    <div className={styles.header}>New Arrivals:</div>
                    {/* <div className={styles.count}>{Object.keys(products).length ? products.newArrivals.length : 0}</div> */}
                    <Link to="/product/new arrivals" className={styles.checkBtn}>Check</Link>
                </div>
                <div className={styles.rows}>
                    <div className={styles.header}>All Products:</div>
                    {/* <div className={styles.count}>{Object.keys(products).length ? products.allProducts.length : 0}</div> */}
                    <Link to="/product/all products" className={styles.checkBtn}>Check</Link>
                </div>
            </div>
        </section>
    )
}

export default Homepage
