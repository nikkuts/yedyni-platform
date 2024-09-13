import { useSelector, useDispatch } from 'react-redux';
import { toogleModal } from '../../redux/modal/modalSlice';
import { selectModal } from '../../redux/modal/selectors';
import { selectCurrentLesson } from '../../redux/exercises/selectors';
import { Wordwall } from '../Wordwall/Wordwall';
import css from './Test.module.css';

export default function Test () {
    const dispatch = useDispatch();
    const currentLesson = useSelector(selectCurrentLesson);
    const isModalOpen = useSelector(selectModal);

    const handleClickStartTest = () => {
      dispatch(toogleModal());
    };

    return (
      <div className={css.wrapperTest}>   
        <button 
          type="button"
          onClick={handleClickStartTest} 
          className={css.button}
        >
          Почати тест
        </button>
        { isModalOpen && 
          <Wordwall
            exercise={currentLesson.test}
          />
        }  
      </div>
    )
}