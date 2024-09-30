import { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { Link } from 'react-router-dom';
import imageCompression from 'browser-image-compression';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { uploadFile } from '../../redux/chat/operations';
import { clearEditingMessage } from '../../redux/chat/slice';
import { selectEditingMessage } from '../../redux/chat/selectors';
import { selectToken } from '../../redux/auth/selectors';
import { ReactComponent as Close } from '../../icons/x20.svg';
import { ReactComponent as Trash } from '../../icons/trash.svg';
import { ReactComponent as Send } from '../../icons/send.svg';
import css from './MessageForm.module.css';

export const MessageForm = ({ socket, chat, onSent }) => {
  const dispatch = useDispatch();
  const token = useSelector(selectToken); 
  const editingMessage = useSelector(selectEditingMessage);
  const { _id = null, text = '', fileURL = '', fileType = '', fileName = '' } = editingMessage || {};

  const [textInput, setTextInput] = useState('');
  const [fileInput, setFileInput] = useState(null);
  const [originalFileName, setOriginalFileName] = useState(null);
  const [deletedFile, setDeletedFile] = useState(null);
  const [isDisabledBtn, setIsDisabledBtn] = useState(true);
  
  const textInputRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleTextChange = (e) => {
    const eText = e.target.value;
    setTextInput(eText);
    const newText = eText.trim();
    
    if (
      (newText.trim() !== '' && newText.length <= 500) || 
      fileInput || 
      (newText.trim() === '' && fileURL && !deletedFile)
    ) {
        setIsDisabledBtn(false);
    } else {
        setIsDisabledBtn(true);
    }
    
    textInputRef.current.style.height = `${Math.min(textInputRef.current.scrollHeight, 10 * 1.5 * 14)}px`;
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

    if (file.size > 15 * 1024 * 1024) {  
      alert('Файл повинен бути не більше 15 Мб.');

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
    setDeletedFile(fileURL);

    if (textInput !== '' && textInput.trim().length <= 500) {
      setIsDisabledBtn(false);
    } else {
      setIsDisabledBtn(true);
    }

    if (textInputRef.current) {
      textInputRef.current.focus();
    }
  };

  const handleCancelEdit = () => {
    dispatch(clearEditingMessage());

    setTextInput('');
    setFileInput(null);
    setOriginalFileName(null);
    setDeletedFile(null);
    setIsDisabledBtn(true);

    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }

    if (textInputRef.current) {
      textInputRef.current.style.height = 'auto';
      textInputRef.current.focus();
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const data = {
      token,
      text: textInput,
      fileURL,
      fileType,
      fileName,
    };

    if (deletedFile) {
      data.deletedFile = deletedFile;
      data.fileURL = '';
      data.fileType = '';
      data.fileName = '';
    }

    if (fileInput) {
      const formData = new FormData();
      formData.append('file', fileInput);
      formData.append('originalname', originalFileName);

      const response = await dispatch(uploadFile(formData)).unwrap(); 
      
      data.fileURL = response.fileURL;
      data.fileType = response.fileType;
      data.fileName = response.fileName;
    }

    if (_id) {
      data.messageId = _id;
    } else {
      data.chat = chat;
      onSent();
    }

    socket.emit('message', data);

    setTextInput('');
    setFileInput(null); 
    setOriginalFileName(null); 
    setDeletedFile(null); 
    setIsDisabledBtn(true);

    if (editingMessage) {
      dispatch(clearEditingMessage());
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }

    if (textInputRef.current) {
      textInputRef.current.style.height = 'auto';
      textInputRef.current.focus();
    }
  };

  const handleKeyDown = e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); 
      handleSubmit(e);
    }
  };

  useEffect(() => {
    if (text) {
      setTextInput(text);

      if (text !== '' && text.trim().length <= 500) {
        setIsDisabledBtn(false);
      }

      if (textInputRef.current) {
        setTimeout(() => {
          textInputRef.current.style.height = 'auto'; 
          textInputRef.current.style.height = `${Math.min(textInputRef.current.scrollHeight, 10 * 1.5 * 14)}px`;
          textInputRef.current.focus(); 
        }, 0);
      }
    }
  }, [text]);

  useEffect(() => {
    if (textInputRef.current) {
      textInputRef.current.focus();
    }
  }, []);

  return (
    <Form 
      onSubmit={handleSubmit} 
      className={css.form}
    >
      {editingMessage &&
        <div
          onClick={handleCancelEdit}  
          className={css.close}
        >
          <Close />
        </div>
      }
      <Form.Group 
        controlId="formText" 
      >
        <Form.Control 
          ref={textInputRef}
          as="textarea" 
          rows={1} 
          placeholder="Написати повідомлення" 
          value={textInput} 
          onChange={handleTextChange}
          onKeyDown={handleKeyDown}
          className={`${css.textarea} ${editingMessage && css.upper}`} 
        />
      </Form.Group>
      <div className={css.wrapperBtn}> 
        {fileURL && fileURL !== '' && !deletedFile ?
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
        <Button 
          variant="primary"
          type="submit"
          disabled={isDisabledBtn}
          className={css.primaryBtn}
        >
          <Send />
        </Button> 
      </div>             
    </Form>
  ) 
};