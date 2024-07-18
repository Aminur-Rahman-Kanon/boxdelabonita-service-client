import React, { useState } from 'react';
import styles from './addPhoto.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';

const AddPhoto = ({ idx, product, updateImgCount }) => {

    const [img, setImg] = useState(null);
    const [imgId, setImgId] = useState('');
    const [submitBtnSpinner, setSubmitBtnSpinner] = useState(false);
    const [status, setStatus] = useState('');
    const [successSubmit, setSuccessSubmit] = useState(false);

    const [removeBtnSpinner, setRemoveBtnSpinner] = useState(false);
    const [removeStatus, setRemoveStatus] = useState('');
    const [removeImgStatus, setRemoveImgStatus] = useState(false);

    const submitHandler = async (e) => {
        e.preventDefault();
        setSubmitBtnSpinner(true);

        let fileExt = img.name.split('.').at(-1);
        if (fileExt !== 'jpg' || fileExt !== 'jpeg'){
            fileExt = 'jpg';
        }
        const randomHex = randomHexNumber();
        const imgId = `image_${randomHex}.${fileExt}`
        const newFile = new File([img], imgId, {
            dateModified: Date.now(),
            type: img.type
        });

        setImgId(imgId);

        const formData = new FormData();

        formData.append('data', JSON.stringify(product));
        formData.append('photo', newFile);

        //upload to server
        await fetch('https://boxdelabonita-server.onrender.com/upload-new-img', {
            method: 'POST',
            body: formData
        }).then(res => res.json()).then(result => {
            setSubmitBtnSpinner(false);
            if (result.status === 'success'){
                setStatus('success');
                setSuccessSubmit(true);
            }
            else {
                setStatus('failed');
                setSuccessSubmit(true);
            }
        }).catch(err => {
            setSubmitBtnSpinner(false);
            setStatus('failed');
            setSuccessSubmit(true);
        });
    }

    const removeImgHandler = async (e) => {
        e.preventDefault();
        // setRemoveBtnSpinner(true);

        //submiting to the server
        await fetch('https://boxdelabonita-server.onrender.com/remove-img',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ category: product.category, title: product.title, imgId })
        }).then(res => res.json()).then(result => {
            if (result.status === 'success'){
                setRemoveBtnSpinner(false);
                updateImgCount((imgCount) => imgCount -1);
                return toast.success(`${imgId} removed`);
            }
            else {
                setRemoveBtnSpinner(false);
                setSuccessSubmit(false);
                setRemoveStatus('failed');
                setRemoveImgStatus(true);
            }
        }).catch(err => {
            setRemoveBtnSpinner(false);
            setStatus('failed');
            setRemoveImgStatus(true);
        })
    }

    
    const randomHexNumber = () => {
        // Generate a random number and convert it to hexadecimal string representation.
        const n = (Math.random() * 0xfffff * 1000000).toString(16);
        // Return the hexadecimal color code with '#' appended.
        return n.slice(0, 10);
    };

    let statusDisplay;
    if (status === 'success' && successSubmit){
        statusDisplay = <span style={{color: 'green', fontSize: '13px'}}>
            {`${imgId} uploaded to server`}
        </span>
    }
    else if (status === 'failed' && successSubmit){
        statusDisplay = <span style={{color: 'red', fontSize: '13px'}}>
            {`${imgId} failed to upload`}
        </span>
    }
    else if (removeStatus === 'success' && removeImgStatus){
        statusDisplay = <span style={{color: 'green', fontSize: '13px'}}>
            {`${imgId} deleted`}
        </span>
    }
    else if (removeStatus === 'failed' && removeImgStatus){
        statusDisplay = <span style={{color: 'red', fontSize: '13px'}}>
            {`${imgId} failed to delete`}
        </span>
    }

    return (
        <>
        <div className={styles.addPhotoContainer}>
            <label htmlFor='photo' className={styles.label}>{`Add Image ${idx+1}`}</label>
            <div className={styles.inputs}>
                <input type='file' className={styles.input} onChange={(e) => setImg(e.target.files[0])}/>
                <button disabled={!img}
                        className={styles.btn}
                        onClick={submitHandler}>{
                            submitBtnSpinner ? <FontAwesomeIcon icon={ faSpinner } spinPulse color='white'/>
                            :
                            'Add Image'
                        }
                </button>
            </div>
            <div className={styles.checkContainer} style={status ? {display:'flex'} : {display: 'none'}}>
                <div className={styles.statusDisplay} style={successSubmit || removeImgStatus ? {display: 'flex'} : {display: 'none'}}>
                    {statusDisplay}
                </div>
                <button className={styles.removeBtn}
                        style={status === 'success' || removeStatus ? {display: 'block'} : {display: 'none'}}
                        disabled={!successSubmit}
                        onClick={removeImgHandler}>{
                    removeBtnSpinner ? <FontAwesomeIcon icon={faSpinner} spinPulse color="white" />
                    :
                    'Remove'
                    }</button>
            </div>
        </div>
        </>
    )
}

export default AddPhoto;
