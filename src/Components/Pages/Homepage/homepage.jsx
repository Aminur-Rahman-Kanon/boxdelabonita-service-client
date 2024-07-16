import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import styles from './homepage.module.css';
import cookies from '../../Others/Cookies/cookies';
import upload from '../../../Assets/upload.png';
import products from '../../../Assets/products.png';
import order from '../../../Assets/order.png';
import home from '../../../Assets/home.png';

function Homepage() {

    // const cookie = cookies.get('token');

    return (
        <section className={styles.homepageMain}>
            <a href='/welcome' className={styles.card}>
                <div className={styles.imgContainer}>
                    <img src={home} alt="card" className={styles.img}/>
                </div>
                <span className={styles.textBlackSmall}>Home</span>
            </a>
            <a href='/upload-products' className={styles.card}>
                <div className={styles.imgContainer}>
                    <img src={upload} alt="card" className={styles.img}/>
                </div>
                <span className={styles.textBlackSmall}>Upload</span>
            </a>
            <a href='/products' className={styles.card}>
                <div className={styles.imgContainer}>
                    <img src={products} alt="card" className={styles.img}/>
                </div>
                <span className={styles.textBlackSmall}>Products</span>
            </a>
            <a href='/orders' className={styles.card}>
                <div className={styles.imgContainer}>
                    <img src={order} alt="card" className={styles.img}/>
                </div>
                <span className={styles.textBlackSmall}>Orders</span>
            </a>
        </section>
    )
}

export default Homepage
