import React, { useState } from 'react';
import styles from './addMoreImg.module.css';
import addPhoto from '../../../../Assets/addPhoto.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

const AddMoreImg = ({ product, idx, currentIdx }) => {

    const [color, setColor] = useState('');
    const [newImg, setNewImg] = useState(null);
    const [spinner, setSpinner] = useState(false);
    const [status, setStatus] = useState('');
    const [showStatus, setShowStatus] = useState(false);

    const imgIdx = idx+currentIdx+1;

    const onFileSelect = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        const imgTag = document.getElementById(`img${idx}`);
        const newFile = new File([file], `image ${imgIdx}`, {
            lastModified: Date.now(),
            type: file.type
        })
        imgTag.title = file.name;

        reader.onload = (event) => {
            imgTag.src = event.target.result;
        }

        reader.readAsDataURL(file);
        setNewImg(newFile);
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        setSpinner(true);

        const formData = new FormData();
        formData.append('data', JSON.stringify({ title: product.title, category: product.category, imgIdx }));
        formData.append('photo', newImg);

        await fetch('https://boxdelabonita-server.onrender.com/add-new-img', {
            method: 'POST',
            body: formData
        }).then(res => res.json()).then(data => {
            setSpinner(false);
            setStatus(data.status);
            setShowStatus(true);
        }).catch(err => {
            setSpinner(false);
            setStatus('error');
            setShowStatus(true);
        })
    }

    let displayStatus = null;

    if (status === 'success'){
        displayStatus = <div className={styles.statusContainer}>
            <h4 className={styles.heading4}>Upload Successfull</h4>
            <button className={styles.btn} onClick={(e) => {
                e.preventDefault();
                setShowStatus(false);
                setSpinner(false);
            }}>Ok</button>
        </div>
    }
    else {
        displayStatus = <div className={styles.statusContainer}>
            <h4 className={styles.heading4}>Failed</h4>
            <button className={styles.btn} onClick={(e) => {
                e.preventDefault();
                setShowStatus(false);
                setSpinner(false);
            }}>Ok</button>
        </div>
    }

    return (
        <form encType='multipart/form-data' onSubmit={submitHandler} className={styles.addMoreImgContainer}>
            <div className={styles.displayStatusContainer} style={showStatus ? {display: 'flex'} : {display: 'none'}}>
                {displayStatus}
            </div>
            <div className={styles.newImgContainer}>
                <img id={`img${idx}`} src={addPhoto} alt="new img" className={styles.newImg}/>
            </div>
            <div className={styles.inputContainer}>
                <input type='file' className={styles.input} onChange={onFileSelect}/>
                <button type='submit' className={styles.submitBtn}>{
                    spinner ? <FontAwesomeIcon icon={faSpinner} spinPulse className={styles.spinner}/>
                    :
                    'Add Image'
                }</button>
            </div>
        </form>
    )
}

export default AddMoreImg;
