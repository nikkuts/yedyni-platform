import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { HomeworkForm } from '../HomeworkForm/HomeworkForm';
import { CommentsList } from '../CommentsList/CommentsList';
import { selectExercise, selectIsLoading } from '../../redux/exercises/selectors';
import css from './MessageItem.module.css';

export default function MessagesItem () {
  const {courseId, lessonId} = useSelector(selectExercise);
  const isLoading = useSelector(selectIsLoading);

  return (  
    <>
      <div>{isLoading && <b>Завантаження даних...</b>}</div>
      {courseId &&
        <div className={css.containerMessages}>
        {/* <HomeworkForm 
                    courseId={courseId}
                    lessonId={lessonId}
                /> */}
                <CommentsList 
                    courseId={courseId}
                    lessonId={lessonId}
                />
        </div>
        }
    </>
  );
};