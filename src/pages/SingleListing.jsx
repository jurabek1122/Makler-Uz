import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getDoc, doc } from 'firebase/firestore'
import { getAuth } from 'firebase/auth';
import { db } from '../firebase.config';
import Spinner from '../components/Spinner';
import shareIcon from '../assets/svg/shareIcon.svg';
import { BsFillPersonFill } from 'react-icons/bs';
import { MdPhoneEnabled } from 'react-icons/md';
import { ImLocation } from 'react-icons/im';
import { BiTime } from 'react-icons/bi';
import { Navigation, Pagination, Scrollbar, A11y, Autoplay } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar'; 
import { useTranslation } from 'react-i18next';

const SingleListing = () => {
    const [listing, setListing] = useState(null)
    const [loading, setLoading] = useState(true)
    const [sharedLinkCopied, setSharedLinkCopied] = useState(false)
    const { t } = useTranslation()

    const navigate = useNavigate()
    const params = useParams()
    const auth = getAuth()

    useEffect(() => {
        const fetchListing = async () => {
            const docRef = doc(db, 'listings', params.listingId)

            const docSnap = await getDoc(docRef)

            if(docSnap.exists()) {
                setListing(docSnap.data())
                setLoading(false)
            }
        }
        fetchListing()
    }, [navigate, params.listingId])
    if(loading) {
        return <Spinner />
    }

    return (
        <main>
            <div className="detailTop">
                <Swiper
                    modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay]}
                    slidesPerView={1}
                    navigation
                    pagination={{ clickable: true }}
                    scrollbar={{ draggable: true }}
                    className='detailSwiper'
                    >
                        {listing.imgUrls.map((url, index) => (
                            <SwiperSlide key={index}>
                                <div >
                                    <img className='swiperSlideImg' src={url} alt="img" />
                                </div>
                            </SwiperSlide>
                        ))}
                </Swiper>
                <div className="detailContact">
                    <p><BsFillPersonFill /> {t('owner')}: {listing.firstname}</p>
                    <p><MdPhoneEnabled /> {t('contact')}: {listing.phoneNumber}</p>
                    <p><ImLocation /> {t('address')}: {listing.address}</p>
                    <div className='d-f'>
                        <BiTime />
                        <p>{listing?.timestamp?.seconds ? `${new Date(listing.timestamp.seconds *
                        1000).toLocaleString('en-GB', {timeZone: 'GMT'}).slice(0, 10)}` : 'null'}</p>
                    </div>
                </div>
            </div>
            <div className="shareIconDiv" onClick={() => {
                navigator.clipboard.writeText(window.location.href)
                setSharedLinkCopied(true)
                setTimeout(() => {
                    setSharedLinkCopied(false)
                }, 2000)
            }}>
                <img src={shareIcon} alt="share icon" />
            </div>
            {sharedLinkCopied && <p className='linkCopied'>{t('link_copied')}</p>}
            <div className="listingDetails">
                <p className="listingName">
                        {listing.rooms}-{t('n_rooms')}. {listing.type2 === 'appartment'
                        ? `${t('appartment')}` : `${t('house')}`}, {listing.floor}
                        {listing.numberfloors && `/${listing.numberfloors}`} {t('floor')}, {listing.square} {t('m²')}
                    - $ {listing.offer ? 
                        listing.discountedPrice
                        .toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') :
                        listing.regularPrice
                        .toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                    }
                </p>
                <p className="listingLocat">{t('address')}: {listing.address}</p>
                <p className="listingType">
                    {listing.type === 'rent' ? `${t('for_rent')}` : `${t('for_sale')}`}
                </p>
                {listing.offer && (
                    <p className="discountPrice">
                        $ {listing.regularPrice - listing.discountedPrice} {t('discount')}
                    </p>
                )}
                
                <div className="listingDetailsList">
                    <p>{t('rooms')}: {listing.rooms}</p>
                    <p>{t('square')}: {listing.square} {t('m²')}</p>
                    <p>{t('bathrooms')}: {listing.bathrooms}</p>
                    <p>{t('floor')}: {listing.floor}</p>
                    {listing.numberfloors && (
                        <p>{t('number_floors')}: {listing.numberfloors}</p>
                    )}
                    <p>{t('furnished')}: {listing.furnished ? `${t('yes')}` : `${t('no')}`}</p>
                    <p>{t('parking')}: {listing.parking ? `${t('yes')}` : `${t('no')}`}</p>
                    <p>{t('infrastructure')}: {listing.infrastructure}</p>
                </div>
                <hr />
                <h3>{t('description')}</h3>
                <p>{listing.description}</p>
                {/* {auth.currentUser.uid !== listing.userRef && (
                    <Link to={`/contact/${listing.userRef}?listingName=${listing.name}`} className='primaryButton'>
                        {t('contact')}
                    </Link>
                )} */}
            </div>
        </main>
    );
};


export default SingleListing;