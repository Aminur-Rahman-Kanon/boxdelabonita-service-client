import React, { useState, useEffect, useContext } from 'react';
import AuthContext from '../../Others/AuthContext/authContext';
import styles from './product.module.css';
import { useParams } from 'react-router-dom';
import ProductContainer from './ProductContainer/productContainer';

function Product() {

    const context = useContext(AuthContext);

    const params = useParams();

    const [product, setProduct] = useState({});
    
    useEffect(() => {
        if (params.product && context.products){
            const originalProduct = context.products.filter(itm => itm.title === params.product);
            if (originalProduct.length){
                setProduct(originalProduct[0]);
            }
        }
        else {
            setProduct({});
        }
    }, [context, params])

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
