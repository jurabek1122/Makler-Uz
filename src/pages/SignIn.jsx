import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ReactComponent as ArrowRightIcon } from '../assets/svg/keyboardArrowRightIcon.svg';
import visibilityIcon from '../assets/svg/visibilityIcon.svg';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { toast } from 'react-toastify';
import OAuth from '../components/OAuth';
import { useTranslation } from 'react-i18next';

const SignIn = () => {

    const [showPassword, setShowPassword] = useState()
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })
    const { t } = useTranslation()
    const { email, password } = formData
    const navigate = useNavigate()

    const onChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.id]: e.target.value
        }))
    }

    const onSubmit = async (e) => {
        
        try {
            e.preventDefault()

            const auth = getAuth()
            const userCredential = await signInWithEmailAndPassword(auth, email, password)
            if(userCredential.user) {
                navigate('/profile')
            }
        } catch(error) {
            toast.error(`${t('bad_user_credential')}`)
        }
    }

    return(
        <>
            <div className='pageContainer'>
                <header>
                    <p className="pageHeader">{t('welcome_back')}</p>
                </header>
                <form onSubmit={onSubmit}>
                    <input type="email" className="emailInput" placeholder='Email' 
                        id='email' value={email} onChange={onChange}
                    />
                    <div className="passwordInputDiv">
                        <input type={showPassword ? 'text' : 'password'} className="passwordInput" 
                        placeholder='Password' id='password' value={password} onChange={onChange}
                        /> 
                        <img src={visibilityIcon} alt="show password" className='showPassword'
                        onClick={() => setShowPassword(!showPassword)} />
                    </div>
                    <Link to='/forgot-password' className='forgotPasswordLink'>
                        {t('forgot_password')}
                    </Link>
                    <div className="signInBar">
                        <p className="signInText">{t('sign_in')}</p>
                        <button className="signInButton">
                            <ArrowRightIcon fill='#ffffff' width='34px' height='34px' />
                        </button>
                    </div>
                </form>
                <OAuth />
                <Link to='/sign-up' className='registerLinkIn'>
                    {t('sign_up_instead')}
                </Link>
            </div>
        </>
    )
}

export default SignIn