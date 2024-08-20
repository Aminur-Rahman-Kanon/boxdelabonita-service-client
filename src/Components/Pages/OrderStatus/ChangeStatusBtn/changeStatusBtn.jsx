import React, { useState } from 'react';
import styles from './changeStatusBtn.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';

const ChangeStatusBtn = ({ id, changeStatus, toggleCount, currentStatus, setChangeOrderStatus }) => {

    const [isLoading, setIsLoading] = useState(false);

    const submitStatusHandler = async () => {
        setIsLoading(true);
        await fetch('https://boxdelabonita.com/api/change-order-status', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id, status: changeStatus })
        })
        .then(res => res.json())
        .then(data => {
            if (data.status === 'success'){
                setChangeOrderStatus(changeStatus);
                setIsLoading(false);
                toast.success(`Order status changed to ${changeStatus}`);
                window.location.reload()
            }
            else {
                setIsLoading(false);
                return toast.warning('Something went wrong');
            }
        })
        .catch(err => {
            setIsLoading(false);
            return toast.error('Operation Failed');
        });
    }

    return (
        <button disabled={changeStatus === currentStatus} className={`${styles.actionBtn} ${styles[changeStatus]}`} onClick={submitStatusHandler}>
            {
                isLoading ? <FontAwesomeIcon icon={faSpinner} spinPulse className={styles.spinner}/>
                :
                `Mark as ${changeStatus}`
            }        
        </button>
    )
}

export default ChangeStatusBtn
