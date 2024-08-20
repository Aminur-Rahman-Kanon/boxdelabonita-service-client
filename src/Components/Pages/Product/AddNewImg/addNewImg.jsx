import React, { useState } from 'react';
import styles from '../ProductContainer/productContainer.module.css';
import addPhoto from '../../../../Assets/addPhoto.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

function AddNewImg({ id, category, title }) {
    const [imgTitle, setImgTitle] = useState('');
    const [img, setImg] = useState(addPhoto);
    const [status, setStatus] = useState('');
    const [displayStatus, setDisplayStatus] = useState(false);
    const [displayAddPhoto, setDisplayAddPhoto] = useState(false);
    const [spinner, setSpinner] = useState(false);
    
    const addImgHandler = async (e) => {
        e.preventDefault();
        setSpinner(true);
        try {
            if (imgTitle && img && title) {
                const formData = new FormData();
                formData.append('data', JSON.stringify({ title, category }))
                formData.append('photo', img);
                await fetch('https://boxdelabonita.com/api/add-photo', {
                    method: 'POST',
                    
                    body: formData
                }).then(res => res.json()).then(data => {
                    setSpinner(false);
                    setStatus('success');
                    setDisplayStatus(true);
                }).catch(err => {
                    setSpinner(false);
                    setStatus('failed');
                    setDisplayStatus(true);
                })
            }
        } catch (error) {
            setSpinner(false);
            setStatus('failed');
            setDisplayStatus(true);
        }
    }

    const onFileSelect = (e, id) => {
        const img = e.target.files[0];
        const file = new File([img], `${imgTitle}`, {
            dateModified: Date.now(),
            type: img.type
        })

        
        setImg(file);
        const reader = new FileReader();
        const imgTag = document.getElementById(id);
        imgTag.title = img.name;
        reader.onload  = (e) => {
            imgTag.src = e.target.result;
        }

        reader.readAsDataURL(img);
    }

    const displayStatusMsg = status === 'success' ? <span className={styles.statusMsg}>Image added</span> : <span className={styles.statusMsg}>Failed! try again</span>


    return (
        <section className={styles.addNewImgMain}>
            <form encType='multipart-form-data' className={styles.imgs}>
                <div className={styles.imgContainer}>
                    <img id={String(id)} src={addPhoto} alt="img" className={styles.img}/>
                </div>
                <div className={displayAddPhoto ? `${styles.addNewImgContainer} ${styles.showContainer}` : styles.addNewImgContainer}>
                    <div className={displayStatus ? `${styles.displayStatus} ${styles.show}` : styles.displayStatus}
                        style={status === 'success' ? {backgroundColor: 'green'} : {backgroundColor: '#bb0202'}}>
                        {displayStatusMsg}
                    </div>
                    <div className={styles.newImgDetailsContainer}>
                        <input type='text'
                            className={styles.newImgInput}
                            onChange={(e) => setImgTitle(e.target.value)}
                            placeholder='Color'/>
                        <input type='file' accept='image/png, image/jpeg' className={styles.newImgFileInput} onChange={(e) => onFileSelect(e, id)}/>
                        <button className={styles.addImgBtn}
                                onClick={addImgHandler}
                                disabled={!imgTitle || img === addPhoto}>{
                                    spinner ? <FontAwesomeIcon icon={faSpinner} spinPulse className={styles.spinner}/> : 'Add Photo'
                                }</button>
                    </div>
                </div>
                <div className={styles.imgOptionContainer} style={displayAddPhoto ? {display: 'none'} : {display: 'block'}}>
                    <div className={styles.addPhotoBtn}
                            onClick={() => {
                                setDisplayAddPhoto(true)
                            }}>Add Photo</div>
                </div>
            </form>
        </section>
    )
}

export default AddNewImg
