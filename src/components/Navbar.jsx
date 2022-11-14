import { Link } from 'react-router-dom'
import { ReactComponent as OfferIcon } from '../assets/svg/localOfferIcon.svg'
import { ReactComponent as ExploreIcon } from '../assets/svg/exploreIcon.svg'
import { ReactComponent as PersonOutlineIcon } from '../assets/svg/personOutlineIcon.svg'
import { useState, useEffect } from 'react';
import { ImCancelCircle } from 'react-icons/im';
import { GiHamburgerMenu } from 'react-icons/gi';
import { MdLanguage } from 'react-icons/md';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';
import logo from '../assets/jpg/logo.png';

const Navbar = () => {

    const { t, i18n } = useTranslation()
    useEffect(() => {
        if(localStorage.getItem("i18nextLng")?.length > 2) {
            i18next.changeLanguage('en')
        }
    },[])

    const handleLanguageChange = (e) => {
        i18n.changeLanguage(e.target.value)
    }
    const [isNavExpanded, setIsNavExpanded] = useState(false)

    return (
            <nav className="navigation">
                <Link to="/" className="brand-name">
                    <img src={logo} alt="logo" />
                </Link>
                <button className="hamburger"
                onClick={() => { setIsNavExpanded(!isNavExpanded) }}>
                     {
                        isNavExpanded ? (
                        <ImCancelCircle />
                        ) : (
                        <GiHamburgerMenu />
                        )
                    }
                </button>
                <div className={isNavExpanded ? "navigation-menu expanded" : "navigation-menu"}>
                    <ul>
                    <li onClick={() => { setIsNavExpanded(!isNavExpanded) }}>
                        <Link to="/"><ExploreIcon /> <p>{t('home')}</p></Link>
                    </li>
                    <li onClick={() => { setIsNavExpanded(!isNavExpanded) }}>
                        <Link to="/offers"><OfferIcon /> <p>{t('offers')}</p></Link>
                    </li>
                    <li onClick={() => { setIsNavExpanded(!isNavExpanded) }}>
                        <Link to="/profile"><PersonOutlineIcon /> <p>{t('profile')}</p></Link>
                    </li>
                    <li>
                        <select className='language' value={localStorage.getItem("i18nextLng")}
                        onChange={handleLanguageChange}>
                            <option value='en'>English</option>
                            <option value='uz'>Uzbek</option>
                            <option value='ru'>Русский</option>
                        </select>
                    </li>
                        <MdLanguage className='lng-icon' />
                    </ul>
                </div>
                </nav>
    );
};

export default Navbar;