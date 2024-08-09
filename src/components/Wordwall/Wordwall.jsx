import { useCallback, useEffect } from "react";
import { useDispatch } from 'react-redux';
import { toogleModal } from '../../redux/modal/modalSlice';
import css from './Wordwall.module.css';

export const Wordwall = ({exercise}) => {
    const dispatch = useDispatch()

    const closeModal = useCallback(
        () => dispatch(toogleModal()),
        [dispatch]
    );

    const onBackdropClose = e => {
        if (e.currentTarget === e.target) {
            closeModal();
        }
      };

    useEffect(() => {
        const keyDown = e => {
          if (e.code === 'Escape') {
            closeModal();
          }
        };
        window.addEventListener('keydown', keyDown);
        return () => {window.removeEventListener('keydown', keyDown);}
      }, [closeModal])

    return (
        <div  
            onClick={onBackdropClose}
            className={css.overlay}
        >
            <div className={css.wrapperExercise}>   
                <iframe 
                    title="Вставка Wordwall" 
                    src={exercise} 
                    width="100%" height="100%" 
                    frameBorder="0" allowFullScreen
                />
            </div>
        </div>           
    )
}