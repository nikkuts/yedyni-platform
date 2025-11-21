import CourseCover from "../CourseCover/CourseCover";
import { useAuth } from '../../hooks';
import css from './Learn.module.css';

export default function Learn () {
  const {user} = useAuth();

  return (
    <div className={css.learnWrapper}>
        <h1 className={css.title}>Моє навчання</h1>
        <ul className={css.learnList}>
          {user.courses.map((course) => (
              <CourseCover
                key={course._id} 
                courseId={course._id} 
                title={course.title} 
              />
            ))
          }
        </ul> 
    </div>
  );       
};
