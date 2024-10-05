import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleModal } from '../../redux/modal/modalSlice';
import { Link } from 'react-router-dom';
import { selectCurrentLesson } from '../../redux/exercises/selectors';
import { Modal } from '../Modal/Modal';
import { VideoFrame } from '../VideoFrame/VideoFrame';
import css from './VideoMaterials.module.css';

  export default function VideoMaterials () {
    const dispatch = useDispatch();
    const currentLesson = useSelector(selectCurrentLesson);
    const [openedVideoIndex, setOpenedVideoIndex] = useState(null);

    const handleClickVideo = (index) => {
        setOpenedVideoIndex(index);
        dispatch(toggleModal());
    };
    
    const handleCloseModal = () => {
        setOpenedVideoIndex(null);
        dispatch(toggleModal());
    };

    return (
        <>
            <div className={css.descriptionVideo}>
                <p>Перегляньте відео до цього уроку та невідкладно скористайтеся цінними порадами 🙏 
                </p>
            </div>
            <ul className={css.listVideo}>
                {currentLesson.video.map(({ title, url }, index) => (
                    <li key={url}>
                    <Link 
                        onClick={() => handleClickVideo(index)} 
                        className={css.link}
                    >
                        {title}
                    </Link>
                    {openedVideoIndex === index && 
                        <Modal closeModal={handleCloseModal}>
                            <VideoFrame url={url} />
                        </Modal>
                    }  
                    </li>                   
                ))}   
            </ul>
        </>           
    )
  };