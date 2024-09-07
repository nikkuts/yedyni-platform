import { useState, useEffect, useRef, Suspense } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useParams, Outlet } from 'react-router-dom';
import { selectIsChatVisible } from '../../redux/chat/selectors';
import { openChat, closeChat } from '../../redux/chat/slice';
import { Chat } from '../Chat/Chat';
import { ReactComponent as ChevronsRight } from '../../icons/chevrons-right.svg';
import courses from "../courses.json";
import css from './Course.module.css';

export default function Course () {
    const dispatch = useDispatch();
    const {courseId} = useParams();
    const currentCourse = courses.find(course => course.id === courseId);

    const [menuVisible, setMenuVisible] = useState(false);
    const isChatVisible = useSelector(selectIsChatVisible); 
    const menuRef = useRef();

    const toggleMenu = () => {
        setMenuVisible((prevVisible) => !prevVisible);
    };

    useEffect(() => {
        const menuElement = menuRef.current;

        const handleClickOutside = (e) => {
            if (menuElement && !menuElement.contains(e.target)) {
                setMenuVisible(false);
              }
        };

        document.addEventListener('click', handleClickOutside);

        return () => {
            if (menuElement) {
                document.removeEventListener('click', handleClickOutside);
            }
        };
    }, []);
    
    return (
        <div className={css.courseContainer}>
            {isChatVisible ?
                <Chat 
                    course={currentCourse}
                    onClose={() => dispatch(closeChat())}
                />
                :
                <>
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
                        onClick={() => dispatch(openChat())}
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
        
            </>
            }
    </div>
    )
};				

// export default function Course () {
//     const navigate = useNavigate();
//     const {courseId} = useParams();
//     const currentCourse = courses.find(course => course.id === courseId);

//     const [menuVisible, setMenuVisible] = useState(false);
//     const [chatVisible, setChatVisible] = useState(false);
//     const menuRef = useRef();

//     const handleClickOutside = (e) => {
//         if (menuRef.current && !menuRef.current.contains(e.target)) {
//             setMenuVisible(false);
//           }
//     };

//     const toggleMenu = () => {
//         setMenuVisible((prevVisible) => !prevVisible);
//     };

//     useEffect(() => {
//         document.addEventListener('click', handleClickOutside);
//         return () => {
//         document.removeEventListener('click', handleClickOutside);
//         };
//     }, []);
    
//     return (
//         <div className={css.courseContainer}>
//             <h2 className={css.courseTitle}>{currentCourse.title}</h2>
//             <ul className={css.courseWave}>
//                 <li className={css.currentWave}>
//                 <span className={css.numberWave}>{currentCourse.wave}</span> хвиля
//                 </li>
//                 <li className={css.currentWave}>
//                 Старт: {currentCourse.start}
//                 </li>
//                 {chatVisible ?
//                 <>
//                     <li>
//                         <Link
//                             onClick={() => {
//                                 setChatVisible(false);
//                                 navigate(-1);
//                             }} 
//                             className={css.backBtn}
//                         >
//                             <ChevronsLeft />
//                             <span>До курсу</span>
//                         </Link>
//                     </li>
//                 </>
//                 :
//                 <>
//                     <li>
//                         <Link
//                             to={`${currentCourse.canal}`}
//                             target='blank' 
//                             className={css.courseBtn}
//                         >
//                             Канал
//                         </Link>
//                     </li>
//                     <li>
//                         <Link
//                             // to={`${currentCourse.chat}`}
//                             // target='blank' 
//                             to={'chat'}
//                             onClick={() => setChatVisible(true)}
//                             className={css.courseBtn}
//                         >
//                             Чат
//                         </Link>
//                     </li>
//                 </>
//                 }
//             </ul>
//             {!chatVisible &&
//             <div
//                 ref={menuRef}
//                 onClick={toggleMenu}
//                 className={css.menu}
//             >
//                 <div className={css.menuBtn} aria-expanded={menuVisible}>
//                     <span>Меню курсу</span>
//                     <ChevronsRight />
//                 </div>
//                     <nav className={`${css.courseMenu} ${menuVisible ? css.active : ''}`}>
//                         <ul className={css.courseList}>
//                             {currentCourse.lessons.map(
//                                 lesson => (
//                                 <li key={lesson.day}>
//                                     <Link
//                                         to={`/uk/learn/${courseId}/${lesson.day}`} 
//                                         className={css.link}
//                                     >
//                                         День {lesson.day}. {lesson.theme}
//                                     </Link>
//                                 </li>
//                             ))}
//                         </ul>
//                     </nav>  
//             </div>
//             }
//             <Suspense fallback={null}>
//                 <Outlet /> 
//             </Suspense> 
//         </div>
//     )
// };				