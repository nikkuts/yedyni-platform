import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { Link, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { CommentsList } from '../CommentsList/CommentsList';
import { addExercise, updateExercise, deleteHomework, deleteFile } from '../../redux/exercises/operations';
import { selectExercise } from '../../redux/exercises/selectors';
import { ReactComponent as MoreVertical } from '../../icons/more-vertical.svg';
import { ReactComponent as Close } from '../../icons/x.svg';
import { ReactComponent as Edit } from '../../icons/edit.svg';
import { ReactComponent as Trash } from '../../icons/trash.svg';
import { BASE_CLIENT_URL } from '../../constants';
import css from './HomeworkForm.module.css';

export const HomeworkForm = ({courseId, lessonId}) => {
  const dispatch = useDispatch(); 
  const location = useLocation();
  const currentURL = location.pathname; 

  const {_id, homework, fileURL} = useSelector(selectExercise);
  const [textInput, setTextInput] = useState(homework);
  const [fileInput, setFileInput] = useState(null);
  const [isActiveTextarea, setIsActiveTextarea] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);

  const textMenuRef = useRef();

  const handleTextChange = (e) => {
    setTextInput(e.target.value);
    setIsActiveTextarea(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFileInput(file);
  };

  const isTextValid = (text) => {
    const newText = text.trim();
    if (newText === '' || newText.length > 3000) {
      alert('Поле повинно бути заповненим і містити не більше 3000 символів.');
      return false;
    }
    return true;
  };

  const isFileValid = (file) => {
    if (file.size > 1048576) {
      alert('Файл повинен бути не більше 1 Мб.');
      return false;
    }
    return true;
  };

  const handleDeleteFile = () => {
    if (fileURL === '') {
      return;
    };

    const formData = {
      exerciseId: _id,
      fileURL,
    };

    dispatch(
      deleteFile(formData)
    );
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
      
        if (!isFileValid(fileInput)) {
          return;
        }

        formData.append('file', fileInput);
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
    setIsActiveTextarea(false);
  };

  const shareHomework = () => {
    if (homework === '') {
      alert('Спочатку збережіть домашню роботу.');
      return;
    }

    if (fileURL && fileURL !== '') {
      window.open(`https://t.me/share/url?url=${fileURL}&text=${encodeURIComponent(homework)}`);
    } else {
      window.open(`https://t.me/share/url?url=${BASE_CLIENT_URL}${currentURL}&text=${encodeURIComponent(homework)}`);
    }
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
            <p className={css.text}>{homework}</p>
            {fileURL && fileURL !== '' &&
                <Link
                  to={fileURL}
                  target='blank'
                  className={css.link}         
                >
                  Прикріплений файл
                </Link>
            }
            <div className={css.wrapperBtn}>
              <Button
                onClick={shareHomework}
                className={css.shareBtn}
            >
                Поділитися
              </Button> 
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
          {fileURL && fileURL !== '' ?
            <div className={css.groupFile}>
              <Link
                to={fileURL}
                target='blank'
                className={css.link}         
              >
                Прикріплений файл
              </Link>
              <Button 
                variant="danger"
                type='button' 
                onClick={handleDeleteFile}
                className={css.dangerBtn}
              >
                Видалити файл
              </Button>
            </div>
            :
            <Form.Group 
              controlId="formFile" 
              className={css.groupFile}
            >
              <Form.Control 
                type="file" 
                onChange={handleFileChange}
                className={css.file} 
              />               
            </Form.Group>
          }
          <div className={css.wrapperBtn}>
            <Button 
              variant="primary"
              type="submit"
              className={css.primaryBtn}
            >
              Зберегти
            </Button>
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