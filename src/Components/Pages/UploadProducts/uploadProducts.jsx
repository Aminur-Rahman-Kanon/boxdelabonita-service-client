import React, { useEffect, useState } from 'react';
import styles from './uploadProducts.module.css';
import { category } from '../../Others/Data/data';
import cookies from '../../Others/Cookies/cookies';
import Spinner from '../../Others/Spinner/spinner';
import MessageContainer from '../../Others/MessageContainer/messageContainer';
import Modal from '../../Others/Modal/modal';
import Backdrop from '../../Others/Backdrop/backdrop';
import { disableScroll } from '../../Others/Utility/utility';
import AddPhoto from './AddPhoto/addPhoto';

const selectCategory = category.map(item => <option key={item} value={item} className={styles.options}>{item}</option>);

function UploadProducts() {

    const cookie = cookies.get('token');

    const [productCategory, setProductCategory] = useState('');
    const [stock, setStock] = useState(0);
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState(0);
    const [rating, setRating] = useState(0);
    const [discountedPrice, setDiscountedPrice] = useState(0);
    const [imgCount, setImgCount] = useState(0);
    const [addImgBtnDisable, setAddImgBtnDisable] = useState(true);
    const [colors, setColors] = useState([])
    const [description, setDescription] = useState('');
    const [landingDescription, setLandingDescription] = useState('');
    const [spinner, setSpinner] = useState(false);
    const [status, setStatus] = useState('');
    const [displayMsg, setDisplayMsg] = useState(false);
    const [modal, setModal] = useState(false);
    const [backdrop, setBackdrop] = useState(false);


    // useEffect(() => {
    //     if (cookie !== undefined){
    //         fetch('https://boxdelabonita.com/api/verify-token', {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json'
    //             },
    //             body: JSON.stringify({ token: cookie })
    //         }).then(res => res.json()).then(data => {
    //             if (data.status !== 'valid') {
    //                 cookies.remove('token')
    //                 window.location.href = '/'
    //             }
    //         }).catch(err => window.location.href = '/');
    //     }
    // }, [])

    useEffect(() => {
        if (backdrop){
            disableScroll();
        }
        else {
            window.onscroll = () => { };
        }
    }, [backdrop])

    useEffect(() => {
        if (category && title){
            setAddImgBtnDisable(false);
        }
        else {
            setAddImgBtnDisable(true);
        }
    }, [category, title])

    const productDetails = {category: productCategory, stock, title, price: { originalPrice: price, discountedPrice }, description, landingDescription, rating, colors}

    const submitHandler = async (e) => {
        e.preventDefault();
        setSpinner(true);

        const formData = new FormData();
        const productPrice = {
            originalPrice: price,
            discountedPrice
        }
        
        formData.append('data', JSON.stringify({ 
            productCategory, stock, title, productPrice, description, landingDescription, rating, colors
         }));


        await fetch('https://boxdelabonita.com/api/upload-products', {
            method: 'POST',
            
            body: formData
        }).then(res => res.json()).then(data => {
            setSpinner(false);
            setStatus(data);
            setBackdrop(true);
            setDisplayMsg(true);
            setModal(true);
        }).catch(err => {
            setSpinner(false);
            setStatus('error');
            setBackdrop(true);
            setDisplayMsg(true);
            setModal(true);
        });
    }

    const toggleDisplayMsg = () => {
        setStatus('');
        setDisplayMsg(false);
        setModal(false);
        setBackdrop(false);
    }

    return (
        <>
        <Backdrop backdrop={backdrop} toggleBackdrop={toggleDisplayMsg}/>
        <Modal modal={modal}>
            <MessageContainer display={displayMsg} toggleDisplay={toggleDisplayMsg} data={status}/>
        </Modal>
        <Spinner spinner={spinner} />
        <div className={styles.uploadProductsContainer}>
            <h2>Upload Products</h2>
            <form className={styles.form} encType='multipart/form-data'>
                <div className={styles.fieldsetGroup}>
                    <fieldset className={styles.fieldset}>
                        <label className={styles.label}>Category</label>
                        <select defaultValue="Select a category" className={styles.select} onChange={(e) => setProductCategory(e.target.value.toLowerCase())}>
                            <option disabled>Select a category</option>
                            {selectCategory}
                        </select>
                    </fieldset>
                    <fieldset className={styles.fieldset}>
                        <label className={styles.label}>Stock</label>
                        <input type="number"
                            className={styles.input}
                            placeholder="Product's amount"
                            onChange={(e) => setStock(Number(e.target.value))} />
                    </fieldset>
                    <fieldset className={styles.fieldset}>
                        <label className={styles.label}>Product Title</label>
                        <input type="text"
                            className={styles.input}
                            placeholder="Product's Title"
                            onChange={(e) => setTitle(e.target.value.toLowerCase().trim())}/>
                    </fieldset>
                    <fieldset className={styles.fieldset}>
                        <label className={styles.label}>Product's Price</label>
                        <input type="number"
                            className={styles.input}
                            placeholder="Product's Price"
                            onChange={(e) => setPrice(Number(e.target.value))} />
                    </fieldset>
                    <fieldset className={styles.fieldset}>
                        <label className={styles.label}>Discounted Price</label>
                        <input type="number"
                            className={styles.input}
                            placeholder="Discounted Price"
                            onChange={(e) => setDiscountedPrice(Number(e.target.value))} />
                    </fieldset>
                    <fieldset className={styles.fieldset}>
                        <label className={styles.label}>Rating</label>
                        <input type="number"
                            className={styles.input}
                            placeholder="Rating (Max - 5)"
                            onChange={(e) => setRating(Number(e.target.value))} />
                    </fieldset>
                    <fieldset className={styles.fieldset}>
                        <label className={styles.label}>Product Description</label>
                        <textarea placeholder='Product Description'
                                className={styles.textarea}
                                onChange={(e) => setDescription(e.target.value.trim())}/>
                    </fieldset>
                    <fieldset className={styles.fieldset}>
                        <label className={styles.label}>Landing Page Description</label>
                        <textarea placeholder='Landing Page Description'
                                className={styles.textarea}
                                onChange={(e) => setLandingDescription(e.target.value.trim())}/>
                    </fieldset>
                    <fieldset className={styles.fieldset}>
                        <label className={styles.label}>Colors</label>
                        <input type="text" className={styles.input} placeholder='Colors' onChange={(e) => setColors(e.target.value.toLowerCase().split(','))}/>
                    </fieldset>
                    <div className={styles.imgGroup} style={imgCount ? {display: 'flex'} : {display: 'none'}}>
                        {
                            Array.from(Array(imgCount)).map((img, idx) => <AddPhoto key={idx} idx={idx} product={productDetails} updateImgCount={setImgCount} />)
                        }
                    </div>
                    <button className={styles.addPhotoBtn}
                            disabled={addImgBtnDisable}
                            onClick={(e) => {
                                e.preventDefault();
                                setImgCount(imgCount => imgCount+1)
                            }}>
                        Add Photo
                    </button>
                </div>
                {/* <button onClick={submitHandler}
                        disabled={!category || !title || !price || !description}
                        className={styles.submitBtn}>Submit</button> */}
            </form>
        </div>
        </>
    )
}

export default UploadProducts;
