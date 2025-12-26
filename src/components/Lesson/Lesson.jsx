import { useState, useEffect, Suspense } from 'react';
import {  useSelector, useDispatch } from 'react-redux';
import { Outlet, useParams } from 'react-router-dom';
import { LessonMenu } from '../LessonMenu/LessonMenu';
import { selectCourse } from '../../redux/courses/selectors';
import { getExercise } from '../../redux/exercises/operations';
import { getDiary } from '../../redux/diary/operations';
import { changeLesson, getContent } from '../../redux/exercises/lessonSlice';
import css from './Lesson.module.css';

export default function Lesson () {
    const dispatch = useDispatch();
    const {courseId, lessonId} = useParams();

    const currentCourse = useSelector(selectCourse);
    const currentLesson = currentCourse.lessons.find(lesson => lesson.day === lessonId);

    const [isChangedLesson, setIsChangedLesson] = useState(false);
    const [menuVisible, setMenuVisible] = useState(false);
    
    const toggleMenu = () => {
        setMenuVisible((prevVisible) => !prevVisible);
    };

    useEffect(() => {
        dispatch(changeLesson(currentLesson));
        dispatch(getContent(currentLesson.content));
        dispatch(getExercise({courseId, lessonId}));
        dispatch(getDiary({courseId, lessonId})); 
        setIsChangedLesson(true);     
    }, [dispatch, courseId, lessonId, currentLesson]);

    return (
        <> 
            {isChangedLesson &&         
            <div className={css.lessonContainer}>
                <img src={currentLesson.image} alt={`День ${currentLesson.day}`} width="100%" />
                
                {courseId === '66e2c70e5122f6140e1ad568' ?
                <>
                    <div className={css.descriptionAudio}>
                        <p>Нижче ви можете прослухати аудіоверсію завдань та приклад виконання одного з них від Катрі, модераторки розмовних клубів «Єдині», викладачки української мови 🙏<br/>
                            Окремим аудіозаписом - додаткові матеріали. Аудіоверсія дублює текстовий варіант.
                        </p>
                    </div>
                    <div className={css.wrapperAudio}>
                        {currentLesson.audio.map((audioUrl) => (
                            <audio key={audioUrl} controls className={css.audio}>
                                <source src={audioUrl} type="audio/mp3" />
                                Ваш браузер не підтримує відтворення аудіо.
                            </audio>
                        ))}
                    </div>  
                </>
                :
                <div onClick={toggleMenu} className={css.menu}>
                    <div 
                        className={`${css.menuBtn} ${menuVisible ? css.active : ''}`} 
                        aria-expanded={menuVisible}
                    >
                        <span>Меню уроку</span>

                        <svg className={css.burgerIcon} viewBox="0 0 24 24">
                        <path className={css.line1} d="M4 7h16" />
                        <path className={css.line2} d="M4 12h16" />
                        <path className={css.line3} d="M4 17h16" />
                        </svg>
                    </div>

                    <nav className={`${css.lessonMenu} ${menuVisible ? css.active : ''}`}>
                        <LessonMenu />
                    </nav>
                </div>
                }
                <Suspense fallback={null}>
                    <Outlet /> 
                </Suspense>   
            </div>
            }
        </>           
    )
  };