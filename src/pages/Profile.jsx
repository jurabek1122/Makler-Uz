import { useState, useEffect } from 'react';
import { getAuth, updateProfile } from 'firebase/auth';
import { updateDoc, doc, collection, getDocs, query, orderBy, where, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase.config';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import arrowRight from '../assets/svg/keyboardArrowRightIcon.svg';
import homeIcon from '../assets/svg/homeIcon.svg';
import Listing from '../components/Listing';
import Spinner from '../components/Spinner';
import { useTranslation } from 'react-i18next';

const Profile = () => {
    const [loading, setLoading] = useState(true)
    const [listings, setListings] = useState([])
    const [changeDetails, setChangeDetails] = useState(false)
    const auth = getAuth()
    const { t } = useTranslation()

    const [formData, setFormData] = useState({
        name: auth.currentUser.displayName,
        email: auth.currentUser.email
    })

    const { name, email } = formData

    const navigate = useNavigate()

    useEffect(() => {
        const fetchUserListings = async () => {
            const listingRef = collection(db, 'listings')

            const q = query(listingRef, where('userRef', '==', auth.currentUser.uid),
            orderBy('timestamp', 'desc'))

            const querySnap = await getDocs(q)
            let listings = []
            querySnap.forEach((doc) => {
                return listings.push({
                    id: doc.id,
                    data: doc.data()
                })
            })

            setListings(listings)
            setLoading(false)
        }
        fetchUserListings()
    }, [auth.currentUser.uid])

    const onLogOut = () => {
        auth.signOut()
        navigate('/sign-in')
    }

    const onSubmit = async () => {
        try {
            if(auth.currentUser.displayName !== name) {
                await updateProfile(auth.currentUser, {
                    displayName: name
                })

                const userRef = doc(db, 'users', auth.currentUser.uid)
                await updateDoc(userRef, {
                    name
                })
            }
        } catch (error) {
            toast.error(`${t('could_not_update_profile_details')}`)
        }
    }

    const onChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.id]: e.target.value
        }))
    }
    
    const onDelete = async (listingId) => {
        await deleteDoc(doc(db, 'listings', listingId))
        const updatedListings = listings.filter((listing) => listing.id !== listingId)
        setListings(updatedListings)
        toast.success(`${t('successfully_deleted_listing')}`)
    }

    const onEdit = (listingId) => navigate(`/edit-listing/${listingId}`)

    if(loading) {
        return <Spinner />
    }
    return(
        <div className='profile'>
            <header className="profileHeader">
                <p className="pageHeader">{t('my_profile')}</p>
                <button className="logOut" type='button' onClick={onLogOut}>
                {t('logout')}
                </button>
            </header>
            <main>
                <div className="profileDetailsHeader">
                    <p className="profileDetails">{t('personal_details')}</p>
                    <p className="changePersonalDetails" onClick={() => {
                        changeDetails && onSubmit()
                        setChangeDetails(!changeDetails)
                    }}>
                        {changeDetails ? `${t('done')}` : `${t('change')}`}
                    </p>
                </div>
                <div className="profileCard">
                    <form>
                        <input 
                            type="text" 
                            id="name" 
                            className={!changeDetails ? 'profileName' : 'profileNameActive' } 
                            disabled={!changeDetails}
                            value={name}
                            onChange={onChange}
                        />
                        <input 
                            type="text" 
                            id="email" 
                            className={!changeDetails ? 'profileEmail' : 'profileEmailActive' } 
                            disabled={!changeDetails}
                            value={email}
                            onChange={onChange}
                        />
                    </form>
                </div>
                <Link to='/create-listing' className='createListing'>
                    <img src={homeIcon} alt="home" />
                    <p>{t('sell_or_rent_your_home')}</p>
                    <img src={arrowRight} alt="arrow right" />
                </Link>
                {listings.length > 0 && (
                    <>
                        <p className="listingText">{t('your_listings')}</p>
                        <ul className="listingsList">
                            {listings.map((listing) => (
                                <Listing 
                                    key={listing.id}
                                    listing={listing.data}
                                    id={listing.id}
                                    onDelete={() => onDelete(listing.id)}
                                    onEdit={() => onEdit(listing.id)}
                                />
                            ))}
                        </ul>
                    </>
                )}
            </main>
        </div>
    )
}

export default Profile