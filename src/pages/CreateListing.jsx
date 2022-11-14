import { useState, useEffect, useRef } from 'react'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase.config'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { v4 as uuidv4 } from 'uuid';
import Spinner from '../components/Spinner';
import { useTranslation } from 'react-i18next';

function CreateListing() {

  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    type: 'rent',
    type2: 'appartment',
    firstname: '',
    phoneNumber: '',
    rooms: 1,
    floor: 1,
    numberfloors: 1,
    square: 1,
    bathrooms: 1,
    parking: false,
    furnished: false,
    address: '',
    infrastructure: '',
    description: '',
    offer: false,
    regularPrice: 0,
    discountedPrice: 0,
    images: {},
  })

  const {
    type,
    type2,
    firstname,
    phoneNumber,
    square,
    rooms,
    floor,
    numberfloors,
    bathrooms,
    parking,
    furnished,
    address,
    infrastructure,
    description,
    offer,
    regularPrice,
    discountedPrice,
    images,
  } = formData

  const auth = getAuth()
  const navigate = useNavigate()
  const isMounted = useRef(true)

  useEffect(() => {
    if (isMounted) {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setFormData({ ...formData, userRef: user.uid })
        } else {
          navigate('/sign-in')
        }
      })
    }
    return () => {
      isMounted.current = false
    }
  }, [isMounted])

  const onSubmit = async (e) => {
    e.preventDefault()

    setLoading(true)

    if (discountedPrice >= regularPrice) {
      setLoading(false)
      toast.error(`${t('toast_error_discount')}`)
      return
    }

    if (images.length > 6) {
      setLoading(false)
      toast.error(`${t('max_6_images')}`)
      return
    }

    const storeImage = async (image) => {
        return new Promise((resolve, reject) => {
            const storage = getStorage()
            const fileName = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`

            const storageRef = ref(storage, 'images/' + fileName)
            const uploadTask = uploadBytesResumable(storageRef, image);

            uploadTask.on('state_changed', 
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log('Upload is ' + progress + '% done');
                    switch (snapshot.state) {
                    case 'paused':
                        console.log('Upload is paused');
                        break;
                    case 'running':
                        console.log('Upload is running');
                        break;
                    }
                }, 
                (error) => {
                    reject(error)
                }, 
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    resolve(downloadURL);
                    });
                }
                );
        })
    }

    const imgUrls = await Promise.all(
        [...images].map((image) => storeImage(image))
    ).catch(() => {
        setLoading(false)
        toast.error(`${t('images_not_loaded')}`)
        return
    })

    const formDataCopy = {
        ...formData,
        imgUrls,
        timestamp: serverTimestamp()
    }
    delete formDataCopy.images
    !formDataCopy.offer && delete formDataCopy.discountedPrice

    const docRef = await addDoc(collection(db, 'listings'), formDataCopy)
    setLoading(false)
    toast.success(`${t('listing_saved')}`)
    navigate(`/category/${formDataCopy.type}/${docRef.id}`)
  }

  const onMutate = (e) => {
    let boolean = null

    if (e.target.value === 'true') {
      boolean = true
    }
    if (e.target.value === 'false') {
      boolean = false
    }

    if (e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        images: e.target.files,
      }))
    }

    if (!e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.id]: boolean ?? e.target.value,
      }))
    }
  }

  if (loading) {
    return <Spinner />
  }

  return (
    <div className='profile'>
      <header>
        <p className='pageHeader'>{t('create_listing')}</p>
      </header>

      <main>
        <form onSubmit={onSubmit}>
          <label className='formLabel'>{t('sell')} / {t('rent')}</label>
          <div className='formButtons'>
            <button
              type='button'
              className={type === 'sale' ? 'formButtonActive' : 'formButton'}
              id='type'
              value='sale'
              onClick={onMutate}
            >
              {t('sell')}
            </button>
            <button
              type='button'
              className={type === 'rent' ? 'formButtonActive' : 'formButton'}
              id='type'
              value='rent'
              onClick={onMutate}
            >
              {t('rent')}
            </button>
          </div>

          <label className='formLabel'>{t('appartment')} / {t('house')}</label>
          <div className='formButtons'>
            <button
              type='button'
              className={type2 === 'appartment' ? 'formButtonActive' : 'formButton'}
              id='type2'
              value='appartment'
              onClick={onMutate}
            >
              {t('appartment')}
            </button>
            <button
              type='button'
              className={type2 === 'house' ? 'formButtonActive' : 'formButton'}
              id='type2'
              value='house'
              onClick={onMutate}
            >
              {t('house')}
            </button>
          </div>

          <label className='formLabel'>{t('floor')}</label>
              <input
                className='formInputSmall'
                type='number'
                id='floor'
                value={floor}
                onChange={onMutate}
                min='1'
                max='100'
                required
              />

          {type2 === 'appartment' && (
            <>
            <label className='formLabel'>{t('number_floors')}</label>
              <input
                className='formInputSmall'
                type='number'
                id='numberfloors'
                value={numberfloors}
                onChange={onMutate}
                min='1'
                max='100'
                required
              />
              </>
          )}

          <label className='formLabel'>{t('name')}</label>
          <input
            className='formInputName'
            type='text'
            id='firstname'
            value={firstname}
            onChange={onMutate}
            maxLength='32'
            minLength='3'
            required
          />

          <label className='formLabel'>{t('phone')}</label>
          <input
            className='formInputName'
            type='text'
            id='phoneNumber'
            value={phoneNumber}
            onChange={onMutate}
            maxLength='32'
            minLength='3'
            required
          />

          <label className='formLabel'>{t('square')}</label>
              <input
                className='formInputSmall'
                type='number'
                id='square'
                value={square}
                onChange={onMutate}
                min='1'
                max='500'
                required
              />
          
          <div className='formRooms flex'>
            <div>
              <label className='formLabel'>{t('rooms')}</label>
              <input
                className='formInputSmall'
                type='number'
                id='rooms'
                value={rooms}
                onChange={onMutate}
                min='1'
                max='50'
                required
              />
            </div>
            <div>
              <label className='formLabel'>{t('bathrooms')}</label>
              <input
                className='formInputSmall'
                type='number'
                id='bathrooms'
                value={bathrooms}
                onChange={onMutate}
                min='1'
                max='50'
                required
              />
            </div>
          </div>

          <label className='formLabel'>{t('parking')}</label>
          <div className='formButtons'>
            <button
              className={parking ? 'formButtonActive' : 'formButton'}
              type='button'
              id='parking'
              value={true}
              onClick={onMutate}
              min='1'
              max='50'
            >
              {t('yes')}
            </button>
            <button
              className={
                !parking && parking !== null ? 'formButtonActive' : 'formButton'
              }
              type='button'
              id='parking'
              value={false}
              onClick={onMutate}
            >
              {t('no')}
            </button>
          </div>

          <label className='formLabel'>{t('furnished')}</label>
          <div className='formButtons'>
            <button
              className={furnished ? 'formButtonActive' : 'formButton'}
              type='button'
              id='furnished'
              value={true}
              onClick={onMutate}
            >
              {t('yes')}
            </button>
            <button
              className={
                !furnished && furnished !== null
                  ? 'formButtonActive'
                  : 'formButton'
              }
              type='button'
              id='furnished'
              value={false}
              onClick={onMutate}
            >
              {t('no')}
            </button>
          </div>

          <label className='formLabel'>{t('address')}</label>
          <textarea
            className='formInputAddress'
            type='text'
            id='address'
            value={address}
            onChange={onMutate}
            required
          />

          <label className='formLabel'>{t('infrastructure')}</label>
          <textarea
            className='formInputAddress'
            type='text'
            id='infrastructure'
            value={infrastructure}
            onChange={onMutate}
            required
          />

          <label className='formLabel'>{t('description')}</label>
          <textarea
            className='formInputAddress'
            type='text'
            id='description'
            value={description}
            onChange={onMutate}
            required
          />

          <label className='formLabel'>{t('offer')}</label>
          <div className='formButtons'>
            <button
              className={offer ? 'formButtonActive' : 'formButton'}
              type='button'
              id='offer'
              value={true}
              onClick={onMutate}
            >
              {t('yes')}
            </button>
            <button
              className={
                !offer && offer !== null ? 'formButtonActive' : 'formButton'
              }
              type='button'
              id='offer'
              value={false}
              onClick={onMutate}
            >
              {t('no')}
            </button>
          </div>

          <label className='formLabel'>{t('regular_price')}</label>
          <div className='formPriceDiv'>
            <input
              className='formInputSmall'
              type='number'
              id='regularPrice'
              value={regularPrice}
              onChange={onMutate}
              min='50'
              max='750000000'
              required
            />
            {type === 'rent' && <p className='formPriceText'>$ / {t('month')}</p>}
          </div>

          {offer && (
            <>
              <label className='formLabel'>{t('discounted_prise')}</label>
              <input
                className='formInputSmall'
                type='number'
                id='discountedPrice'
                value={discountedPrice}
                onChange={onMutate}
                min='50'
                max='750000000'
                required={offer}
              />
            </>
          )}

          <label className='formLabel'>{t('images')}</label>
          <p className='imagesInfo'>{t('images_info')}</p>
          <input
            className='formInputFile'
            type='file'
            id='images'
            onChange={onMutate}
            max='6'
            accept='.jpg,.png,.jpeg'
            multiple
            required
          />
          <button type='submit' className='primaryButton createListingButton'>
            {t('create_listing')}
          </button>
        </form>
      </main>
    </div>
  )
}

export default CreateListing