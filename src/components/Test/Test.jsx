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
        <div className={css.descriptionTest}>
          <p>Щоб результат було враховано у ваш загальний показник, будь ласка, після проходження тесту збережіть кількість отриманих балів у вкладці <a href='diary' className={css.link}>"Щоденник"</a>
          </p>
        </div>
        { openedTestIndex &&
          <Modal closeModal={handleCloseModal}>
            <VideoFrame url={currentLesson.test} />
          </Modal>
        }
      </div>
    )
}