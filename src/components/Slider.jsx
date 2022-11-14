import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase.config';
import { Navigation, Pagination, Scrollbar, A11y, Autoplay } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar'; 
import Spinner from './Spinner';
import { useTranslation } from 'react-i18next';

const Slider = () => {

    const [loading, setLoading] = useState(true)
    const [listings, setListings] = useState(null)
    const navigate = useNavigate()
    const { t } = useTranslation()

    useEffect(() => {
        const fetchListings = async () => {
            const listingRef = collection(db, 'listings')
            const q = query(listingRef, orderBy('timestamp', 'desc'), limit(5))
            const querySnap = await getDocs(q)
    
            const listings = []
    
            querySnap.forEach((doc) => {
                return listings.push({
                    id: doc.id,
                    data: doc.data()
                })
            })
            setListings(listings)
            setLoading(false)
        }
       fetchListings()
    }, [])

    if(loading) {
        return <Spinner />
    }

    return listings && (
        <>
            <p className="exploreHeading">{t('new')}</p>

            <Swiper
                modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay]}
                slidesPerView={1}
                navigation
                pagination={{ clickable: true }}
                scrollbar={{ draggable: true }}
                className='swiperSlideDiv'
                >
                    {listings.map(({data, id}) => (
                        <SwiperSlide key={id} onClick={() => navigate(`/category/${data.type}/${id}`)}>
                            <div className='swiperSlideDiv'>
                                <img className='swiperSlideImg' src={data.imgUrls[0]} alt="img" />
                            </div>
                        </SwiperSlide>
                    ))}
            </Swiper>
        </>
    )
}

export default Slider