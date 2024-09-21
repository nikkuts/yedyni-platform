import { useSelector } from "react-redux";
import { Link } from 'react-router-dom';
import Linkify from 'react-linkify';
import { componentDecorator } from '../../service/componentDecorator';
import { CommentsList } from '../CommentsList/CommentsList';
import { selectExercise, selectIsLoading } from '../../redux/exercises/selectors';
import css from './NotificationItem.module.css';

export default function NotificationItem () {
  const { course, lessonId, owner, homework, fileURL, fileName } = useSelector(selectExercise);
  const isLoading = useSelector(selectIsLoading);

  return ( 
    <>
      <div>{isLoading && <b>Завантаження даних...</b>}</div> 
      {owner && 
      <div className={css.containerItem}>
        <h2 className={css.title}>
          {owner.name}. {course.title}. День {lessonId} 
        </h2>
        <div className={css.form}>
          <h3 className={css.label}>Домашня робота</h3>
          <span className={css.text}>
            <Linkify componentDecorator={componentDecorator}>
              {homework}
            </Linkify>
          </span>
          {fileURL && fileURL !== '' &&
            <div className={css.wrapperLink}>
              <Link
                to={fileURL}
                target='blank'
                className={css.link}         
              >
                {fileName || 'Прикріплений файл'}
              </Link>
            </div>
          }
        </div>
        <CommentsList />
      </div>
      }
    </>
  );
};