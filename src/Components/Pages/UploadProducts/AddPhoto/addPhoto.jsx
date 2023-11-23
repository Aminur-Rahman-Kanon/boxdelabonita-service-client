import React, { useState } from 'react';
import styles from './addPhoto.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

const AddPhoto = ({ addImage, image, idx }) => {

    const [img, setImg] = useState(null);
    const [added, setAdded] = useState(false);

    const submitHandler = (e) => {
        e.preventDefault();
        const newFile = new File([img], `image ${idx+1}`, {
            dateModified: Date.now()
        });

        const originalImgObj = [...image];
        originalImgObj[idx] = newFile;
        console.log(originalImgObj);
        addImage(originalImgObj);
        setAdded(true);
    }

    return (
        <div className={styles.addPhotoContainer}>
            <div className={styles.checkContainer} style={added ? {display:'flex'} : {display: 'none'}}>
                <FontAwesomeIcon icon={faCheck} className={styles.check}/>
            </div>
            <label htmlFor='photo' className={styles.label}>{`Add Image ${idx+1}`}</label>
            <div className={styles.inputs}>
                <input type='file' className={styles.input} onChange={(e) => setImg(e.target.files[0])}/>
                <button disabled={!img} className={styles.btn} onClick={submitHandler}>Add Image</button>
            </div>
        </div>
    )
}

export default AddPhoto;
