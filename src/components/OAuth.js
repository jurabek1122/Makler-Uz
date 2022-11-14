import { useLocation, useNavigate} from 'react-router-dom';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase.config';
import { toast } from 'react-toastify';
import googleIcon from '../assets/svg/googleIcon.svg'; 
import { useTranslation } from 'react-i18next';

const OAuth = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const { t } = useTranslation()

    const onGoogleClick = async () => {
        try {
            const auth = getAuth()
            const provider = new GoogleAuthProvider()
            const result = await signInWithPopup(auth, provider)
            const user = result.user

            const docRef = doc(db, 'users', user.uid)
            const docSnap = await getDoc(docRef)

            if(!docSnap.exists()) {
                await setDoc(doc(db, 'users', user.uid), {
                    name: user.displayName,
                    email: user.email,
                    timestamp: serverTimestamp()
                })
            }
            navigate('/profile')
        } catch (error) {
            toast.error(`${t('could_not_authorized_with_google')}`)
            console.log(error)
        }
    }
    return (
        <div className='socialLogin'>
            <p>{location.pathname === '/sign-in' ? `${t('sign_in_with')}` : `${t('sign_up_with')}`}</p>
            <button className='socialIconDiv' onClick={onGoogleClick}>
                <img className='socialIconImg' src={googleIcon} alt='google' />
            </button>
        </div>
    );
};

export default OAuth;