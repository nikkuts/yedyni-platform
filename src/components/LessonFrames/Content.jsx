import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { selectCurrentLesson, selectExercise, selectContent } from '../../redux/exercises/selectors';
import { HomeworkForm } from '../HomeworkForm/HomeworkForm';
import { insertContent } from '../../service/insertContent';

export default function Content () {
    const {courseId, lessonId} = useParams();
    const currentLesson = useSelector(selectCurrentLesson);
    const content = useSelector(selectContent);
    const contentRef = useRef();
    const navigate = useNavigate();

    const { homework } = useSelector(selectExercise);
    const [nextHomework, setNextHomework] = useState(homework);
      
    useEffect(() => {
        insertContent({
            courseId,
            lessonId,
            elem: contentRef.current, 
            content,
            navigate
        });         
    }, [currentLesson, courseId, lessonId, content, navigate]);

    useEffect(() => {
        setNextHomework(homework);      
    }, [homework]);

    return (
        <>
            <div ref={contentRef}></div>
            {courseId === '66e2c70e5122f6140e1ad568' &&
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