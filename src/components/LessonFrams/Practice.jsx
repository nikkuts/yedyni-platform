import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { selectCurrentLesson } from '../../redux/exercises/selectors';
import { HomeworkForm } from '../HomeworkForm/HomeworkForm';

export default function Practice () {
    const {courseId, lessonId} = useParams();
    const currentLesson = useSelector(selectCurrentLesson);

    return (
        <>
            {currentLesson.practice !== '' &&
                <iframe 
                    title="Вставка Google doc"
                    src={currentLesson.practice} 
                    width="100%" height="600" frameBorder="0" allow="autoplay"
                />
            }
                <HomeworkForm 
                    courseId={courseId}
                    lessonId={lessonId}
                />
        </>           
    )
  };