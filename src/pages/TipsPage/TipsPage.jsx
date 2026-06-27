import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { getTips, getTipById } from '../../redux/tips/operations';
import { selectTips, selectTip, selectIsLoading } from '../../redux/tips/selectors';
import TipsList from '../../components/TipsList/TipsList';
import TipContent from '../../components/TipContent/TipContent';
import css from './TipsPage.module.css';

const TipsPage = () => {
    const dispatch = useDispatch();
    const tips = useSelector(selectTips);
    const currentTip = useSelector(selectTip);
    const isLoading = useSelector(selectIsLoading);

    const [menuVisible, setMenuVisible] = useState(false);

    const toggleMenu = () => {
        setMenuVisible(prev => !prev);
    };

    const handleSelect = (id) => {
        if (id !== currentTip?._id) {
            dispatch(getTipById(id));
        }
        setMenuVisible(false); // після вибору поради меню закривається
    };

    useEffect(() => {
        dispatch(getTips());
    }, [dispatch]);

    useEffect(() => {
        if (tips.length) {
            dispatch(getTipById(tips[0]._id));
        }
    }, [tips, dispatch]);

    if (isLoading) {
        return <div><b>Завантаження даних...</b></div>
    }

    return (
        <div className={css.tipsPage}>
            <aside className={css.tipsSidebar}>

                <div className={css.menu}>
                    <div
                        onClick={toggleMenu}
                        className={`${css.menuBtn} ${menuVisible ? css.active : ''}`}
                        aria-expanded={menuVisible}
                    >
                        <span>Корисні поради</span>

                        <svg className={css.burgerIcon} viewBox="0 0 24 24">
                            <path className={css.line1} d="M4 7h16" />
                            <path className={css.line2} d="M4 12h16" />
                            <path className={css.line3} d="M4 17h16" />
                        </svg>
                    </div>

                    <nav
                        className={`${css.tipsMenu} ${
                            menuVisible ? css.active : ''
                        }`}
                    >
                        <TipsList
                            tips={tips}
                            selectedTipId={currentTip?._id}
                            onSelect={handleSelect}
                        />
                    </nav>
                </div>

            </aside>

            <main className={css.tipsMain}>
                <TipContent tip={currentTip} />
            </main>
        </div>
    );
};

export default TipsPage;
