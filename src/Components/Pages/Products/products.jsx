import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import styles from './products.module.css';
import cookies from '../../Others/Cookies/cookies';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faList } from '@fortawesome/free-solid-svg-icons';
import Backdrop from '../../Others/Backdrop/backdrop';

function Products() {

    const params = useParams();

    // const cookie = cookies.get('token');

    const [products, setProducts] = useState([]);

    const [sidePanel, setSidePanel] = useState(false);

    const [backdrop, setBackdrop] = useState(false);

    const [category, setcategory] = useState(() => {
        if (params.productId) {
            return params.productId;
        }
        else {
            return 'all products';
        }
    });

    useEffect(() => {
        fetch('http://localhost:8080/fetch-products').then(res => res.json()).then(data => {
            if (data.data){
                setProducts(data.data);
            }
        }).catch(err => console.log(err));
    }, []);

    console.log(products);

    let displayProducts;

    if (Object.keys(products).length){
        displayProducts = products.filter(item => {
            if (category === 'all products') return item;

            if (item.subcategory === category){
                return item;
            }
        }).map(item => <Link to={`/products/${item.title}`} key={item.id} className={styles.product}>
            <div className={styles.productImgContainer}>
                <img src={item.img[Object.keys(item.img)[0]]} alt="img" className={styles.productImg} />
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
            <div className={styles.drawToggle} onClick={toggleSidepanel}>
                <FontAwesomeIcon icon={faList}/>
            </div>
            <div className={sidePanel ? `${styles.categoryContainer} ${styles.on}` : styles.categoryContainer}>
                <div className={category === 'hot deals' ? `${styles.category} ${styles.active}` : styles.category}
                     onClick={() => setcategory('hot deals')}
                     >Hot Deals</div>
                <div className={category === 'popular products' ? `${styles.category} ${styles.active}` : styles.category}
                     onClick={() => setcategory('popular products')}
                     >Popular Products</div>
                <div className={category === 'trending products' ? `${styles.category} ${styles.active}` : styles.category}
                     onClick={() => setcategory('trending products')}
                     >Trending products</div>
                <div className={category === 'new arrivals' ? `${styles.category} ${styles.active}` : styles.category}
                     onClick={() => setcategory('new arrivals')}
                     >New Arrivals</div>
                <div className={category === 'all products' ? `${styles.category} ${styles.active}` : styles.category}
                     onClick={() => setcategory('all products')}
                     >All products</div>
            </div>
            <div className={styles.productDisplayContainer}>
                {displayProducts}
            </div>
        </section>
        </>
    )
}

export default Products