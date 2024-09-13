import { useState, useEffect, useRef } from 'react';
import {  useSelector, useDispatch } from 'react-redux';
import { Suspense } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import { LessonMenu } from '../LessonMenu/LessonMenu';
import { selectCourse } from '../../redux/courses/selectors';
import { getExercise } from '../../redux/exercises/operations';
import { getDiary } from '../../redux/diary/operations';
import { changeLesson, getContent } from '../../redux/exercises/lessonSlice';
import { ReactComponent as ChevronsRight } from '../../icons/chevrons-right.svg';
import css from './Lesson.module.css';

export default function Lesson () {
    const dispatch = useDispatch();
    const {courseId, lessonId} = useParams();

    const currentCourse = useSelector(selectCourse);
    const currentLesson = currentCourse.lessons.find(lesson => lesson.day === lessonId);

    const [isChangedLesson, setIsChangedLesson] = useState(false);
    const [menuVisible, setMenuVisible] = useState(false);
    const menuRef = useRef();
    
    const toggleMenu = () => {
        setMenuVisible((prevVisible) => !prevVisible);
    };

    useEffect(() => {
        dispatch(changeLesson(currentLesson));
        if (courseId === '66e2c70e5122f6140e1ad568' || 
            courseId === '66e2c7885122f6140e1ad56a') {
            dispatch(getContent(currentLesson.content));
        }
        dispatch(getExercise({courseId, lessonId}));
        dispatch(getDiary({courseId, lessonId})); 
        setIsChangedLesson(true);     
    }, [dispatch, courseId, lessonId, currentLesson]);

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
                <div
                ref={menuRef}
                onClick={toggleMenu}
                className={css.menu}
                >
                    <div className={css.menuBtn} aria-expanded={menuVisible}>
                        <span>Меню уроку</span>
                        <ChevronsRight />
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