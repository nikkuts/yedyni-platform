import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { toogleModal } from '../../redux/modal/modalSlice';
import { selectModal } from '../../redux/modal/selectors';
import { selectCurrentLesson } from '../../redux/exercises/selectors';
import { Test } from '../Test/Test';
import css from './LessonMenu.module.css';

export const LessonMenu = () => {
    const dispatch = useDispatch();
    const currentLesson = useSelector(selectCurrentLesson);
    const isModalOpen = useSelector(selectModal);

    const handleClickTest = () => {
        dispatch(toogleModal());
    };

    return (
        <>
            <ul className={css.lessonNavigation}>
                <li>
                    <Link 
                        to=""
                        className={css.lessonNavLink}
                    >
                        Зміст
                    </Link> 
                </li>
                <li>
                    <Link 
                        to="theory"
                        className={css.lessonNavLink}
                    >
                        Теорія
                    </Link> 
                </li>
                {currentLesson.audio.length > 0 &&
                <li>
                    <Link 
                        to="audio"
                        className={css.lessonNavLink}
                    >
                        Аудіопомічник
                    </Link> 
                </li>
                }
                <li>
                    <Link 
                        to="practice"
                        className={css.lessonNavLink}
                    >
                        Практика
                    </Link> 
                </li>
                {currentLesson.video.length > 0 &&
                <li>
                    <Link 
                        to="video"
                        className={css.lessonNavLink}
                    >
                        Відео
                    </Link> 
                </li>
                }
                {currentLesson.test !== '' &&
                <li>
                    <Link 
                        onClick={handleClickTest}
                        className={css.lessonNavLink}
                    >
                        Тестування
                    </Link> 
                </li>
                }
                {isModalOpen && 
                <Test
                    test={currentLesson.test}
                />
                }
                <li>
                    <Link 
                        to="diary"
                        className={css.lessonNavLink}
                    >
                        Щоденник
                    </Link> 
                </li>  
            </ul>
        </>           
    )
  };