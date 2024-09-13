import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { Image } from '../Image/Image';
import { selectToken } from '../../redux/auth/selectors';
import { toogleModal } from '../../redux/modal/modalSlice';
import { useAuth } from '../../hooks';
import { ReactComponent as MoreVertical } from '../../icons/more-vertical20.svg';
import { ReactComponent as Edit } from '../../icons/edit.svg';
import { ReactComponent as Trash } from '../../icons/trash.svg';
import { formatDateTime } from '../../service/handleDate';
import css from './Message.module.css';

export const Message = ({message, socket, onEdit, onCancel}) => {
  const dispatch = useDispatch();
  const {user} = useAuth();
  const token = useSelector(selectToken);
  const {_id, text, fileURL, fileType, date, sender } = message; 

  const [openedImageIndex, setOpenedImageIndex] = useState(null);
  const [menuVisible, setMenuVisible] = useState(false);    
  const menuRef = useRef();

  const handleClickImage = (index) => {
    setOpenedImageIndex(index);
    dispatch(toogleModal());
  };

  const handleCloseModal = () => {
    setOpenedImageIndex(null);
    dispatch(toogleModal());
  };

  const handleEditClick = () => {
    onEdit(); 
  };
  
  const handleDeleteMessage = (e) => {
    const data = {
      token,
      messageId: _id,
      fileURL,
      isDeleteMessage: true,
    };

    socket.emit('message', data);
    onCancel();
  };

  const toggleMenu = () => {
    setMenuVisible((prevVisible) => !prevVisible);
  };

  useEffect(() => {
    const menuElement = menuRef.current;

    const handleClickOutside = (e) => {
        if (menuElement && !menuElement.contains(e.target)) {
            setMenuVisible(false);
          }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
        if (menuElement) {
            document.removeEventListener('click', handleClickOutside);
        }
    };
  }, []);

  return (
    <>
      <div className={`${css.containerMessage} ${user._id === sender._id && css.specialBackground}`}>
        <span className={`${css.author} ${user._id === sender._id && css.disabled}`}>{sender.name}</span>
        <p className={css.comment}>{text}</p>
        {fileURL && fileURL !== '' && fileType && fileType !== '' && (
          <>
            {fileType.startsWith('image') && (
              <Link className={css.wrapperFile}
                onClick={() => handleClickImage(_id)}        
              >
                <img src={fileURL} alt="Зображення" className={css.img} />
              </Link>
            )}
            
            {openedImageIndex === _id && (
              <Image 
                url={fileURL}
                closeModal={handleCloseModal}
              />
            )}
            
            {fileType.startsWith('audio') && (
              <div className={css.wrapperFile}>
                <audio controls className={css.audio} >
                  <source src={fileURL} type={fileType} />
                  Ваш браузер не підтримує відтворення аудіо.
                </audio>
              </div>
            )}
            
            {!fileType.startsWith('image') && !fileType.startsWith('audio') && (
              <Link
                to={fileURL}
                target='_blank'
                className={css.link}         
              >
                Прикріплений файл
              </Link>
            )}
          </>
        )}
        {user._id === sender._id &&
        <div
            ref={menuRef}
            onClick={toggleMenu} 
            className={css.icon}
        >
            <MoreVertical />
            {menuVisible && 
                <ul className={css.menu}>
                      <li>
                        <Link 
                            onClick={handleEditClick} 
                            className={css.menuLink}          
                        >
                            <Edit />
                            Редагувати
                        </Link>
                    </li>
                    <li>
                        <Link 
                            onClick={handleDeleteMessage} 
                            className={css.menuLink}
                        >
                            <Trash />
                            Видалити
                        </Link>
                    </li>
                </ul>
            }
        </div>
        }
        <span className={css.date}>{formatDateTime(date)}</span>
      </div>
    </>
  ) 
};

Message.propTypes = {
    message: PropTypes.object,
};