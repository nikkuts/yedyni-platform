import { useEffect } from "react";
import css from './Wordwall.module.css';

export const Wordwall = ({exercise, closeModal}) => {

    const onBackdropClose = (e) => {
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