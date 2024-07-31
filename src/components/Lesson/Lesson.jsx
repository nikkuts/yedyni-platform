import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Suspense } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import { LessonMenu } from '../LessonMenu/LessonMenu';
import { getExercise } from '../../redux/exercises/operations';
import { getDiary } from '../../redux/diary/operations';
import { changeLesson } from '../../redux/exercises/lessonSlice';
import courses from "../courses.json";
import css from './Lesson.module.css';

export default function Lesson () {
    const dispatch = useDispatch();
    const [isChangedLesson, setIsChangedLesson] = useState(false);

    const {courseId, lessonId} = useParams();
    const currentCourse = courses.find(course => course.id === courseId);
    const currentLesson = currentCourse.lessons.find(lesson => lesson.day === lessonId);

    useEffect(() => {
        dispatch(changeLesson(currentLesson));
        dispatch(getExercise({courseId, lessonId}));
        dispatch(getDiary({courseId, lessonId})); 
        setIsChangedLesson(true);     
    }, [dispatch, courseId, lessonId, currentLesson]);

    return (
        <> 
            {isChangedLesson &&         
            <div className={css.lessonContainer}>
                <img src={currentLesson.image} alt={`День ${currentLesson.day}`} width="100%" />
                
                {courseId === 'id-1' ?
                <>
                    <div className={css.descriptionAudio}>
                        <p>Нижче ви можете прослухати аудіоверсію завдань та приклад виконання одного з них від Катрі, модераторки розмовних клубів «Єдині», викладачки української мови 🙏 
                            <br />Окремим аудіозаписом - додаткові матеріали.
                        </p>
                        <p>Аудіоверсія дублює текстовий варіант.</p>
                    </div>
                    <div className={css.wrapperAudio}>
                        {currentLesson.audio.length > 0 &&
                        <>
                            {currentLesson.audio.map((audioUrl) => (
                                <audio key={audioUrl} controls>
                                    <source src={audioUrl} type="audio/mp3" />
                                    Ваш браузер не підтримує відтворення аудіо.
                                </audio>
                            ))}
                        </>
                        }
                    </div>  
                </>
                :
                <LessonMenu />
                }
                <Suspense fallback={null}>
                    <Outlet /> 
                </Suspense>    
            </div>
            }
        </>           
    )
  };