import { useDispatch, useSelector } from "react-redux";
import { Link } from 'react-router-dom';
import { formatDateTime } from "../../service/handleDate";
import { getExerciseById, updateCommentStatus } from '../../redux/exercises/operations';
import { selectMessages } from '../../redux/exercises/selectors';
import css from './MessagesList.module.css';

export default function MessagesList () {
  const dispatch = useDispatch();
  const messages = useSelector(selectMessages);

  return (  
    <div className={css.containerMessages}>
        <h1 className={css.title}>Повідомлення</h1>
        <ul className={css.listMessages}>
            {messages.map(({_id, owner, comments, courseId, lessonId, updatedAt}) => (
                <li key={_id}>
                  {owner ?
                    <Link 
                      onClick={() => dispatch(getExerciseById(_id))}
                      to="/uk/active"
                      className={css.link} 
                    >
                        {owner.name}. {courseId === 'id-1' ? 'Курс переходу' : 'Граматичний курс'}. День {lessonId} 
                    </Link>
                  :
                    <Link 
                        onClick={() => dispatch(updateCommentStatus({
                          exerciseId: _id,
                        }))}
                        to={courseId === 'id-1' ? `/uk/learn/${courseId}/${lessonId}` : `/uk/learn/${courseId}/${lessonId}/practice`}
                        className={css.link}
                    >
                        {comments.author.name}. {courseId === 'id-1' ? 'Курс переходу' : 'Граматичний курс'}. День {lessonId} 
                    </Link>
                  }
                    <span className={css.date}>{formatDateTime(owner ? updatedAt : comments.date)}</span>
                </li>
            ))}
        </ul>
    </div>
  );
};