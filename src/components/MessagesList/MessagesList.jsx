import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from 'react-router-dom';
// import { MessagesItem } from '../MessageItem/MessageItem';
import { formatDateTime } from "../../service/handleDate";
import { getMessages, getExerciseById } from '../../redux/exercises/operations';
import { selectMessages } from '../../redux/exercises/selectors';
import css from './MessagesList.module.css';

export default function MessagesList () {
  const dispatch = useDispatch();
  const messages = useSelector(selectMessages);

  useEffect(() => {
    dispatch(getMessages()); 
  }, [dispatch]);

  return (  
    <div className={css.containerMessages}>
        <h1 className={css.title}>Повідомлення</h1>
        <ul>
            {messages.map(({_id, owner, status, courseId, lessonId, updatedAt}) => (
                <li key={_id}>
                  {owner ?
                    <Link 
                      onClick={() => dispatch(getExerciseById(_id))}
                      to="active"
                      className={css.link} 
                    >
                        {owner.name}. {courseId === 'id-1' ? 'Курс переходу' : 'Граматичний курс'}. День {lessonId} 
                    </Link>
                  :
                    <Link 
                        onClick={() => dispatch(getExerciseById(_id))}
                        to={courseId === 'id-1' ? `/uk/learn/id-1/${lessonId}` : `/uk/learn/id-2/${lessonId}/practice`}
                        className={status === "inactive" ? {...css.link, fontWeight: 400} : css.link} 
                    >
                        Модератор. {courseId === 'id-1' ? 'Курс переходу' : 'Граматичний курс'}. День {lessonId} 
                    </Link>
                  }
                    <span className={css.date}>{formatDateTime(updatedAt)}</span>
                </li>
            ))}
        </ul>
    </div>
  );
};