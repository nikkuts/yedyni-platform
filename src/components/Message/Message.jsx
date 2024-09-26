import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Linkify from 'react-linkify';
import { componentDecorator } from '../../service/componentDecorator';
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

export const Message = ({ message, socket, onEdit }) => {
  const dispatch = useDispatch();
  const {user} = useAuth();
  const token = useSelector(selectToken);
  const {_id, text, fileURL, fileType, fileName, date, sender } = message; 

  const [openedImageIndex, setOpenedImageIndex] = useState(null);
  const [isLoadedImage, setIsLoadedImage] = useState(false);
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
        <span className={css.comment}>
          <Linkify componentDecorator={componentDecorator}>
            {text}
          </Linkify>
        </span>
        {fileURL && fileURL !== '' && (
          <>
            {fileType.startsWith('image') && (
              <>
              {!isLoadedImage && 
                <div className={css.wrapperLink}>
                  <Link
                    to={fileURL}
                    target='_blank'
                    className={css.link}         
                  >
                    {fileName || 'Прикріплений файл'}
                  </Link>
                  </div>
              }
              <Link 
                onClick={() => handleClickImage(_id)}
                className={css.wrapperFile}
                style={{ display: isLoadedImage ? 'block' : 'none' }}        
              >
                <img 
                  src={fileURL} 
                  onLoad={() => setIsLoadedImage(true)}
                  alt="Зображення" 
                  className={css.img} 
                />
              </Link>
              </>
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
              <div className={css.wrapperLink}>
                <Link
                  to={fileURL}
                  target='_blank'
                  className={css.link}         
                >
                  {fileName || 'Прикріплений файл'}
                </Link>
              </div>
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