import React, { useState } from 'react';
import styles from './login.module.css';
import cookies from '../../Others/Cookies/cookies';
import Spinner from '../../Others/Spinner/spinner';
import Modal from '../../Others/Modal/modal';

function Login() {
    
    const cookie = cookies.get('token');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [spinner, setSpinner] = useState(false);
    const [status, setStatus] = useState('');
    const [modal, setModal] = useState(false);

    const submitHandler = async (event) => {
        event.preventDefault();
        setSpinner(true);
    
        await fetch('https://boxdelabonita.com/api/admin-login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        }).then(res => res.json()).then(data => {
            if (data.status === 'success'){
                cookies.set('token', data.data);
                setSpinner(false);
                return window.location.assign('/welcome');
            }
            else {
                setSpinner(false);
                setStatus(data.status);
                setModal(true)
            }
        }).catch(err => console.log(err));
    }

    if (cookie !== undefined) return window.location.href = '/welcome';

    const statusMsg = <div className={styles.statusMsg}>
        <h2 className={styles.headerMedium}>{status}</h2>
        <span className={styles.textBlackSmall}>Please try again</span>
        <button className={styles.statusBtn}
                onClick={() => {
                    setStatus('');
                    setModal(false);
                }}>Ok</button>
    </div>

    return (
        <>
        <Modal modal={modal}>
            {statusMsg}
        </Modal>
        <Spinner spinner={spinner} />
        <section className={styles.loginContainerMain}>
            <div className={styles.loginContainer}>
                <h4 className={styles.loginH4}>Please login to continue</h4>
                <form className={styles.loginForm} onSubmit={submitHandler}>
                    <fieldset className={styles.formInputContainer}>
                        <label htmlFor="email" className={styles.label}>Email</label>
                        <input type="email"
                            className={styles.input}
                            placeholder="Email address"
                            id="email"
                            onChange={(e) => setEmail(e.target.value)}/>
                    </fieldset>
                    <fieldset className={styles.formInputContainer}>
                        <label htmlFor="password" className={styles.label}>Password</label>
                        <input type="password"
                            className={styles.input}
                            placeholder="Password"
                            id="password"
                            onChange={(e) => setPassword(e.target.value)}/>
                    </fieldset>
                    <input disabled={!email || !password} type="submit" value="Login" className={styles.loginBtn} id="login-btn"/>
                </form>
            </div>
        </section>
        </>
    )
}

export default Login
