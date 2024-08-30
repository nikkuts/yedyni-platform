import { useEffect } from "react";
import css from './Image.module.css';

export const Image = ({url, closeModal}) => {

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
            <div className={css.wrapperImage}>
              <img 
                  src={url} 
                  alt="Зображення"
                  className={css.img}
              />
            </div>  
          </div>           
      )
  }