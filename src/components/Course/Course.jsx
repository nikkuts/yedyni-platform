import { useState, useEffect, Suspense } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useParams, Outlet } from 'react-router-dom';
import { selectIsChatVisible } from '../../redux/chat/selectors';
import { openChat, closeChat } from '../../redux/chat/slice';
import { Chat } from '../Chat/Chat';
import { selectCourse, selectIsLoading } from '../../redux/courses/selectors';
import { getCourseById } from "../../redux/courses/operations";
import { toggleModal } from '../../redux/modal/modalSlice';
import { Modal } from '../Modal/Modal';
import { ScheduleModal } from '../ScheduleModal/ScheduleModal';
import { useAuth } from '../../hooks';
import { formatDate } from "../../service/handleDate";
import { ReactComponent as Calendar } from '../../icons/calendar.svg';
import { ReactComponent as ChevronsRight } from '../../icons/chevrons-right.svg';
import css from './Course.module.css';

export default function Course () {
    const dispatch = useDispatch();
    const {courseId} = useParams();
    const {user} = useAuth();
    const today = new Date();

    const currentCourse = useSelector(selectCourse);
    const isLoading = useSelector(selectIsLoading);
    const isChatVisible = useSelector(selectIsChatVisible); 

    const [isChangedCourse, setIsChangedCourse] = useState(false);
    const [openedLessonIndex, setOpenedLessonIndex] = useState(null);
    const [menuVisible, setMenuVisible] = useState(false);

    const toggleMenu = (e) => {
        setMenuVisible((prevVisible) => !prevVisible);
    };

    const handleClickCalendar = (index, e) => {
        e.stopPropagation();  // Зупиняємо спливання події
        setOpenedLessonIndex(index);
        dispatch(toggleModal());
    };
    
    const handleCloseModal = () => {
        setOpenedLessonIndex(null);
        dispatch(toggleModal());
    };

    useEffect(() => {
        dispatch(getCourseById(courseId)); 
        setIsChangedCourse(true);     
    }, [dispatch, courseId]);
    
    return (
        <>
        {isLoading ? (
            <div>Завантаження курсу</div>
        ) : (
            <>
            {isChangedCourse &&
                <div className={css.courseContainer}>
                    {isChatVisible ? (
                        <Chat 
                            course={currentCourse}
                            onClose={() => dispatch(closeChat())}
                        />
                    ) : (
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
                                onClick={toggleMenu}
                                className={css.menu}
                            >                      
                            <div 
                                className={css.menuBtn} 
                                aria-expanded={menuVisible}
                            >
                                <span>Меню курсу</span>
                                <ChevronsRight />
                            </div>
                            <nav className={`${css.courseMenu} ${menuVisible ? css.active : ''}`}>
                                <ul className={css.courseList}>
                                    {currentCourse.lessons.map((lesson, index) => (
                                        <li 
                                            key={lesson._id}
                                            className={css.item}
                                        >
                                            <div className={css.tooltipWrapper}>
                                            <Link
                                                to={lesson.day} 
                                                className={
                                                    `${css.link} 
                                                    ${(user.status === 'user' && 
                                                        new Date(lesson.scheduledDate) > today) && 
                                                        css.disabled}`
                                                }
                                            >
                                                День {lesson.day}. {lesson.theme}
                                            </Link>
                                            {new Date(lesson.scheduledDate) > today && 
                                                <span className={css.tooltip}>{`Урок ${lesson.day} заплановано ${formatDate(lesson.scheduledDate)}`}</span>
                                            }
                                            </div>

                                            {(user.status === "moderator" || user.status === "admin") && (
                                                <>
                                                <div 
                                                    onClick={(e) => handleClickCalendar(index, e)} 
                                                    className={css.calendar}
                                                >
                                                    <Calendar />
                                                </div>
                                                {openedLessonIndex === index && 
                                                    <Modal closeModal={handleCloseModal}>
                                                        <ScheduleModal
                                                            courseId={courseId}
                                                            lesson={lesson}
                                                            closeModal={handleCloseModal}
                                                        />
                                                    </Modal>
                                                }  
                                                </>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </nav>  
                            </div>
                            <Suspense fallback={null}>
                                <Outlet /> 
                            </Suspense>      
                        </>
                    )}
                </div>
            }
            </>
        )}
        </>
    )
};				