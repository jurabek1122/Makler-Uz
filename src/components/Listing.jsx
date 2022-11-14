import { Link } from 'react-router-dom';
import { ReactComponent as DeleteIcon} from '../assets/svg/deleteIcon.svg';
import { ReactComponent as EditIcon} from '../assets/svg/editIcon.svg';
import bedIcon from '../assets/svg/bedIcon.svg';
import bathtubIcon from '../assets/svg/bathtubIcon.svg';
import { useTranslation } from 'react-i18next';
import { ImLocation } from 'react-icons/im';

const Listing = ({ listing, id, onDelete, onEdit }) => {

    const { t } = useTranslation()

    return (
        <li className='categoryListing'>
            <Link to={`/category/${listing.type}/${id}`} className='categoryListingLink'>
                <img src={listing.imgUrls[0]} alt={listing.firstname} 
                className='categoryListingImg'/>
                <div className="categoryListingDetails">
                    <p className="categoryListingName">
                        {listing.rooms}-{t('n_rooms')}. {listing.type2 === 'appartment'
                        ? `${t('appartment')}` : `${t('house')}`}, {listing.floor}
                        {listing.numberfloors && `/${listing.numberfloors}`} {t('floor')}, {listing.square} {t('m²')}
                    </p>
                    
                    <p className="categoryListingInfoText">
                        <ImLocation />
                        {listing.address}
                    </p>
                    <div className="categoryListingInfoDiv">
                        <p className="categoryListingPrice">
                            $ {listing.offer 
                            ? listing.discountedPrice 
                            .toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                            : listing.regularPrice
                            .toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            {listing.type === 'rent' && ` / ${t('month')}`}
                        </p>
                        <p className='date'>{listing?.timestamp?.seconds ? `${new Date(listing.timestamp.seconds *
                         1000).toLocaleString('en-GB', {timeZone: 'GMT'}).slice(0, 10)}` : 'null'}</p>
                    </div>
                </div>
            </Link>
            {onDelete && (
                <DeleteIcon className='removeIcon' fill='rgb(231, 76, 60)' 
                onClick={() => onDelete(listing.id, listing.name)} />
            )}
            {onEdit && (
                <EditIcon className='editIcon'
                onClick={() => onEdit(id)} />
            )}
        </li>
    );
};

export default Listing;