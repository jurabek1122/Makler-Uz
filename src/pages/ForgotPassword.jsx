import { useState } from 'react';
import { Link } from 'react-router-dom';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { toast } from 'react-toastify';
import { ReactComponent as ArrowRightIcon } from '../assets/svg/keyboardArrowRightIcon.svg';
import { useTranslation } from 'react-i18next';
import { auth } from '../firebase.config' 

const ForgotPassword = () => {

    const [email, setEmail] = useState('')
    const { t } = useTranslation()
    
    const onChange = (e) => {
        setEmail(e.target.value)
    }

    const onSubmit = (e) => {
        e.preventDefault()
            sendPasswordResetEmail(auth, email)
            .then(() => {
                toast.success(`${t('email_was_send_successfully')}`)
            }).catch((error) => {
                toast.error(`${t('could_not_send_reset_email')}`)
            })
    }
    return(
        <div className='pageContainer'>
            <header>
                <p className="pageHeader">{t('forgot_password')}</p>
            </header>
            <main>
                <form onSubmit={onSubmit}>
                    <input type="email" className="emailInput" 
                        placeholder='Email' id='email' value={email}
                        onChange={onChange}
                    />
                    <Link className="forgotPasswordLink" to='/sign-in'>
                        {t('sign_in')}
                    </Link>
                    <div className="signInBar">
                        <p className="signInText">{t('send_reset_link')}</p>
                        <button className="signInButton">
                            <ArrowRightIcon fill='#ffffff' width='34px' height='34px' />
                        </button>
                    </div>
                </form>
            </main>
        </div>
    )
}

export default ForgotPassword