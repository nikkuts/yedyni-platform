import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { Comment } from "../Comment/Comment";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { addComment } from '../../redux/exercises/operations';
import { selectExercise } from '../../redux/exercises/selectors';
// import { selectComments } from '../../redux/exercises/selectors';
import { useAuth } from '../../hooks';
import css from './CommentsList.module.css';

export const CommentsList = ({courseId, lessonId}) => {
  const dispatch = useDispatch();
  const {user} = useAuth();  
  const {comments} = useSelector(selectExercise);
  // const comments = useSelector(selectComments);
  const [textInput, setTextInput] = useState('');
  const [isActiveTextarea, setIsActiveTextarea] = useState(false);
  const [isDisabledBtn, setIsDisabledBtn] = useState(true);

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
        courseId, 
        lessonId,
        author: user.name,
        comment: textInput,
    };
  
    dispatch(addComment(data));

    setTextInput('');   
    setIsActiveTextarea(false);
    setIsDisabledBtn(true);
  };

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
    <div className={css.containerComments}>
      <h2 className={css.title}>Коментарі</h2>
      <Form onSubmit={handleSubmit} className={css.form}>
        <Form.Group 
          controlId="formText"
          className={css.groupTextarea} 
        >
          <Form.Label className={css.userName}>
            {user.name}
          </Form.Label>
          <div>
            <Form.Control 
              as="textarea" rows={1} 
              placeholder="Залиши коментар" 
              value={textInput} 
              onChange={handleTextChange}
              className={css.textarea} 
            />
            {isDisabledBtn && isActiveTextarea &&
              <div className={css.text}>Коментар не може бути порожнім і може вміщати до 300 символів</div>
            } 
          </div>
          <Button 
            variant="primary"
            type="submit"
            disabled={isDisabledBtn}
            className={css.primaryBtn}
          >
            Відправити
          </Button>   
        </Form.Group>  
      </Form>
      <ul className={css.list}>
        {comments.slice().reverse().map(comment => (
            <Comment 
            key={comment._id}
            comment={comment}
            courseId={courseId}
            lessonId={lessonId}
            />
        ))}
      </ul>
    </div>
  ) 
};

