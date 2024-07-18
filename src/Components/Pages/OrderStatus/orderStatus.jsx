import React, { useEffect, useState } from 'react';
import styles from './orderStatus.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faList, faStar, faGear, faTruck, faRotateLeft, faX, faSpinner } from '@fortawesome/free-solid-svg-icons';
import ChangeStatusBtn from './ChangeStatusBtn/changeStatusBtn';
import { toast } from 'react-toastify';

const status = ['pending', 'processing', 'delivered', 'returned', 'canceled'];

const OrderStatus = () => {

    const [orders, setOrders] = useState([]);

    const [orderStatus, setOrderStatus] = useState('all orders');

    const [changeOrderStatus, setChangeOrderStatus] = useState('');

    const [newItems, setNewItems] = useState(0);

    const [count, setCount] = useState(0);

    const [deleteBtnSpinner, setDeleteBtnSpinner] = useState(false);

    useEffect(() => {
        fetch('https://boxdelabonita-server.onrender.com/fetch-placed-orders')
        .then(res => res.json())
        .then(data => {
            if (data.data){
                setOrders(data.data);
            }
        })
        .catch(err => {
            console.log(err);
        })
    }, [ changeOrderStatus ]);

    useEffect(() => {
        fetch('https://boxdelabonita-server.onrender.com/fetch-placed-orders')
        .then(res => res.json())
        .then(data => {
            if (data.data){
                let newItem = 0;
                data.data.forEach(newItm => {
                    if (newItm.orderInfo.orderStatus === 'pending'){
                        newItem ++;
                    }
                })
                setNewItems(newItem);
            }
        })
        .catch(err => {
            console.log(err);
        })
    }, [count])

    const deleteOrderHandler = async (e, id) => {
        e.preventDefault();

        await fetch('https://boxdelabonita-server.onrender.com/delete-order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id })
        }).then(res => res.json()).then(result => {
            setDeleteBtnSpinner(false);
            if (result.status === 'success'){
                setTimeout(() => {
                    window.location.reload();
                }, 1200);
                return toast.success(`order ${id} removed`)
            }
            else {
                return toast.error(`order ${id} failed to remove`)
            }
        }).catch(err => {
            setDeleteBtnSpinner(false);
            return toast.error('Something went wrong!');
        })
    }


    const displayOrderStatus = orders.length ? orders.filter(prd => {
        if (orderStatus === 'all orders'){
            return prd;
        }
        else {
            return prd.orderInfo.orderStatus === orderStatus;
        }
    }).map((item, idx) => {
        return <div key={item._id} className={styles.orderContainer}>
            <div className={styles.infoContainer}>
                <span className={styles.customerInfo} style={{fontWeight: 'bold', fontSize: '14px'}}>{idx+1}</span>
                <div className={styles.orderElement}>
                    <h4 className={styles.heading4}>Order Info</h4>
                    <div className={styles.customerInfoContainer}>
                        <span className={styles.customerInfo}>Date: {item.orderInfo.dateTime}</span>
                        <span className={styles.customerInfo}>Order Id: {item.orderInfo.orderId}</span>
                        <span className={styles.customerInfo}>Order Status: {item.orderInfo.orderStatus}</span>
                        <span className={styles.customerInfo}>Payment Method: {item.orderInfo.paymentMethod}</span>
                        <span className={styles.customerInfo}>Delivery Charge: {item.orderInfo.deliveryCharge}</span>
                        <span className={styles.customerInfo}>Grand Total: {item.orderInfo.totalPrice + item.orderInfo.deliveryCharge}</span>
                    </div>
                </div>
                <div className={styles.orderElement}>
                    <h4 className={styles.heading4}>Customer Info</h4>
                    <div className={styles.customerInfoContainer}>
                        <span className={styles.customerInfo}>Name: {item.customerInfo.name}</span>
                        <span className={styles.customerInfo}>Email: {item.customerInfo.email}</span>
                        <span className={styles.customerInfo}>Phone: {item.customerInfo.phone}</span>
                        <span className={styles.customerInfo}>Address: {item.customerInfo.address}</span>
                        <span className={styles.customerInfo}>City: {item.customerInfo.city}</span>
                        {/* <span className={styles.customerInfo}>Area: {item.customerInfo.area}</span> */}
                    </div>
                </div>
            </div>
            <div className={styles.productContainer}>
                <h4 className={styles.heading4}>Products</h4>
                <div className={styles.products}>
                    {
                        Object.values(item.products).map(prd => <div key={prd._id} className={styles.product}>
                            <div className={styles.imgContainer}>
                                <img src={prd.product.img[0]} alt="product" className={styles.productImg} />
                            </div>
                            <div className={styles.productDetailsContainer}>
                                <div className={styles.colorContainer}>
                                    <span className={styles.customerInfo}>Color: </span>
                                    <div className={styles.colors}>
                                        {prd.color.map((clr, idx) => <span key={idx} className={styles.color} style={{backgroundColor : `${clr}`}}></span>)}
                                    </div>
                                </div>
                                <span className={styles.customerInfo}>Title: {prd.product.title}</span>
                                <span className={styles.customerInfo}>Quantity: {prd.quantity}</span>
                                <span className={styles.customerInfo}>Price: {prd.price}</span>
                                <span className={styles.customerInfo}>Item Total: {prd.quantity * prd.price}</span>
                            </div>
                        </div>)
                    }
                </div>
            </div>
            <div className={styles.actionContainer}>
                {status.map((btn, idx) => <ChangeStatusBtn key={idx} id={item._id} toggleCount={setCount} changeStatus={btn} currentStatus={item.orderInfo.orderStatus} setChangeOrderStatus={setChangeOrderStatus}/>)}
            </div>
            <div className={styles.deleteBtnContainer}>
                <button className={styles.deleteBtn} onClick={(e) => deleteOrderHandler(e, item._id)}>
                    {deleteBtnSpinner ? <FontAwesomeIcon icon={faSpinner} spinPulse color='white' />
                    :
                    'Delete Order'}
                </button>
            </div>
        </div>
    })
    :
    <div>
        <h2>No Item</h2>
    </div>

    return (
        <div className={styles.orderStatusContainer}>
            <div className={styles.sidebar}>
                <div className={orderStatus === 'all orders' ? `${styles.sidebarItem} ${styles.active}` : styles.sidebarItem} onClick={() => setOrderStatus('all orders')}>
                    <span className={styles.sidebarItemP}>All orders</span>
                    <FontAwesomeIcon icon={faList} className={styles.sidebarIcon}/>
                </div>
                <div className={orderStatus === 'pending' ? `${styles.sidebarItem} ${styles.active}` : styles.sidebarItem} onClick={() => setOrderStatus('pending')}>
                    <span className={styles.sidebarItemP}>New orders</span>
                    <FontAwesomeIcon icon={faStar} className={styles.sidebarIcon}/>
                    <div className={styles.orderCountContainer}>{newItems}</div>
                </div>
                <div className={orderStatus === 'processing' ? `${styles.sidebarItem} ${styles.active}` : styles.sidebarItem} onClick={() => setOrderStatus('processing')}>
                    <span className={styles.sidebarItemP}>In process orders</span>
                    <FontAwesomeIcon icon={faGear} className={styles.sidebarIcon}/>
                </div>
                <div className={orderStatus === 'delivered' ? `${styles.sidebarItem} ${styles.active}` : styles.sidebarItem} onClick={() => setOrderStatus('delivered')}>
                    <span className={styles.sidebarItemP}>Delivered orders</span>
                    <FontAwesomeIcon icon={faTruck} className={styles.sidebarIcon}/>
                </div>
                <div className={orderStatus === 'returned' ? `${styles.sidebarItem} ${styles.active}` : styles.sidebarItem} onClick={() => setOrderStatus('returned')}>
                    <span className={styles.sidebarItemP}>Returned orders</span>
                    <FontAwesomeIcon icon={faRotateLeft} className={styles.sidebarIcon}/>
                </div>
                <div className={orderStatus === 'canceled' ? `${styles.sidebarItem} ${styles.active}` : styles.sidebarItem} onClick={() => setOrderStatus('canceled')}>
                    <span className={styles.sidebarItemP}>Canceled orders</span>
                    <FontAwesomeIcon icon={faX} className={styles.sidebarIcon}/>
                </div>
            </div>
            <div className={styles.displayOrderStatus}>
                {displayOrderStatus}
            </div>
        </div>
    )
}

export default OrderStatus
