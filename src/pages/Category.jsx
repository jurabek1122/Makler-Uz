import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { collection, getDocs, where, limit, orderBy, query, startAfter } from 'firebase/firestore';
import { db } from '../firebase.config';
import { toast } from 'react-toastify';
import Spinner from '../components/Spinner';
import Listing from '../components/Listing';
import { useTranslation } from 'react-i18next';
import Filters from '../components/Filters';

const Category = () => {

    const [listings, setListings] = useState([])
    const [filtered, setFiltered] = useState([])
    const [loading, setLoading] = useState(true)
    const [lastFetchedListing, setLastFetchedListing] = useState(null)
    const { t } = useTranslation()

    const params = useParams()

    useEffect(() => {
        const fetchListings = async () => {
            try {
                const listingRef = collection(db, 'listings')
                const q = query(listingRef, 
                    where('type', '==', params.categoryName),
                    orderBy('timestamp', 'desc'),
                    limit(10)
                    )
                const querySnap = await getDocs(q)
                const lastVisible = querySnap.docs[querySnap.docs.length - 1]
                setLastFetchedListing(lastVisible)
                
                const listings = []
                querySnap.forEach((doc) => {
                    return listings.push({
                        id: doc.id,
                        data: doc.data()
                    })
                })
                setListings(listings)
                setLoading(false)

            } catch (error) {
                toast.error(`${t('could_not_fetch_listings')}`)
            }
        }
        fetchListings()
    }, [params.categoryName])

    const onLoadMoreListings = async () => {
        try {
            const listingRef = collection(db, 'listings')
            const q = query(listingRef, 
                where('type', '==', params.categoryName),
                orderBy('timestamp', 'desc'),
                startAfter(lastFetchedListing),
                limit(10)
                )
            const querySnap = await getDocs(q)
            
            const listings = []
            querySnap.forEach((doc) => {
                return listings.push({
                    id: doc.id,
                    data: doc.data()
                })
            })
            
            const lastVisible = querySnap.docs[querySnap.docs.length - 1]
            setLastFetchedListing(lastVisible)
            setListings((prev) => [...prev, ...listings])
            setLoading(false)

        } catch (error) {
            toast.error(`${t('could_not_fetch_listings')}`)
        }
    }

    return (
        <div className='category'>
            <Filters setFiltered={setFiltered} listings={listings} />
            <header>
                <p className="pageHeader">
                    {params.categoryName === 'rent' ? `${t('pfrent')}` :
                    `${t('pfsale')}`}
                </p>
            </header>
            {loading ? (
            <Spinner />
            ) : listings && listings.length > 0 ? (
                <>
                    <main>
                        <ul className="categoryListings">
                            {filtered.map((listing) => (
                                <Listing 
                                    key={listing.id}
                                    id={listing.id}
                                    listing={listing.data}
                                />
                            ))}
                        </ul>
                    </main>
                    <br />
                    {filtered.length > 9 && lastFetchedListing && (
                        <button className='loadMore' onClick={onLoadMoreListings}>{t('load_more')}</button>
                    )}
                </>
            ) : (
                <p> {params.categoryName === 'sale' ? `${t('no_listings_for_sale')}` : `${t('no_listings_for_rent')}`}</p>
            )}
        </div>
    );
};

export default Category;