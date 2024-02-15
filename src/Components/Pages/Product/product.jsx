import React, { useState, useEffect } from 'react';
import styles from './product.module.css';
import { useParams } from 'react-router-dom';
import ProductContainer from './ProductContainer/productContainer';

function Product() {
    const params = useParams();

    const [product, setProduct] = useState({});

    const [error, setError] = useState(false);
    
    useEffect(() => {
        if (params.product){
            fetch('https://boxdelabonita-server.onrender.com/fetch-product', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                
                body: JSON.stringify({ product: params.product })
            }).then(res => res.json()).then(data => {
                if (data.data) {
                    setProduct(data.data[0]);
                }
            }).catch(err => setError(true));
        }
    }, [])

    const defaultDisplay = <div className={styles.defaultContainer}>
        <h4>No item</h4>
    </div>

    return (
        <section className={styles.productContainer}>
            {Object.keys(product).length ? <ProductContainer product={product}/> : defaultDisplay}
        </section>
    )
}

export default Product
