import { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { HistoryMenu } from '../HistoryMenu/HistoryMenu';
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
                <div ref={bonusRef} className={css.menu}>
                {/* КНОПКА МЕНЮ (мобільна) */}
                    <div 
                        onClick={toggleMenu}
                        className={`${css.menuBtn} ${menuVisible ? css.open : ''}`}
                        aria-expanded={menuVisible}
                    >
                        <span>Меню програми</span>

                        <svg className={css.burgerIcon} viewBox="0 0 24 24">
                            <path className={css.line1} d="M4 7h16" />
                            <path className={css.line2} d="M4 12h16" />
                            <path className={css.line3} d="M4 17h16" />
                        </svg>
                    </div>

                    {/* НАВІГАЦІЯ */}
                    <div className={`${css.bonusMenu} ${menuVisible ? css.open : ''}`}>
                        <nav className={css.bonusNav}>

                            <NavLink to="" className={css.bonusLink}>
                                Показники
                            </NavLink>

                            {/* ІСТОРІЯ */}
                            <div className={css.history}>
                                <button 
                                    ref={historyRef}
                                    onClick={toggleMenuHistory}
                                    className={css.historyBtn}
                                >
                                    <span>Історія</span>
                                    {menuHistoryVisible ? <ChevronUp/> : <ChevronDown/>}
                                </button>

                                {menuHistoryVisible && <HistoryMenu />}
                            </div>

                            <NavLink to="team" className={css.bonusLink}>
                                Команда
                            </NavLink>

                        </nav>
                    </div>
                </div>
            </div>
        </>
    )
};
