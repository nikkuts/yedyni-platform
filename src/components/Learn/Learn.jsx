import CourseCover from "../CourseCover/CourseCover";
import courses from "../courses.json";
import css from './Learn.module.css';

export default function Learn () {

  return (
    <div className={css.learnWrapper}>
        <h1 className={css.title}>Моє навчання</h1>
        <ul className={css.learnList}>
          {courses.map((course) => (
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