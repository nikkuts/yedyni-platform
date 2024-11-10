import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { selectCurrentLesson, selectExercise, selectContent } from '../../redux/exercises/selectors';
import { HomeworkForm } from '../HomeworkForm/HomeworkForm';
import { insertContent } from '../../service/insertContent';
import { useAuth } from '../../hooks';

export default function Content () {
    const navigate = useNavigate();
    const { courseId, lessonId } = useParams();
    const { user } = useAuth();
    const contentRef = useRef();
    
    const currentLesson = useSelector(selectCurrentLesson);
    const content = useSelector(selectContent);
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
                user.status === "user" &&
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