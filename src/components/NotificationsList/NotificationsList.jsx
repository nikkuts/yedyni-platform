import { useDispatch, useSelector } from "react-redux";
import { Link } from 'react-router-dom';
import { formatDateTime } from "../../service/handleDate";
import { getExerciseById, updateCommentStatus } from '../../redux/exercises/operations';
import { selectNotifications } from '../../redux/exercises/selectors';
import css from './NotificationsList.module.css';

export default function NotificationsList () {
  const dispatch = useDispatch();
  const notifications = useSelector(selectNotifications);

  return (  
    <div className={css.containerNotifications}>
        <h1 className={css.title}>Сповіщення</h1>
        <ul className={css.list}>
            {notifications.map(({_id, owner, comments, course, lessonId, updatedAt}) => (
                <li key={_id}>
                  {owner ?
                    <Link 
                      onClick={() => dispatch(getExerciseById(_id))}
                      to="/uk/active"
                      className={css.link} 
                    >
                        {owner.name}. {course.title}. День {lessonId} 
                    </Link>
                  :
                    <Link 
                        onClick={() => dispatch(updateCommentStatus({
                          exerciseId: _id,
                        }))}
                        to={
                          course._id === '66e2c70e5122f6140e1ad568' 
                          ? `/uk/learn/${course._id}/${lessonId}` 
                          : `/uk/learn/${course._id}/${lessonId}/practice`
                        }
                        className={css.link}
                    >
                        {comments.author.name}. {course.title}. День {lessonId} 
                    </Link>
                  }
                    <span className={css.date}>{formatDateTime(owner ? updatedAt : comments.date)}</span>
                </li>
            ))}
        </ul>
    </div>
  );
};

// export default function NotificationsList () {
//   const dispatch = useDispatch();
//   const notifications = useSelector(selectNotifications);

//   return (  
//     <div className={css.containerNotifications}>
//         <h1 className={css.title}>Сповіщення</h1>
//         <ul className={css.listNotifications}>
//             {notifications.map(({_id, owner, comments, courseId, lessonId, updatedAt}) => (
//                 <li key={_id}>
//                   {owner ?
//                     <Link 
//                       onClick={() => dispatch(getExerciseById(_id))}
//                       to="/uk/active"
//                       className={css.link} 
//                     >
//                         {owner.name}. {courseId === 'id-1' ? 'Курс переходу' : 'Граматичний курс'}. День {lessonId} 
//                     </Link>
//                   :
//                     <Link 
//                         onClick={() => dispatch(updateCommentStatus({
//                           exerciseId: _id,
//                         }))}
//                         to={courseId === 'id-1' ? `/uk/learn/${courseId}/${lessonId}` : `/uk/learn/${courseId}/${lessonId}/practice`}
//                         className={css.link}
//                     >
//                         {comments.author.name}. {courseId === 'id-1' ? 'Курс переходу' : 'Граматичний курс'}. День {lessonId} 
//                     </Link>
//                   }
//                     <span className={css.date}>{formatDateTime(owner ? updatedAt : comments.date)}</span>
//                 </li>
//             ))}
//         </ul>
//     </div>
//   );
// };