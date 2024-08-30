import { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import { Message } from '../Message/Message';
import { MessageForm } from '../MessageForm/MessageForm';
import { MessageCreationForm } from '../MessageCreationForm/MessageCreationForm';
import { getMessages } from '../../redux/chat/operations';
import { addMessage, updateMessage, deleteMessage } from '../../redux/chat/slice';
import { selectMessages } from '../../redux/chat/selectors';
import { selectIsLoading } from '../../redux/chat/selectors';
import courses from "../courses.json";
import {AXIOS_BASE_URL} from '../../constants';
import css from './Chat.module.css';

export default function Chat () {
  const socket = useMemo(() => io(AXIOS_BASE_URL, {transports: ['websocket']}), []);
  const dispatch = useDispatch(); 
  const messages = useSelector(selectMessages);
  const isLoading = useSelector(selectIsLoading);

  const {courseId} = useParams();
  const currentCourse = courses.find(course => course.id === courseId);
  const chatTitle = `${currentCourse.title}-${currentCourse.wave}`;

  const [editingMessage, setEditingMessage] = useState(null);
  const [currentEditingMessage, setCurrentEditingMessage] = useState(editingMessage);
  
  useEffect(() => {
    setCurrentEditingMessage(editingMessage);      
  }, [editingMessage]);

  useEffect(() => {
    dispatch(getMessages(chatTitle));
  }, [dispatch, chatTitle]);

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

  return (
    <>
      <div className={css.chatContainer}>
        <h2 className={css.title}>Чат підтримки</h2>
        {editingMessage && editingMessage === currentEditingMessage ? (
          <MessageForm
            socket={socket} 
            initialMessage={editingMessage}
            onSubmit={() => setEditingMessage(null)}
            onCancel={() => setEditingMessage(null)}  
          />
        ) : (
          <MessageCreationForm
            socket={socket} 
            chat={chatTitle} 
          />
        )}
        <div>{isLoading && <b>Завантаження даних...</b>}</div>
        <ul>
          {messages.slice().reverse().map((message) => (
            <li 
              key={message._id}
            >
              <Message 
                socket={socket}
                message={message}
                onEdit={() => setEditingMessage(message)}
                onCancel={() => setEditingMessage(null)}
              />
            </li>
          ))}
        </ul>
      </div>
    </>
  ) 
};

// import { useState, useEffect, useMemo, useRef } from 'react';
// import { useSelector, useDispatch } from "react-redux";
// import { useParams } from 'react-router-dom';
// import { io } from 'socket.io-client';
// import { Message } from '../Message/Message';
// import Form from 'react-bootstrap/Form';
// import Button from 'react-bootstrap/Button';
// import { getMessages, uploadFile } from '../../redux/chat/operations';
// import { addMessage, updateMessage, deleteMessage } from '../../redux/chat/slice';
// import { selectMessages } from '../../redux/chat/selectors';
// import { selectIsLoading } from '../../redux/chat/selectors';
// import { selectToken } from '../../redux/auth/selectors';
// import { useAuth } from '../../hooks';
// import courses from "../courses.json";
// import {AXIOS_BASE_URL} from '../../constants';
// import css from './Chat.module.css';

// export default function Chat () {
//   const socket = useMemo(() => io(AXIOS_BASE_URL, {transports: ['websocket']}), []);
//   const dispatch = useDispatch();
//   const {user} = useAuth(); 
//   const token = useSelector(selectToken); 
//   const messages = useSelector(selectMessages);
//   const isLoading = useSelector(selectIsLoading);

//   const {courseId} = useParams();
//   const currentCourse = courses.find(course => course.id === courseId);
//   const chatTitle = `${currentCourse.title}-${currentCourse.wave}`;

//   const [textInput, setTextInput] = useState('');
//   const [fileInput, setFileInput] = useState(null);
//   const [isDisabledBtn, setIsDisabledBtn] = useState(true);
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

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     const data = {
//       token,
//       chat: chatTitle,
//       text: textInput,
//     };

//     if (fileInput) {
//       const formData = new FormData();
//       formData.append('file', fileInput);

//       const fileURL = await dispatch(uploadFile(formData)).unwrap();
//       data.fileURL = fileURL;
//     }

//     socket.emit('message', data);

//     setTextInput('');
//     setFileInput(null);   
//     setIsDisabledBtn(true);

//     // Очищення значення file input
//     if (fileInputRef.current) {
//       fileInputRef.current.value = null;
//     }
//   };

//   const handleKeyDown = e => {
//     if (e.key === 'Enter') {
//       e.preventDefault(); 
//     }
//   };

//   useEffect(() => {
//     dispatch(getMessages(chatTitle));
//   }, [dispatch, chatTitle]);

//   useEffect(() => {
//     if (!socket.connected) {
//       socket.connect();
//       console.log('socket connect'); 
//     }
  
//     socket.on('message', (message) => {
//       if (message.chat) {
//         dispatch(addMessage(message));
//         console.log('socket new message');
//       }
//       else if (message._id && message.isDeleteMessage) {
//         dispatch(deleteMessage(message));
//         console.log('socket delete message');
//       } 
//       else if (message._id) {
//         dispatch(updateMessage(message));
//         console.log('socket update message');
//       }
//     });
  
//     return () => {
//       socket.off('message');
//       socket.disconnect();
//       console.log('socket disconnect'); 
//     };
//   }, [dispatch, socket]);

//   return (
//     <>
//       <div className={css.chatContainer}>
//         <h2 className={css.title}>Чат підтримки</h2>
//         <Form onSubmit={handleSubmit} className={css.form}>
//           <Form.Group 
//             controlId="formText"
//             className={css.groupTextarea} 
//           >
//             <Form.Label className={css.userName}>
//               {user.name}
//             </Form.Label>
//               <Form.Control 
//                 as="textarea" rows={1} 
//                 placeholder="Написати повідомлення" 
//                 value={textInput} 
//                 onChange={handleTextChange}
//                 onKeyDown={handleKeyDown}
//                 className={css.textarea} 
//               />
//           </Form.Group>
//           <div className={css.wrapperBtn}>
//             <Form.Group 
//               controlId="formFile" 
//               className={css.groupFile}
//             >
//               <Form.Control 
//                 type="file" 
//                 ref={fileInputRef}
//                 onChange={handleFileChange}
//                 className={css.file} 
//               />               
//             </Form.Group>
//             <Button 
//               variant="primary"
//               type="submit"
//               disabled={isDisabledBtn}
//               className={css.primaryBtn}
//             >
//               Відправити
//             </Button>     
//           </div>
//         </Form>
//         <div>{isLoading && <b>Завантаження даних...</b>}</div>
//         <ul className={css.list}>
//           {messages.slice().reverse().map(message => (
//             <li 
//               key={message._id}
//             >
//               <Message 
//                 message={message}
//                 socket={socket} 
//               />
//             </li>
//           ))}
//         </ul>
//       </div>
//     </>
//   ) 
// };

