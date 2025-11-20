import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { selectCurrentLesson } from '../../redux/exercises/selectors';
import css from './LessonMenu.module.css';

export const LessonMenu = () => {
    const currentLesson = useSelector(selectCurrentLesson);

    return (
        <nav className={css.lessonNavigation}>
            {Boolean(currentLesson.content) && (
                <NavLink 
                    to=""
                    end
                    className={({ isActive }) => 
                        isActive ? `${css.lessonNavLink} ${css.active}` : css.lessonNavLink
                    }
                >
                    Зміст
                </NavLink>
            )}

            {currentLesson.theory && (
                <NavLink 
                    to="theory"
                    className={({ isActive }) => 
                        isActive ? `${css.lessonNavLink} ${css.active}` : css.lessonNavLink
                    }
                >
                    Теорія
                </NavLink>
            )}

            {currentLesson.audio.length > 0 && (
                <NavLink 
                    to="audio"
                    className={({ isActive }) => 
                        isActive ? `${css.lessonNavLink} ${css.active}` : css.lessonNavLink
                    }
                >
                    Аудіопомічник
                </NavLink>
            )}

            {(currentLesson.practice || currentLesson.practice === "") && (
                <NavLink 
                    to="practice"
                    className={({ isActive }) => 
                        isActive ? `${css.lessonNavLink} ${css.active}` : css.lessonNavLink
                    }
                >
                    Практика
                </NavLink>
            )}

            {currentLesson.video.length > 0 && (
                <NavLink 
                    to="video"
                    className={({ isActive }) => 
                        isActive ? `${css.lessonNavLink} ${css.active}` : css.lessonNavLink
                    }
                >
                    Відео
                </NavLink>
            )}

            {currentLesson.test && (
                <NavLink 
                    to="test"
                    className={({ isActive }) => 
                        isActive ? `${css.lessonNavLink} ${css.active}` : css.lessonNavLink
                    }
                >
                    Тестування
                </NavLink>
            )}

            {currentLesson.diary && (
                <NavLink 
                    to="diary"
                    className={({ isActive }) => 
                        isActive ? `${css.lessonNavLink} ${css.active}` : css.lessonNavLink
                    }
                >
                    Щоденник
                </NavLink>
            )}
        </nav>
    );
};
