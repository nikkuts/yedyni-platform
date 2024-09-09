import CourseCover from "../CourseCover/CourseCover";
import { useAuth } from '../../hooks';
import courses from "../courses.json";
import css from './Learn.module.css';

export default function Learn () {
  const {user} = useAuth();
  const coursesVisible = user.courses.reduce((prev, courseId) => {
    const elem = courses.find(course => course.id === courseId);
    if (elem) {
      prev.push(elem);
    }
    return prev;
  }, []);

  return (
    <div className={css.learnWrapper}>
        <h1 className={css.title}>Моє навчання</h1>
        <ul className={css.learnList}>
          {coursesVisible.map((course) => (
              <CourseCover
                key={course.id} 
                courseId={course.id} 
                title={course.title} 
              />
            ))
          }
        </ul> 
    </div>
  );       
};