import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { selectCurrentLesson, selectExercise } from '../../redux/exercises/selectors';
import { HomeworkForm } from '../HomeworkForm/HomeworkForm';

export default function Content () {
    const {courseId, lessonId} = useParams();
    const currentLesson = useSelector(selectCurrentLesson);
    
    const { homework } = useSelector(selectExercise);
    const [nextHomework, setNextHomework] = useState(homework);

    useEffect(() => {
        setNextHomework(homework);      
    }, [homework]);

    return (
        <>
            {currentLesson.content !== '' &&
                <iframe 
                    title="Вставка Google doc"
                    src={currentLesson.content} 
                    width="100%" height="600" frameBorder="0" allow="autoplay"
                />
            }
            {courseId === 'id-1' &&
            <>
                {homework === nextHomework &&
                    <HomeworkForm 
                        courseId={courseId}
                        lessonId={lessonId}
                    />
                }
            </>
            }          
        </>           
    )
  };