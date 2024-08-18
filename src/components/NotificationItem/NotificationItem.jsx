import { useSelector } from "react-redux";
import { Link } from 'react-router-dom';
import { CommentsList } from '../CommentsList/CommentsList';
import { selectExercise, selectIsLoading } from '../../redux/exercises/selectors';
import css from './NotificationItem.module.css';

export default function NotificationItem () {
  const {courseId, lessonId, owner, homework, fileURL} = useSelector(selectExercise);
  const isLoading = useSelector(selectIsLoading);

  return ( 
    <>
      <div>{isLoading && <b>Завантаження даних...</b>}</div> 
      {owner && 
      <div className={css.containerMessageItem}>
        <h2 className={css.title}>
          {owner.name}. {courseId === 'id-1' ? 'Курс переходу' : 'Граматичний курс'}. День {lessonId} 
        </h2>
        <div className={css.form}>
          <h3 className={css.label}>Домашня робота</h3>
          <p className={css.textarea}>{homework}</p>
          {fileURL && fileURL !== '' &&
              <Link
                to={fileURL}
                target='blank'
                className={css.link}         
              >
                Прикріплений файл
              </Link>
          }
        </div>
        <CommentsList />
      </div>
      }
    </>
  );
};