import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { Link } from 'react-router-dom';
import Linkify from 'react-linkify';
import { componentDecorator } from '../../service/componentDecorator';
import imageCompression from 'browser-image-compression';
import PropTypes from 'prop-types';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { CommentsList } from '../CommentsList/CommentsList';
import { selectCourse } from '../../redux/courses/selectors';
import { addExercise, updateExercise, deleteHomework, deleteFile } from '../../redux/exercises/operations';
import { selectExercise } from '../../redux/exercises/selectors';
import { openChat, setEditingMessage } from '../../redux/chat/slice';
import { ReactComponent as MoreVertical } from '../../icons/more-vertical.svg';
import { ReactComponent as Close } from '../../icons/x.svg';
import { ReactComponent as Edit } from '../../icons/edit.svg';
import { ReactComponent as Trash } from '../../icons/trash.svg';
import css from './HomeworkForm.module.css';

export const HomeworkForm = ({courseId, lessonId}) => {
  const dispatch = useDispatch();
  const currentCourse = useSelector(selectCourse);
  const {_id, homework, fileURL, fileType, fileName} = useSelector(selectExercise);

  const [textInput, setTextInput] = useState(homework);
  const [fileInput, setFileInput] = useState(null);
  const [originalFileName, setOriginalFileName] = useState(null);
  const [isDisabledBtn, setIsDisabledBtn] = useState(true);
  const [isActiveTextarea, setIsActiveTextarea] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);

  const textMenuRef = useRef();
  const fileInputRef = useRef(null);

  const handleTextChange = (e) => {
    setTextInput(e.target.value);
    setIsActiveTextarea(true);
    setIsDisabledBtn(false);
  };

  const isTextValid = (text) => {
    const newText = text.trim();
    if (newText === '' || newText.length > 3000) {
      alert('Поле повинно бути заповненим і містити не більше 3000 символів.');
      return false;
    }
    return true;
  };

  const handleFileChange = async (e) => {
    let file = e.target.files[0];
    
    if (file.type.startsWith('image/')) {
      try {
        file = await imageCompression(file, {
          useWebWorker: true 
        });
      } catch (error) {
        console.error('Помилка стиснення файлу:', error);
      }
    } 

    if (file.size > 10 * 1024 * 1024) {  
      alert('Файл повинен бути не більше 10 Мб.');

      if (fileInputRef.current) {
        fileInputRef.current.value = null;
      }
      return;
    }

    setFileInput(file);
    setOriginalFileName(file.name);
    setIsDisabledBtn(false);
  };

  const handleDeleteFile = () => {
    if (fileURL === '') {
      return;
    };

    const data = {
      exerciseId: _id,
      fileURL,
    };

    dispatch(
      deleteFile(data)
    );

    if (textInput !== '' && textInput.trim().length <= 3000) {
      setIsDisabledBtn(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const formData = new FormData();

    if (_id) {
      formData.append('exerciseId', _id);
    } else {
      formData.append('courseId', courseId);
      formData.append('lessonId', lessonId);
    }

    if (!isTextValid(textInput)) {
      return;
    }

    formData.append('homework', textInput.trim());

    if (fileInput) {
      formData.append('file', fileInput);
      formData.append('originalname', originalFileName);
    }
  
    if (_id) {
      dispatch(
        updateExercise(formData)
      );
    } else {
      dispatch(
        addExercise(formData)
      );
    }

    setFileInput(null); 
    setOriginalFileName(null);  
    setIsDisabledBtn(true);
    setIsActiveTextarea(false);
  };

  // const shareHomework = () => {
  //   if (homework === '') {
  //     alert('Спочатку збережіть домашню роботу.');
  //     return;
  //   }

  //   if (fileURL && fileURL !== '') {
  //     window.open(`https://t.me/share/url?url=${fileURL}&text=${encodeURIComponent(homework)}`);
  //   } else {
  //     window.open(`https://t.me/share/url?url=${BASE_CLIENT_URL}${currentURL}&text=${encodeURIComponent(homework)}`);
  //   }
  // };

  const shareHomework = () => {
    if (homework === '') {
      alert('Спочатку збережіть домашню роботу.');
      return;
    }

    const data = {
      text: homework,
    };

    if (fileURL && fileURL !== '') {
      data.fileURL = fileURL;
    } 

    if (fileType && fileType !== '') {
      data.fileType = fileType;
    } 

    if (fileName && fileName !== '') {
      data.fileName = fileName;
    }

    dispatch(setEditingMessage(data));
    
    dispatch(openChat({
        title: currentCourse.title,
        wave: currentCourse.wave
    }));
  };

const handleClickOutside = (e) => {
    if (textMenuRef.current && !textMenuRef.current.contains(e.target)) {
    setMenuVisible(false);
    }
};

const toggleMenu = () => {
    setMenuVisible((prevVisible) => !prevVisible);
};

useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
    document.removeEventListener('click', handleClickOutside);
    };
}, []);

  useEffect(() => {
    // Функція-обробник для обробки події beforeunload
    const handleBeforeUnload = (e) => {
      // Перевірка, чи активне текстове поле, і якщо так, попередження користувача
      if (isActiveTextarea) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    // Додавання обробника події beforeunload при монтуванні компонента
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Видалення обробника події beforeunload при розмонтуванні компонента
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isActiveTextarea]);

  return (
    <>
      {_id && !isActiveTextarea ?
        <div className={css.form}>
            <h3 className={css.label}>Домашня робота</h3>
            <span className={css.text}>
              <Linkify componentDecorator={componentDecorator}>
                {homework}
              </Linkify>
            </span>
            <div className={css.wrapperBtn}>
              <Link
                onClick={shareHomework}
                className={css.shareBtn}
              >
                Поділитися
              </Link> 
            {fileURL && fileURL !== '' &&
              <Link
                to={fileURL}
                target='blank'
                className={css.link}         
              >
                {fileName}
              </Link>
            }
            </div>     
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
                                onClick={() => setIsActiveTextarea(true)} 
                                className={css.menuLink}          
                            >
                                <Edit />
                                Редагувати
                            </Link>
                        </li>
                        <li>
                            <Link 
                                onClick={() => dispatch(deleteHomework({
                                  exerciseId: _id,    
                                }))} 
                                className={css.menuLink}
                            >
                                <Trash />
                                Видалити
                            </Link>
                        </li>
                    </ul>
                }
            </div>
        </div>
       :
        <Form onSubmit={handleSubmit} className={css.form}>
          {_id &&
          <div
            onClick={() => setIsActiveTextarea(false)} 
            className={css.close}
          >
            <Close className={css.closeIcon} />
          </div>
          }
          <Form.Group 
            controlId="formText"
            className={css.groupTextarea} 
          >
            <Form.Label className={css.label}>
              Домашня робота
            </Form.Label>
            <Form.Control 
              as="textarea" rows={10} 
              placeholder="Введіть текст" 
              value={textInput} 
              onChange={handleTextChange}
              className={css.textarea} 
            />
          </Form.Group>
          <div className={css.wrapperBtn}>
            <Button 
              variant="primary"
              type="submit"
              disabled={isDisabledBtn}
              className={css.primaryBtn}
            >
              Зберегти
            </Button>
          {fileURL && fileURL !== '' ?
            <div className={css.groupBtn}>
              <Link
                to={fileURL}
                target='blank'
                className={css.link}         
              >
                {fileName || 'Прикріплений файл'}
              </Link>
              <div
                onClick={handleDeleteFile}
                className={css.trash}
              >
                <Trash className={css.trashIcon} />
              </div>
            </div>
            :
            <Form.Group 
              controlId="formFile" 
              className={css.groupFile}
            >
              <Form.Control 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileChange}
                className={css.file} 
              />               
            </Form.Group>
          }
          </div>        
        </Form>
      }
      {_id && <CommentsList />}
    </>
  ) 
};

HomeworkForm.propTypes = {
  courseId: PropTypes.string.isRequired,
  lessonId: PropTypes.string.isRequired,
};