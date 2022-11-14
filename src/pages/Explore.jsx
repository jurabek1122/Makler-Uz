import { Link } from 'react-router-dom';
import rentCategoryImage from '../assets/jpg/rentCategoryImage.jpg';
import sellCategoryImage from '../assets/jpg/sellCategoryImage.jpg';
import Slider from '../components/Slider'
import { useTranslation } from 'react-i18next';


const Explore = () => {

    const { t } = useTranslation()
    return(
        <div className='explore'>
            <main>
                <Slider />
                <p className="exploreCategoryHeading">{t('categories')}</p>
                <div className="exploreCategories">
                    <Link to='/category/rent'>
                        <img src={rentCategoryImage} alt="rent" className='exploreCategoryImg' />
                        <p className="exploreCategoryName">{t('pfrent')}</p>
                    </Link>
                    <Link to='/category/sale'>
                        <img src={sellCategoryImage} alt="sell" className='exploreCategoryImg' />
                        <p className="exploreCategoryName">{t('pfsale')}</p>
                    </Link>
                </div>
            </main>
        </div>
    )
}

export default Explore