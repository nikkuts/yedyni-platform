import { useState, useEffect, useMemo } from 'react';
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
  const socket = useMemo(() => io(AXIOS_BASE_URL, {transports: ['websocket']}), []);
  const dispatch = useDispatch();
  const {user} = useAuth(); 
  const token = useSelector(selectToken); 
  const messages = useSelector(selectMessages);

  const {courseId} = useParams();
  const currentCourse = courses.find(course => course.id === courseId);
  const chatTitle = `${currentCourse.title}-${currentCourse.wave}`;

  const [textInput, setTextInput] = useState('');
  const [isDisabledBtn, setIsDisabledBtn] = useState(true);

  const handleTextChange = (e) => {
    const eText = e.target.value;
    setTextInput(eText);

    const newText = eText.trim();

    if (newText !== '' && newText.length <= 500) {
        setIsDisabledBtn(false);
    } else {
        setIsDisabledBtn(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const data = {
      token,
      chat: chatTitle,
      text: textInput,
    };

    socket.emit('message', data);

    setTextInput('');   
    setIsDisabledBtn(true);
  };

  useEffect(() => {
    dispatch(getMessages(chatTitle));
  }, [dispatch, chatTitle]);

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
      console.log('socket connect'); 
    }
  
    // Отримання повідомлення від сервера і додавання до стану
    socket.on('message', (message) => {
      dispatch(addMessage(message));
      console.log('socket message');
    });
  
    return () => {
      socket.off('message');
      socket.disconnect();
      console.log('socket disconnect'); 
    };
  }, [dispatch, socket]);

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

