import { useState, useEffect, useMemo, useRef } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { io } from 'socket.io-client';
import { Message } from '../Message/Message';
import { MessageForm } from '../MessageForm/MessageForm';
import { getMessages } from '../../redux/chat/operations';
import { addMessage, updateMessage, deleteMessage, setEditingMessage, clearMessages } from '../../redux/chat/slice';
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

  const [page, setPage] = useState(1);
  const messagesContainerRef = useRef(null);

  const handleSentMessage = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = 0;
    }
  };

  const handleEditMessage = (message) => {
    dispatch(setEditingMessage(message));
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

      <div className={css.formContainer}>    
        <MessageForm
          socket={socket} 
          chat={chatTitle} 
          onSent={handleSentMessage}
        />      
      </div>

      {firstMessageDate && firstMessageDate !== '' && 
        <div ref={messagesContainerRef} className={css.messagesContainer}>
          <ul>
            {messages.length !== 0 && messages.map((message) => (
              <li key={message._id}>
                <Message 
                  socket={socket}
                  message={message}
                  onEdit={() => handleEditMessage(message)}
                />
              </li>
            ))}
          </ul>
        </div>
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


// Форма знизу

/* import { useState, useEffect, useMemo, useRef } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { io } from 'socket.io-client';
import { Message } from '../Message/Message';
import { MessageForm } from '../MessageForm/MessageForm';
import { getMessages } from '../../redux/chat/operations';
import { addMessage, updateMessage, deleteMessage, setEditingMessage, clearMessages } from '../../redux/chat/slice';
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

  const [page, setPage] = useState(1);
  const messagesContainerRef = useRef(null);

  const handleSentMessage = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = 0;
    }
  };

  const handleEditMessage = (message) => {
    dispatch(setEditingMessage(message));
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
    let debounceTimeout = null;
  
    const handleScroll = () => {
      // Перевіряємо досягнення верхньої межі
      if (
        containerElement.scrollTop <=
        (containerElement.clientHeight - containerElement.scrollHeight + 10) &&
        containerElement.scrollTop >=
        (containerElement.clientHeight - containerElement.scrollHeight)
      ) {
        if (debounceTimeout) return; // Пропускаємо виклик, якщо таймер ще не завершився
  
        debounceTimeout = setTimeout(() => {
          setPage((prevPage) => prevPage + 1);
          debounceTimeout = null; // Скидаємо таймер
        }, 300); // Встановлюємо таймер на 500 мс
      }
    };
  
    if (containerElement) {
      containerElement.addEventListener('scroll', handleScroll);
    }
  
    return () => {
      if (containerElement) {
        containerElement.removeEventListener('scroll', handleScroll);
      }
      clearTimeout(debounceTimeout); // Очищуємо таймер при розмонтуванні
    };
  }, [firstMessageDate]);
  

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

      {firstMessageDate && firstMessageDate !== '' && 
        <div ref={messagesContainerRef} className={css.messagesContainer}>
          <ul>
            {messages.length !== 0 && messages.slice().reverse().map((message) => (
              <li key={message._id}>
                <Message 
                  socket={socket}
                  message={message}
                  onEdit={() => handleEditMessage(message)}
                />
              </li>
            ))}
          </ul>
        </div>
      }

      <div className={css.formContainer}>    
        <MessageForm
          socket={socket} 
          chat={chatTitle} 
          onSent={handleSentMessage}
        />      
      </div>

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
 */

/* import { useState, useEffect, useMemo, useRef } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { io } from 'socket.io-client';
import { Message } from '../Message/Message';
import { MessageForm } from '../MessageForm/MessageForm';
import { getMessages } from '../../redux/chat/operations';
import { addMessage, updateMessage, deleteMessage, setEditingMessage, clearMessages } from '../../redux/chat/slice';
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

  const [page, setPage] = useState(1);
  const messagesContainerRef = useRef(null);

  const handleSentMessage = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        behavior: 'smooth',
        top: 0,
      });
    }
  };

  const handleEditMessage = (message) => {
    dispatch(setEditingMessage(message));
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
      containerElement.addEventListener('scroll', handleScroll)
    }
  
    return () => {
      if (containerElement) {
        containerElement.removeEventListener('scroll', handleScroll);
      }
    };
  }, [firstMessageDate]);

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
      
      <div className={css.formContainer}>    
          <MessageForm
            socket={socket} 
            chat={chatTitle} 
            onSent={handleSentMessage}
          />      
      </div>

      {firstMessageDate && firstMessageDate !== '' && 
        <div ref={messagesContainerRef} className={css.messagesContainer}>
          <ul>
            {messages.length !== 0 && messages.map((message) => (
              <li key={message._id}>
                <Message 
                  socket={socket}
                  message={message}
                  onEdit={() => handleEditMessage(message)}
                />
              </li>
            ))}
          </ul>
        </div>
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
}; */