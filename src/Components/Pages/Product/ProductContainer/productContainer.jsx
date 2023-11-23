import React, { useEffect, useState } from 'react';
import styles from './productContainer.module.css';
import { category, subCategory } from '../../../Others/Data/data';
import AddNewImg from '../AddNewImg/addNewImg';
import Spinner from '../../../Others/Spinner/spinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import StatusMsg from '../StatusMsg/statusMsg';
import UpdateMsg from '../../../Others/UpdateMsg/updateMsg';
import { useNavigate } from 'react-router-dom';
import AddMoreImg from '../AddMoreImg/addMoreImg';

function ProductContainer({ product }) {

    const navigate = useNavigate();

    const [img, setImg] = useState({});
    const [productCategory, setProductCategory] = useState(product.category);
    const [productSubCategory, setProductSubCategory] = useState(product.subcategory);
    const [stock, setStock] = useState(product.stock);
    const [title, setTitle] = useState(product.title);
    const [originalPrice, setOriginalPrice] = useState(product.price.originalPrice);
    const [discountPrice, setDiscountPrice] = useState(product.price.discountedPrice);
    const [colors, setColors] = useState(product.color);
    const [description, setDiscription] = useState(product.description);
    const [spinner, setSpinner] = useState(false);
    const [showRemovePrompt, setShowRemovePrompt] = useState(false);
    const [removeId, setRemoveId] = useState(null);
    const [removeBtnSpinner, setRemoveBtnSpinner] = useState(false);
    const [removeImgStatus, setRemoveImgStatus] = useState('');
    const [removeStatus, setRemoveStatus] = useState(false);
    const [removeProductMsg, setRemoveProductMsg] = useState(false);
    const [newImgColor, setNewImgColor] = useState('');
    const [showChangeImg, setShowChangeImg] = useState(false);
    const [changeImg, setChangeImg] = useState(null);
    const [changeImgId, setChangeImgId] = useState(null);
    const [changeImgStatus, setChangeImgStatus] = useState('');
    const [showChangeImgStatus, setShowChangeImgStatus] = useState(false);
    const [changeImgSpinner, setChangeImgSpinner] = useState(false);
    const [updateDetailsStatus, setUpdateDetailsStatus] = useState('');
    const [updateDetailsSpinner, setUpdateDetailsSpinner] = useState(false);
    const [showUpdateDetailsMsg, setShowUpdateDetailsMsg] = useState(false);
    const [moreImgs, setMoreImgs] = useState(0);
    const [newColor, setNewColor] = useState([]);

    useEffect(() => {
        const imgs = JSON.parse(JSON.stringify(product.img));
        setImg(imgs);
    }, []);
    
    if (!product) return;

    const removeImgHandler = async (e, idx) => {
        e.preventDefault();
        setRemoveBtnSpinner(true);

        await fetch('http://localhost:8080/remove-img',{
            method: 'POST',
            
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ category: product.category, title: product.title, imgIdx: idx })
        }).then(res => res.json()).then(result => {
            console.log(result);
            if (result.status === 'success'){
                setRemoveBtnSpinner(false);
                setRemoveImgStatus('success');
                setRemoveStatus(true);
                setShowRemovePrompt(false);
            }
            else {
                setRemoveBtnSpinner(false);
                setRemoveImgStatus('failed');
                setRemoveStatus(true);
                setShowRemovePrompt(false);
            }
        }).catch(err => {
            setRemoveBtnSpinner(false);
            setRemoveImgStatus('error');
            setRemoveStatus(true);
            setShowRemovePrompt(false);
        })
    }

    const changeImgHandler = async (e, imgIdx) => {
        e.preventDefault();
        setChangeImgSpinner(true);
        try {
            const formData = new FormData();
            formData.append('data', JSON.stringify({ category: product.category, title: product.title, index: imgIdx }))
            formData.append('photo', changeImg);
            await fetch('http://localhost:8080/change-photo', {
                method: 'POST',
                
                body: formData
            }).then(res => res.json()).then(data => {
                setChangeImgSpinner(false);
                setChangeImgStatus('success');
                setShowChangeImgStatus(true);
            }).catch(err => {
                setChangeImgSpinner(false);
                setChangeImgStatus('failed');
                setShowChangeImgStatus(true);
            })
        } catch (error) {
            setChangeImgSpinner(false);
            setChangeImgStatus('failed');
            setShowChangeImgStatus(true);
        }
    }

    const onFileSelect = (e, id, name) => {
        const changeImgs = e.target.files[0];
        const file = new File([changeImgs], `image ${id+1}`, {
            dateModified: Date.now(),
            type: changeImgs.type
        })

        setChangeImg(file);
        const reader = new FileReader();
        const imgTag = document.getElementById(id);
        imgTag.title = changeImgs.name;
        reader.onload  = (e) => {
            imgTag.src = e.target.result;
        }

        reader.readAsDataURL(changeImgs);
    }

    const submitUpdateDetails = async (e) => {
        e.preventDefault();
        setShowUpdateDetailsMsg(false);
        setUpdateDetailsSpinner(true);
        const data = {
            title: title.trim(),
            description: description.trim(),
            productCategory,
            productSubCategory,
            stock,
            price: {
                originalPrice: originalPrice,
                discountedPrice: discountPrice
            },
            colors
        }
        await fetch('http://localhost:8080/update-product-details', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ data })
        }).then(res => res.json()).then(result => {
            if (result.status === 'success') {
                setUpdateDetailsSpinner(false);
                setUpdateDetailsStatus('success');
                setShowUpdateDetailsMsg(true);
            }
            else {
                setUpdateDetailsSpinner(false);
                setUpdateDetailsStatus('failed');
                setShowUpdateDetailsMsg(true);
            }
        }).catch(err => {
            setUpdateDetailsSpinner(false);
            setUpdateDetailsStatus('error');
            setShowUpdateDetailsMsg(true);
        })
    }

    let displayImg;

    if (Object.keys(img).length){
        displayImg = Object.keys(img).map((item, idx) => <div key={idx} className={styles.imgs}>
            <div className={styles.imgContainer}>
                <img id={String(idx)} src={img[item]} alt="img" className={styles.img}/>
            </div>
            <div className={styles.imgOptionContainer}>
                <button className={styles.changeBtn} onClick={() => {
                    setShowChangeImg(true);
                    setChangeImgId(idx);
                }}>Change Image</button>
                <button className={styles.removeBtn} onClick={(e) => {
                    e.preventDefault();
                    setRemoveId(idx);
                    setShowRemovePrompt(true);
                }}>Remove</button>
            </div>
            <div className={styles.actionPromptContainer} style={showRemovePrompt && removeId === idx ? {display: 'flex'} : {display: 'none'}}>
                <h4 className={styles.productContainerH4}>Are you sure</h4>
                <div className={styles.actionPromptBtnContainer}>
                    <button className={styles.actionPromptBtn} onClick={(e) => removeImgHandler(e, idx)}>{
                        removeBtnSpinner ? <FontAwesomeIcon icon={faSpinner} spinPulse/> : 'Yes'
                    }</button>
                    <button className={styles.actionPromptBtn} onClick={(e) => {
                        e.preventDefault();
                        setShowRemovePrompt(false)
                    }}>No</button>
                </div>
            </div>
            <div className={styles.removeStatusContainer} style={removeStatus && removeId === idx ? {display: 'flex'}:{display: 'none'} }>
                <StatusMsg action={'remove'} status={removeImgStatus}/>
            </div>
            <div className={showChangeImg && changeImgId == idx ? `${styles.addNewImgContainer} ${styles.showContainer}` : styles.addNewImgContainer}>
                <div className={showChangeImgStatus ? `${styles.displayStatus} ${styles.show}` : styles.displayStatus}
                    style={changeImgStatus === 'success' ? {backgroundColor: 'green'} : {backgroundColor: '#bb0202'}}>
                    <StatusMsg action={'change'} status={changeImgStatus}/>
                </div>
                <form encType='multipart/form-data' className={styles.newImgDetailsContainer}>
                    <input type='file' accept='image/png, image/jpeg' className={styles.newImgFileInput} onChange={(e) => onFileSelect(e, idx, item)}/>
                    <button className={styles.addImgBtn}
                            onClick={(e) => changeImgHandler(e, idx)}
                            disabled={!changeImg}>
                            {
                                changeImgSpinner ? <FontAwesomeIcon icon={faSpinner} spinPulse className={styles.spinner}/> : 'Change Photo'
                            }
                    </button>
                </form>
            </div>
        </div>)
    }

    const removeProductmsg = <div className={styles.removeMsgContainer} style={removeProductMsg ? {display: 'flex'} : {display: 'none'}}>
        <h4>{`${product.title} removed`}</h4>
        <button className={styles.removeProductBtn} onClick={() => navigate(-1)}>Ok</button>
    </div>

    const removeProduct = async (e) => {
        e.preventDefault();
        setSpinner(true);

        await fetch('http://localhost:8080/remove-product', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            
            body: JSON.stringify({ title: product.title, category: product.category, img: product.img })
        }).then(res => res.json())
        .then(data => {
            console.log(data);
            if (data.status === 'success'){
                setSpinner(false);
                setRemoveProductMsg(true);
            }
            else {
                setSpinner(false);
                setRemoveProductMsg(true);
            }
        }).catch(err => console.log(err))
    }

    const removeColor = (idx) => {
        if (colors.length) {
            const copy = [...colors];
            copy.splice(idx, 1);
            setColors(copy);
        }
    }

    const addNewColor = (e) => {
        e.preventDefault();
        const newColors = colors.concat(newColor);
        setColors(newColors);
        document.getElementById('new-color').value = '';
    }

    const displayAddMoreImgs = Array.from(Array(moreImgs)).map((item, idx) => <AddMoreImg key={idx} product={product} idx={idx} currentIdx={img.length}/>)

    return (
        <>
        <Spinner spinner={spinner}/>
        <div className={styles.productContainer}>
            {removeProductmsg}
            <div className={styles.form}>
                <div className={styles.imgContainerMain}>
                    { displayImg }
                    {displayAddMoreImgs}
                    
                    <div className={styles.addMoreImgContainer}>
                        <button className={styles.addMoreImgBtn} onClick={() => setMoreImgs(moreImgs => moreImgs + 1)}>+ Add More Image</button>
                    </div>
                </div>
                <form className={styles.productDetailsContainer}>
                    <fieldset className={styles.fieldset}>
                        <label className={styles.label}>Category</label>
                        <select className={styles.select}
                                value={productCategory}
                                onChange={(e) => setProductCategory(e.target.value.toLowerCase())}>
                            {
                                category.map(cat => <option key={cat} value={cat} className={styles.option}>{cat}</option>)
                            }                    
                        </select>
                    </fieldset>
                    <fieldset className={styles.fieldset}>
                        <label className={styles.label}>Sub-category</label>
                        <select className={styles.select}
                                value={productSubCategory}
                                onChange={(e) => setProductSubCategory(e.target.value.toLowerCase())}>
                            {
                                subCategory.map(cat => <option key={cat} className={styles.option}>{cat}</option>)
                            }                    
                        </select>
                    </fieldset>
                    <fieldset className={styles.fieldset}>
                        <label className={styles.label}>Stock</label>
                        <input type='number'
                               value={stock}
                               className={styles.input}
                               placeholder='Stock'
                               onChange={(e) => setStock(Number(e.target.value))}/>
                    </fieldset>
                    <fieldset className={styles.fieldset}>
                        <label className={styles.label}>Product's Title</label>
                        <input type='text'
                               className={styles.input}
                               value={title}
                               placeholder='Product Title'
                               onChange={(e) => setTitle(e.target.value.toLowerCase())}/>
                    </fieldset>
                    <fieldset className={styles.fieldset}>
                        <label className={styles.label}>Original Price</label>
                        <input type='number'
                               className={styles.input}
                               value={originalPrice}
                               placeholder='Original Price'
                               onChange={(e) => setOriginalPrice(Number(e.target.value))}/>
                    </fieldset>
                    <fieldset className={styles.fieldset}>
                        <label className={styles.label}>Discount Price</label>
                        <input type='number'
                               className={styles.input}
                               value={discountPrice}
                               placeholder='Discount Price'
                               onChange={(e) => setDiscountPrice(Number(e.target.value))}/>
                    </fieldset>
                    <fieldset className={styles.fieldset}>
                        <label className={styles.label}>Colors</label>
                        <div className={styles.colorContainer}>
                            <div className={styles.colors}>
                                {colors.map((clr, idx) => <div key={idx} className={styles.color}>
                                    {clr}
                                    <span className={styles.colorRemover} onClick={() => removeColor(idx)}>x</span>
                                </div>)}
                            </div>
                            <input type="text"
                                    id="new-color"
                                   placeholder='Add new color'
                                   className={styles.input} style={{width: '100%', margin: '10px 0'}}
                                   onChange={(e) => setNewColor(e.target.value.split(','))}/>
                            <button className={styles.addColorBtn} onClick={addNewColor}>Add color</button>
                        </div>
                    </fieldset>
                    <fieldset className={styles.fieldset}>
                        <label className={styles.label}>Description</label>
                        <textarea className={styles.textarea}
                                  placeholder='Product Description'
                                  value={description}
                                  onChange={(e) => setDiscription(e.target.value)} />
                    </fieldset>
                    <div className={styles.displayUpdateMsg} style={showUpdateDetailsMsg ? {display: 'flex'} : {display: 'none'}}>
                        <UpdateMsg status={updateDetailsStatus}/>
                    </div>
                    <button className={styles.submitBtn} onClick={submitUpdateDetails}>
                        {
                            updateDetailsSpinner ? <FontAwesomeIcon icon={faSpinner} spinPulse className={styles.spinner}/> : 'Submit Changes'
                        }
                    </button>
                    <button className={styles.removeProduct} onClick={removeProduct}>{`Remove ${product.title}`}</button>
                </form>
            </div>
        </div>
        </>
    )
}

export default ProductContainer
