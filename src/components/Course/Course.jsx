import { Suspense } from 'react';
import { Link, useParams, Outlet } from 'react-router-dom';
import courses from "../courses.json";
import css from './Course.module.css';

export default function Course () {
    const {courseId} = useParams();
    const currentCourse = courses.find(course => course.id === courseId);
    
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
            <div className={css.courseWrapper}>
                <ul className={css.courseList}>
                    {currentCourse.lessons.slice(0,7).map(
                        lesson => (
                        <li key={lesson.day}>
                            <Link
                                to={`${lesson.day}`}
                                className={css.link}
                            >
                                День {lesson.day}. {lesson.theme}
                            </Link>
                        </li>
                    ))}
                </ul>
                <ul className={css.courseList}>
                    {currentCourse.lessons.slice(7,14).map(
                        lesson => (
                        <li key={lesson.day}>
                            <Link
                                to={`${lesson.day}`}
                                className={css.link}
                            >
                                День {lesson.day}. {lesson.theme}
                            </Link>
                        </li>
                    ))}
                </ul>
                <ul className={css.courseList}>
                    {currentCourse.lessons.slice(14,21).map(
                        lesson => (
                        <li key={lesson.day}>
                            <Link
                                to={`${lesson.day}`}
                                className={css.link}
                            >
                                День {lesson.day}. {lesson.theme}
                            </Link>
                        </li>
                    ))}
                </ul>
                <ul className={css.courseList}>
                    {currentCourse.lessons.slice(21,28).map(
                        lesson => (
                        <li key={lesson.day}>
                            <Link
                                to={`${lesson.day}`}
                                className={css.link}
                            >
                                День {lesson.day}. {lesson.theme}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
            <div className={css.wrapperFrame}>
                <Suspense fallback={null}>
                    <Outlet />
                </Suspense>
            </div>
        </div>
    )
}