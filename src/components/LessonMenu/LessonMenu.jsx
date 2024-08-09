import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { selectCurrentLesson } from '../../redux/exercises/selectors';
import css from './LessonMenu.module.css';

export const LessonMenu = () => {
    const currentLesson = useSelector(selectCurrentLesson);

    return (
        <>
            <nav className={css.lessonNavigation}>
                <Link 
                    to=""
                    className={css.lessonNavLink}
                >
                    Зміст
                </Link> 
                <Link 
                    to="theory"
                    className={css.lessonNavLink}
                >
                    Теорія
                </Link> 
                {currentLesson.audio.length > 0 &&
                <Link 
                    to="audio"
                    className={css.lessonNavLink}
                >
                    Аудіопомічник
                </Link> 
                }
                <Link 
                    to="practice"
                    className={css.lessonNavLink}
                >
                    Практика
                </Link> 
                {currentLesson.video.length > 0 &&
                <Link 
                    to="video"
                    className={css.lessonNavLink}
                >
                    Відео
                </Link> 
                }
                {currentLesson.test !== '' && 
                <Link
                    to="test" 
                    className={css.lessonNavLink}
                >
                    Тестування
                </Link> 
                }
                <Link 
                    to="diary"
                    className={css.lessonNavLink}
                >
                    Щоденник
                </Link>   
            </nav>
        </>           
    )
  };