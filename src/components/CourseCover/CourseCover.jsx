import { useNavigate } from 'react-router-dom';
import css from './CourseCover.module.css';

export default function CourseCover ({courseId, title}) {
  const navigate = useNavigate();

  return (
    <li className={css.box}>
      <span className={css.title}>{title}</span>
      <button type="button"
        onClick={() => navigate(`${courseId}`)} 
        className={css.button}
      >
        Продовжити навчання
      </button>
    </li>
  );     
};

// import { useNavigate } from 'react-router-dom';
// import { getDifferenceInDays } from '../../service/handleDate';
// import courses from "../courses.json";
// import css from './CourseCover.module.css';

// export default function CourseCover ({courseId, title}) {
//   const navigate = useNavigate();
//   const currentCourse = courses.find(course => course.id === courseId);
    
//   const difference = getDifferenceInDays(currentCourse.start);
//   const lessonId = difference > 0 && difference <= 27 ?
//       currentCourse.lessons[difference].day : "1";

//   return (
//     <li className={css.box}>
//       <span className={css.title}>{title}</span>
//       <button type="button"
//         onClick={() => navigate(`${courseId}/${lessonId}`)} 
//         className={css.button}
//       >
//         Продовжити навчання
//       </button>
//     </li>
//   );     
// };