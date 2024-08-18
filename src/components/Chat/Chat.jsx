import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import { Message } from '../Message/Message';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { getMessages } from '../../redux/chat/operations';
import { addMessage } from '../../redux/chat/slice';
import { selectMessages } from '../../redux/chat/selectors';
import { selectToken } from '../../redux/auth/selectors';
import { useAuth } from '../../hooks';
import courses from "../courses.json";
import {AXIOS_BASE_URL} from '../../constants';
import css from './Chat.module.css';

export default function Chat () {
  const socket = io(AXIOS_BASE_URL, {
    transports: ['websocket'], // Використовуйте тільки WebSocket для підключень
  });
  const dispatch = useDispatch();
  const {user} = useAuth(); 
  const token = useSelector(selectToken); 
  const messages = useSelector(selectMessages);

  const {courseId} = useParams();
  const currentCourse = courses.find(course => course.id === courseId);
  const chat = `${currentCourse.title}-${currentCourse.wave}`;

  const [textInput, setTextInput] = useState('');
  const [isActiveTextarea, setIsActiveTextarea] = useState(false);
  const [isDisabledBtn, setIsDisabledBtn] = useState(true);

  const handleTextChange = (e) => {
    const eText = e.target.value;
    setTextInput(eText);

    const newText = eText.trim();

    if (newText !== '' && newText.length <= 500) {
        setIsDisabledBtn(false);
        setIsActiveTextarea(true);
    } else {
        setIsDisabledBtn(true);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const data = {
      token,
      chat,
      text: textInput,
    };
  
    // dispatch(addMessage(data));
    socket.emit('message', data); // Відправлення повідомлення на сервер

    setTextInput('');   
    setIsActiveTextarea(false);
    setIsDisabledBtn(true);
  };

  useEffect(() => {
    // Завантаження історії чату з сервера
    dispatch(getMessages(chat));
  }, [dispatch, chat]);

  useEffect(() => {
    // Отримання повідомлень у реальному часі
    socket.on('message', (message) => {
      dispatch(addMessage(message));
    });

    // Відключення сокету при виході з компонента
    return () => {
      socket.disconnect();
    };
  }, [dispatch, socket]);

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
    <div className={css.chatContainer}>
      <h2 className={css.title}>Чат підтримки</h2>
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
              placeholder="Надішліть повідомлення" 
              value={textInput} 
              onChange={handleTextChange}
              className={css.textarea} 
            />
            {isDisabledBtn && isActiveTextarea &&
              <div className={css.text}>Повідомлення не може бути порожнім і може вміщати до 500 символів</div>
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
        {messages.slice().reverse().map(message => (
            <Message 
            key={message._id}
            message={message}
            />
        ))}
      </ul>
    </div>
  ) 
};

