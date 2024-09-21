import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from "react-redux";
import Linkify from 'react-linkify';
import { componentDecorator } from '../../service/componentDecorator';
import PropTypes from 'prop-types';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useAuth } from '../../hooks';
import { updateComment, deleteComment } from '../../redux/exercises/operations';
import { ReactComponent as MoreVertical } from '../../icons/more-vertical20.svg';
import { ReactComponent as Close } from '../../icons/x.svg';
import { ReactComponent as Edit } from '../../icons/edit.svg';
import { ReactComponent as Trash } from '../../icons/trash.svg';
import { formatDateTime } from '../../service/handleDate';
import css from './Comment.module.css';

export const Comment = ({comment, exerciseId}) => {
  const dispatch = useDispatch(); 
  const [textInput, setTextInput] = useState(comment.comment);
  const [isActiveTextarea, setIsActiveTextarea] = useState(false);
  const [isDisabledBtn, setIsDisabledBtn] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
    
  const textMenuRef = useRef();
  const {user} = useAuth();

  const handleTextChange = (e) => {
    const eText = e.target.value;
    setTextInput(eText);
    
    const newText = eText.trim();

    if (newText !== '' && newText.length <= 300) {
        setIsDisabledBtn(false);
        setIsActiveTextarea(true);
    } else {
        setIsDisabledBtn(true);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const data = {
        exerciseId,
        comment: textInput,
        commentId: comment._id,
    };
  
    dispatch(updateComment(data));
   
    setIsActiveTextarea(false);
    setIsDisabledBtn(false);
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
    <li>
        {!isActiveTextarea ?
        <div className={`${css.containerComment} ${user._id === comment.author._id && css.specialBackground}`}>
            <span className={css.author}>{comment.author.name}</span>
            <span className={css.comment}>
              <Linkify componentDecorator={componentDecorator}>
                {comment.comment}
              </Linkify>
            </span>
            <span className={css.date}>{formatDateTime(comment.date)}</span>
            {user._id === comment.author._id &&
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
                                onClick={() => dispatch(deleteComment({
                                  exerciseId,
                                  commentId: comment._id,    
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
            }
        </div>
       :
        <Form onSubmit={handleSubmit} className={css.form}>
            <div
              onClick={() => setIsActiveTextarea(false)} 
              className={css.close}
            >
              <Close className={css.closeIcon} />
            </div>
            <Form.Group 
            controlId="formText"
            >
              <Form.Label className={css.userName}>
                  {comment.author.name}
              </Form.Label>
              <div>
                <Form.Control 
                  as="textarea" rows={1} 
                  placeholder="Написати коментар" 
                  value={textInput} 
                  onChange={handleTextChange}
                  className={css.textarea} 
                />
                {isDisabledBtn && 
                  <div className={css.text}>Коментар не може бути порожнім і може вміщати до 300 символів</div>
                } 
              </div>
              <div className={css.wrapperBtn}> 
                <Button 
                  variant="primary"
                  type="submit"
                  disabled={isDisabledBtn}
                  className={css.primaryBtn}
                >
                  Відправити
                </Button>
                <Button
                  onClick={() => setIsActiveTextarea(false)} 
                  className={css.cancelBtn}
                >
                  Скасувати
                </Button>
              </div>
            </Form.Group>              
        </Form> 
      }
    </li>
  ) 
};

Comment.propTypes = {
    comment: PropTypes.object,
    exerciseId: PropTypes.string.isRequired,
};