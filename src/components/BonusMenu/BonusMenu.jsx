import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { HistoryMenu } from '../HistoryMenu/HistoryMenu';
import { ReactComponent as ChevronsRight } from '../../icons/chevrons-right.svg';
import { ReactComponent as ChevronDown } from '../../icons/chevron-down.svg';
import { ReactComponent as ChevronUp } from '../../icons/chevron-up.svg';
import css from './BonusMenu.module.css';

export const BonusMenu = () => {
    const [menuVisible, setMenuVisible] = useState(false);
    const [menuHistoryVisible, setMenuHistoryVisible] = useState(false);
    const bonusRef = useRef();
    const historyRef = useRef();

    const handleClickOutside = (e) => {
        if (bonusRef.current && !bonusRef.current.contains(e.target)) {
        setMenuVisible(false);
        }

        if (historyRef.current && !historyRef.current.contains(e.target)) {
        setMenuHistoryVisible(false);
        }
    };

    const toggleMenu = () => {
        setMenuVisible((prevVisible) => !prevVisible);
    };

    const toggleMenuHistory = () => {
        setMenuHistoryVisible((prevVisible) => !prevVisible);
    };

    useEffect(() => {
        document.addEventListener('click', handleClickOutside);
        return () => {
        document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    return (
        <>
            <div className={css.bonusWrapper}>
                <h1 className={css.title}>Програма підтримки</h1>
                <div
                    ref={bonusRef}
                    onClick={toggleMenu}
                    className={css.menu}
                >
                    <div className={css.menuBtn} aria-expanded={menuVisible}>
                        <span>Меню програми</span>
                        <ChevronsRight />
                    </div>
                    <div className={`${css.bonusMenu} ${menuVisible ? css.active : ''}`}>                
                        <nav className={css.bonusNav}>                  
                            <Link 
                                to=""
                                className={css.bonusLink}
                            >
                                Показники
                            </Link>
                            <Link 
                                ref={historyRef}
                                onClick={toggleMenuHistory}
                                className={`${css.history} ${css.bonusLink}`}
                            >
                                <div className={css.historyMenu}>
                                    <span>
                                        Історія
                                    </span>
                                    <span 
                                        onClick={(e) => { 
                                            e.preventDefault(); 
                                            e.stopPropagation(); 
                                            toggleMenuHistory(); 
                                        }}
                                    >
                                        {menuHistoryVisible ? <ChevronUp/> : <ChevronDown/>}
                                    </span>
                                </div>
                                {menuHistoryVisible && <HistoryMenu />}
                            </Link>
                            <Link 
                                to="team"
                                className={css.bonusLink}
                            >
                                Команда
                            </Link>                    
                            <Link 
                                to="gratitudes"
                                className={css.bonusLink}
                            >
                                Подяки
                            </Link>
                        </nav>   
                    </div>
                </div>
            </div>
        </>
    )
  };