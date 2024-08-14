import { useState, useEffect, useRef, Suspense } from 'react';
import { Link, useParams, Outlet } from 'react-router-dom';
import { ReactComponent as ChevronsRight } from '../../icons/chevrons-right.svg';
import courses from "../courses.json";
import css from './Course.module.css';

export default function Course () {
    const {courseId} = useParams();
    const currentCourse = courses.find(course => course.id === courseId);

    const [menuVisible, setMenuVisible] = useState(false);
    const menuRef = useRef();

    const handleClickOutside = (e) => {
        if (menuRef.current && !menuRef.current.contains(e.target)) {
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
        <div className={css.courseContainer}>
            <h2 className={css.courseTitle}>{currentCourse.title}</h2>
            <ul className={css.courseWave}>
                <li className={css.currentWave}>
                <span className={css.numberWave}>{currentCourse.wave}</span> хвиля
                </li>
                <li className={css.currentWave}>
                Старт: {currentCourse.start}
                </li>
                <li>
                    <Link
                        to={`${currentCourse.canal}`}
                        target='blank' 
                        className={css.courseBtn}
                    >
                        Канал
                    </Link>
                </li>
                <li>
                    <Link
                        to={`${currentCourse.chat}`}
                        target='blank' 
                        className={css.courseBtn}
                    >
                        Чат
                    </Link>
                </li>
            </ul>
            <div
                ref={menuRef}
                onClick={toggleMenu}
                className={css.menu}
            >
                <div className={css.menuBtn} aria-expanded={menuVisible}>
                    <span>Меню курсу</span>
                    <ChevronsRight />
                </div>
                <nav className={`${css.courseMenu} ${menuVisible ? css.active : ''}`}>
                    <ul className={css.courseList}>
                        {currentCourse.lessons.map(
                            lesson => (
                            <li key={lesson.day}>
                                <Link
                                    to={`/uk/learn/${courseId}/${lesson.day}`} 
                                    className={css.link}
                                >
                                    День {lesson.day}. {lesson.theme}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>   
            </div>
            <Suspense fallback={null}>
                <Outlet /> 
            </Suspense> 
        </div>
    )
};				