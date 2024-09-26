import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toogleModal } from '../../redux/modal/modalSlice';
import { selectCurrentLesson } from '../../redux/exercises/selectors';
import { Wordwall } from '../Wordwall/Wordwall';
import css from './Test.module.css';

export default function Test () {
    const dispatch = useDispatch();
    const currentLesson = useSelector(selectCurrentLesson);
    const [openedTestIndex, setOpenedTestIndex] = useState(null);

    const handleClickStartTest = (index) => {
      setOpenedTestIndex(currentLesson.day);
      dispatch(toogleModal());
    };

    const handleCloseModal = () => {
      setOpenedTestIndex(null);
      dispatch(toogleModal());
    };

    return (
      <div className={css.wrapperTest}>   
        <button 
          type="button"
          onClick={() => handleClickStartTest()} 
          className={css.button}
        >
          Почати тест
        </button>
        { openedTestIndex && 
          <Wordwall
            exercise={currentLesson.test}
            closeModal={handleCloseModal}
          />
        }  
      </div>
    )
}