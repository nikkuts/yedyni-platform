import { useState, useEffect } from 'react';
import { useSelector,useDispatch } from 'react-redux';
import { Suspense } from 'react';
import { Link, Outlet, useParams } from 'react-router-dom';
import { selectExercise } from '../../redux/exercises/selectors';
import { toogleModal } from '../../redux/modal/modalSlice';
import { selectModal } from '../../redux/modal/selectors';
import { Test } from '../Test/Test';
import { HomeworkForm } from '../HomeworkForm/HomeworkForm';
import { getExercise } from '../../redux/exercises/operations';
import { getDiary } from '../../redux/diary/operations';
import { changeLesson } from '../../redux/exercises/lessonSlice';
import { getDifferenceInDays } from '../../service/handleDate';
import courses from "../courses.json";
import css from './Lesson.module.css';
import { Button } from 'react-bootstrap';

export default function Lesson () {
    const dispatch = useDispatch();
    const isModalOpen = useSelector(selectModal);
    const { homework } = useSelector(selectExercise);
    const [nextHomework, setNextHomework] = useState(homework);
    const [isLessonId, setIsLessonId] = useState(true);

    const {courseId, lessonId} = useParams();
    const currentCourse = courses.find(course => course.id === courseId);
    
    const difference = getDifferenceInDays(currentCourse.start);
    const initialLesson = difference > 0 && difference <= 27 ?
        currentCourse.lessons[difference] : currentCourse.lessons[0];
    
    let currentLesson;

    if (!lessonId) {
        currentLesson = initialLesson;
    } else {
        currentLesson = currentCourse.lessons.find(lesson => lesson.day === lessonId);
    }

    const handleClickTest = () => {
        dispatch(toogleModal());
      };

    useEffect(() => {
        if (!lessonId) {
            setIsLessonId(false);
        } else {
            setIsLessonId(true);
        }
    }, [lessonId]);

    useEffect(() => {
        setNextHomework(homework);      
    }, [homework]);

    useEffect(() => {
        dispatch(changeLesson(currentLesson));
        dispatch(getExercise({courseId, lessonId: currentLesson.day}));
        dispatch(getDiary({courseId, lessonId: currentLesson.day}));      
    }, [dispatch, courseId, currentLesson]);

    return (
        <>          
            {courseId === 'id-1' &&
            <div className={css.lessonContainer}>
                <img src={currentLesson.image} alt={`День ${currentLesson.day}`} width="100%" />
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
                {currentLesson.content && (
                    <iframe 
                        title="Вставка Google doc"
                        src={currentLesson.content} 
                        width="100%" height="600" frameBorder="0" allow="autoplay"
                    />
                )}
                {homework === nextHomework &&
                <HomeworkForm 
                    courseId={courseId}
                    lessonId={lessonId || currentLesson.day}
                />
                }
            </div>
            }

            {courseId === 'id-2' &&
            <>
                <img src={currentLesson.image} alt={`День ${currentLesson.day}`} width="100%" />
                {isLessonId && (
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
                )}
                <div className={css.wrapperFrame}>
                    <Suspense fallback={null}>
                        <Outlet /> 
                    </Suspense>  
                </div>
                
                {!isLessonId &&
                <>
                    <iframe 
                        title="Вставка Google doc"
                        src={currentLesson.content} 
                        width="100%" height="600" frameBorder="0" allow="autoplay"
                    />   
                    <Link 
                        to={`${currentLesson.day}/theory`}
                        className={css.wrapperBtn}
                    >
                        <Button 
                            variant="primary"
                            type="button"
                            className={css.primaryBtn}
                        >
                            Почати урок
                        </Button>
                    </Link>
                </>
                }
            </>
            }   
        </>           
    )
  };