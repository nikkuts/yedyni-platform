import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleModal } from '../../redux/modal/modalSlice';
import { selectCurrentLesson } from '../../redux/exercises/selectors';
import { Modal } from '../Modal/Modal';
import { VideoFrame } from '../VideoFrame/VideoFrame';
import css from './Test.module.css';

export default function Test () {
    const dispatch = useDispatch();
    const currentLesson = useSelector(selectCurrentLesson);
    const [openedTestIndex, setOpenedTestIndex] = useState(null);

    const handleClickStartTest = () => {
      setOpenedTestIndex(currentLesson.day);
      dispatch(toggleModal());
    };

    const handleCloseModal = () => {
      setOpenedTestIndex(null);
      dispatch(toggleModal());
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
          <Modal closeModal={handleCloseModal}>
            <VideoFrame url={currentLesson.test} />
          </Modal>
        }
      </div>
    )
}