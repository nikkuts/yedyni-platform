import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { Image } from '../Image/Image';
import { selectToken } from '../../redux/auth/selectors';
import { toogleModal } from '../../redux/modal/modalSlice';
import { useAuth } from '../../hooks';
import { ReactComponent as MoreVertical } from '../../icons/more-vertical.svg';
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
  const textMenuRef = useRef();

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

  const handleClickOutside = (e) => {
    if (textMenuRef.current && !textMenuRef.current.contains(e.target)) {
    setMenuVisible(false);
    }
  };

  useEffect(() => {
      document.addEventListener('click', handleClickOutside);
      return () => {
      document.removeEventListener('click', handleClickOutside);
      };
  }, []);

  return (
        <div className={`${css.containerMessage} ${user.id === sender._id && css.specialBackground}`}>
            <span className={`${css.author} ${user.id === sender._id && css.disabled}`}>{sender.name}</span>
            <p className={css.comment}>{text}</p>
            {fileURL && fileURL !== '' && fileType && fileType !== '' ? (
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
              </>
            ) : (
              <>
                 {fileURL && fileURL !== '' &&
                  <Link
                    to={fileURL}
                    target='blank'
                    className={css.link}         
                  >
                    Прикріплений файл
                  </Link>
                }
              </>
            )}
            {user.id === sender._id &&
            <div
                ref={textMenuRef}
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
  ) 
};

Message.propTypes = {
    message: PropTypes.object,
};


// import { useState, useRef } from 'react';
// import { Link } from 'react-router-dom';
// import { useSelector, useDispatch } from "react-redux";
// import PropTypes from 'prop-types';
// import Form from 'react-bootstrap/Form';
// import Button from 'react-bootstrap/Button';
// import { uploadFile } from '../../redux/chat/operations';
// import { selectToken } from '../../redux/auth/selectors';
// import { useAuth } from '../../hooks';
// import { ReactComponent as MoreVertical } from '../../icons/more-vertical.svg';
// import { ReactComponent as Close } from '../../icons/x.svg';
// import { ReactComponent as Edit } from '../../icons/edit.svg';
// import { ReactComponent as Trash } from '../../icons/trash.svg';
// import { formatDateTime } from '../../service/handleDate';
// import css from './Message.module.css';

// export const Message = ({message, socket, onEdit}) => {
//   const dispatch = useDispatch();
//   const {user} = useAuth(); 
//   const token = useSelector(selectToken);
//   const {_id, text, fileURL, date, sender } = message; 

//   const [textInput, setTextInput] = useState(text);
//   const [fileInput, setFileInput] = useState(null);
//   const [deletedFile, setDeletedFile] = useState(null);
//   const [isActiveTextarea, setIsActiveTextarea] = useState(false);
//   const [isDisabledBtn, setIsDisabledBtn] = useState(true);
//   const [menuVisible, setMenuVisible] = useState(false);
    
//   const textMenuRef = useRef();
//   const fileInputRef = useRef(null);

//   const handleTextChange = (e) => {
//     const eText = e.target.value;
//     setTextInput(eText);  
//     const newText = eText.trim();

//     if (newText !== '' && newText.length <= 500) {
//         setIsDisabledBtn(false);
//     } else {
//         setIsDisabledBtn(true);
//     }
//   };

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];

//     if (file.size > 1048576) {
//       alert('Файл повинен бути не більше 1 Мб.');

//       // Очищення значення file input
//       if (fileInputRef.current) {
//         fileInputRef.current.value = null;
//       }
//     } else {
//       setFileInput(file);
//       setIsDisabledBtn(false);
//     }
//   };

//   const handleDeleteFile = () => {
//     if (fileURL === '') {
//       return;
//     };

//     setDeletedFile(fileURL);
//     setIsDisabledBtn(false);
//   };

//   const handleDeleteMessage = (e) => {
//     const data = {
//       token,
//       messageId: _id,
//       fileURL,
//       isDeleteMessage: true,
//     };

//     socket.emit('message', data);
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     const data = {
//       token,
//       messageId: _id,
//       text: textInput,
//     };
  
//     if (fileInput) {
//       const formData = new FormData();
//       formData.append('file', fileInput);

//       const fileURL = await dispatch(uploadFile(formData)).unwrap();
//       data.fileURL = fileURL;
//     }

//     if (deletedFile) {
//       data.deletedFile = deletedFile;
//     }
 
//     socket.emit('message', data);

//     setIsActiveTextarea(false);   
//     setIsDisabledBtn(true);
//     setDeletedFile(null);
//   };

//   const handleKeyDown = e => {
//     if (e.key === 'Enter') {
//       e.preventDefault(); 
//       handleSubmit(e);
//     }
//   };

//   const toggleMenu = () => {
//     setMenuVisible((prevVisible) => !prevVisible);
//   };

//   const handleEditClick = () => {
//     onEdit(); 
//   };

//   if (!sender) {
//     return <p>Error: Sender information is missing.</p>;
//   }

//   return (
//     <>
//         {!isActiveTextarea ?
//         <div className={user.id === sender._id ? css.containerMessage : css.specialBackground}>
//             <p className={css.comment}>{text}</p>
//             <p className={css.author}>{sender.name} <span className={css.date}>{formatDateTime(date)}</span></p>
//             {fileURL && fileURL !== '' &&
//                 <Link
//                   to={fileURL}
//                   target='blank'
//                   className={css.link}         
//                 >
//                   Прикріплений файл
//                 </Link>
//             }
//             {user.id === sender._id &&
//             <div
//                 ref={textMenuRef}
//                 onClick={toggleMenu} 
//                 className={css.icon}
//             >
//                 <MoreVertical />
//                 {menuVisible && 
//                     <ul className={css.menu}>
//                          <li>
//                             <Link 
//                                 // onClick={() => setIsActiveTextarea(true)}
//                                 onClick={handleEditClick} 
//                                 className={css.menuLink}          
//                             >
//                                 <Edit />
//                                 Редагувати
//                             </Link>
//                         </li>
//                         <li>
//                             <Link 
//                                 onClick={handleDeleteMessage} 
//                                 className={css.menuLink}
//                             >
//                                 <Trash />
//                                 Видалити
//                             </Link>
//                         </li>
//                     </ul>
//                 }
//             </div>
//             }
//         </div>
//        :
//         <Form onSubmit={handleSubmit} className={css.form}>
//             <div
//               onClick={() => {
//                 setIsActiveTextarea(false);
//                 setTextInput(text);
//               }}  
//               className={css.close}
//             >
//               <Close className={css.closeIcon} />
//             </div>
//             <Form.Group 
//             controlId="formText"
//             className={css.groupTextarea} 
//             >
//               <Form.Label className={css.userName}>
//                   {sender.name}
//               </Form.Label>
//               <div>
//                 <Form.Control 
//                   as="textarea" rows={1} 
//                   placeholder="Надішліть повідомлення" 
//                   value={textInput} 
//                   onChange={handleTextChange}
//                   onKeyDown={handleKeyDown}
//                   className={css.textarea} 
//                 />
//               </div>
//               {fileURL && fileURL !== '' && !deletedFile ?
//                 <div className={css.groupFile}>
//                   <Link
//                     to={fileURL}
//                     target='blank'
//                     className={css.link}         
//                   >
//                     Прикріплений файл
//                   </Link>
//                   <Button 
//                     variant="danger"
//                     type='button' 
//                     onClick={handleDeleteFile}
//                     className={css.dangerBtn}
//                   >
//                     Видалити файл
//                   </Button>
//                 </div>
//                 :
//                 <Form.Group 
//                   controlId="formFile" 
//                   className={css.groupFile}
//                 >
//                   <Form.Control 
//                     type="file" 
//                     onChange={handleFileChange}
//                     className={css.file} 
//                   />               
//                 </Form.Group>
//               }
//               <div className={css.wrapperBtn}> 
//                 <Button 
//                   variant="primary"
//                   type="submit"
//                   disabled={isDisabledBtn}
//                   className={css.primaryBtn}
//                 >
//                   Відправити
//                 </Button>
//                 <Button
//                   onClick={() => {
//                     setIsActiveTextarea(false);
//                     setTextInput(text);
//                   }} 
//                   className={css.cancelBtn}
//                 >
//                   Скасувати
//                 </Button>
//               </div>
//             </Form.Group>              
//         </Form> 
//       }
//     </>
//   ) 
// };

// Comment.propTypes = {
//     message: PropTypes.object,
// };