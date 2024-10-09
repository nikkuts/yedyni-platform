import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { Navigation } from '../Navigation/Navigation';
import { OfficeMenu } from '../OfficeMenu/OfficeMenu';
import { useAuth } from '../../hooks';
import { ReactComponent as Favicon } from '../../icons/favicon.svg';
import { ReactComponent as User } from '../../icons/user.svg';
import { ReactComponent as ChevronDown } from '../../icons/chevron-down.svg';
import { ReactComponent as ChevronUp } from '../../icons/chevron-up.svg';
import { ReactComponent as Menu } from '../../icons/menu.svg';
import css from './UserMenu.module.css';
import '../../index.css';

export const UserMenu = () => {
  const navigate = useNavigate();
  const {user} = useAuth();

  const [menuVisible, setMenuVisible] = useState(false);
  const officeRef = useRef();

  const handleClickOutside = (e) => {
    if (officeRef.current && !officeRef.current.contains(e.target)) {
      setMenuVisible(false);
    }
  };

  const toggleMenu = () => {
    setMenuVisible((prevVisible) => !prevVisible);
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div className={css.headerContainer}>
      <header className={css.header}>
        <Link 
          to={"https://yedyni.org/"}
          target="blank" 
          className={css.logo}>
          <Favicon />
          <span className={css.textLogo}>ЄДИНІ</span>
        </Link>
        <div className={css.menuBar}>
          <div className={css.nav}>
            <Navigation />
            <button type="button"
              onClick={() => navigate("donat")} 
              className={css.button}
            >
              Підтримати
            </button>
          </div>      
          <div 
            ref={officeRef}
            onClick={toggleMenu}
            className={css.office}
          >
            <ul className={css.officeMenu}>
              <li className={css.officeUser}>
                <User /> 
                <span className={css.name}>
                  {user.name}
                </span>
              </li>
              <li 
                onClick={(e) => { 
                  e.preventDefault(); 
                  e.stopPropagation(); 
                  toggleMenu(); 
                }}
              >
                {menuVisible ? <ChevronUp/> : <ChevronDown/>}
              </li>
            </ul>
            <div className={css.menu}>
              <Menu />
            </div>
            {menuVisible && <OfficeMenu />}
          </div>
        </div>
      </header>
    </div>
  );
};