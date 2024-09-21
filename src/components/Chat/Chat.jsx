import { useState, useEffect, useMemo, useRef } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { io } from 'socket.io-client';
import { Message } from '../Message/Message';
import { MessageEditForm } from '../MessageEditForm/MessageEditForm';
import { MessageForm } from '../MessageForm/MessageForm';
import { getMessages } from '../../redux/chat/operations';
import { addMessage, updateMessage, deleteMessage, clearMessages } from '../../redux/chat/slice';
import { selectMessages, selectFirstMessageDate } from '../../redux/chat/selectors';
import { selectIsLoading } from '../../redux/chat/selectors';
import { Comment } from 'react-loader-spinner';
import { ReactComponent as ChevronLeft } from '../../icons/chevron-left.svg';
import {AXIOS_BASE_URL} from '../../constants';
import css from './Chat.module.css';

export const Chat = ({course, onClose}) => {
  const socket = useMemo(() => io(AXIOS_BASE_URL, {transports: ['websocket']}), []);
  const dispatch = useDispatch();
  const chatTitle = `${course.title}-${course.wave}`; 

  const isLoading = useSelector(selectIsLoading);
  const messages = useSelector(selectMessages);
  const firstMessageDate = useSelector(selectFirstMessageDate);

  const [editingMessage, setEditingMessage] = useState(null);
  const [currentEditingMessage, setCurrentEditingMessage] = useState(editingMessage);
  const [page, setPage] = useState(1);

  const messagesContainerRef = useRef(null);
  const formRef = useRef(null);
  const messageRef = useRef(null);

  const handleSentMessage = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({ top: 0, behavior: 'smooth'});
    }
  };
  
  const handleEditMessage = (message) => {
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth' });
    }
    setEditingMessage(message);
  };

  const handleSaveMessage = () => {
    if (messageRef.current) {
      messageRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    setEditingMessage(null);
  };

  const handleCancelEdit = () => {
    setEditingMessage(null);
  };

  const queryParams = useMemo(() => ({
    chat: chatTitle,
    page: page || 1,
    limit: 10,
    firstMessageDate: firstMessageDate,
  }), [chatTitle, page, firstMessageDate]);

  useEffect(() => {
    dispatch(getMessages(queryParams));
  }, [dispatch, queryParams]);

  useEffect(() => {
    const containerElement = messagesContainerRef.current;
  
    const handleScroll = () => {
       // Перевірка, чи прокрутили вниз до кінця
       if (containerElement.scrollTop + containerElement.clientHeight >= containerElement.scrollHeight) {
        setPage((prevPage) => prevPage + 1); 
      }
    };
  
    if (containerElement) {
      containerElement.addEventListener('scroll', handleScroll);
    }
  
    return () => {
      if (containerElement) {
        containerElement.removeEventListener('scroll', handleScroll);
      }
    };
  }, [firstMessageDate]);

  useEffect(() => {
    setCurrentEditingMessage(editingMessage);      
  }, [editingMessage]);

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
      console.log('socket connect'); 
    }
  
    socket.on('message', (message) => {
      if (message.chat) {
        dispatch(addMessage(message));
        console.log('socket new message');
      }
      else if (message._id && message.isDeleteMessage) {
        dispatch(deleteMessage(message));
        console.log('socket delete message');
      } 
      else if (message._id) {
        dispatch(updateMessage(message));
        console.log('socket update message');
      }
    });
  
    return () => {
      socket.off('message');
      socket.disconnect();
      console.log('socket disconnect'); 
    };
  }, [dispatch, socket]);

  useEffect(() => {
    return () => {
      dispatch(clearMessages());
    };
  }, [dispatch]);

  return (
    <div className={css.chatContainer}>         
      <div className={css.chatHeader}>
        <div className={css.chevronLeft}>
          <ChevronLeft 
            onClick={() => onClose()}
          />
        </div>
        <h2 className={css.title}>{`${course.wave} хвиля. ${course.title}. Чат підтримки`}</h2>
      </div>
      
      <div ref={formRef} className={css.formContainer} >
        {editingMessage && editingMessage === currentEditingMessage ? (
          <MessageEditForm
            socket={socket} 
            initialMessage={editingMessage} 
            onSubmit={handleSaveMessage}
            onCancel={handleCancelEdit}  
          />
        ) : (
          <MessageForm
            socket={socket} 
            chat={chatTitle} 
            onSubmit={handleSentMessage}
          />
        )}
      </div>

      {firstMessageDate && firstMessageDate !== '' && 
        <ul ref={messagesContainerRef} className={css.messagesContainer}>
          {messages.length !== 0 && messages.map((message) => (
            <li 
              key={message._id}
              ref={message._id === editingMessage?._id ? messageRef : null}
            >
              <Message 
                socket={socket}
                message={message}
                onEdit={() => handleEditMessage(message)}
                onCancel={handleCancelEdit}
              />
            </li>
          ))}
        </ul>
      }

      {isLoading && 
        <div className={css.wrapperLoader}>
          <Comment
            visible={true}
            height="80"
            width="80"
            ariaLabel="comment-loading"
            wrapperStyle={{}}
            wrapperClass="comment-wrapper"
            color="#fff"
            backgroundColor="#3754fd"
          />
        </div>
      }      
    </div>
  ) 
};