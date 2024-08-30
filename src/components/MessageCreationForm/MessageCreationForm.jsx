import { useState, useRef } from 'react';
import { useSelector, useDispatch } from "react-redux";
import imageCompression from 'browser-image-compression';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { uploadFile } from '../../redux/chat/operations';
import { selectToken } from '../../redux/auth/selectors';
import { useAuth } from '../../hooks';
import css from './MessageCreationForm.module.css';

export const MessageCreationForm = ({socket, chat}) => {
  const dispatch = useDispatch();
  const {user} = useAuth(); 
  const token = useSelector(selectToken); 

  const [textInput, setTextInput] = useState('');
  const [fileInput, setFileInput] = useState(null);
  const [isDisabledBtn, setIsDisabledBtn] = useState(true);
  const fileInputRef = useRef(null);

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

  const handleFileChange = async (e) => {
    const file = e.target.files[0];

    if (file.size > 1048576) {  // Перевірка розміру файлу
      alert('Файл повинен бути не більше 1 Мб.');

      // Очищення значення file input
      if (fileInputRef.current) {
        fileInputRef.current.value = null;
      }
      return;
    }

    try {
      const compressedFile = await imageCompression(file, {
        maxSizeMB: 1, // Максимальний розмір файлу після стиснення
        // maxWidthOrHeight: 800, // Максимальна висота або ширина зображення
        useWebWorker: true // Використання Web Worker для стиснення
      });

      setFileInput(compressedFile);
      setIsDisabledBtn(false);
    } catch (error) {
      console.error('Помилка стиснення файлу:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const data = {
      token,
      chat,
      text: textInput,
    };

    if (fileInput) {
      const formData = new FormData();
      formData.append('file', fileInput);

      const response = await dispatch(uploadFile(formData)).unwrap();
      data.fileURL = response.fileURL;
      data.fileType = response.fileType;
    }

    socket.emit('message', data);

    setTextInput('');
    setFileInput(null);   
    setIsDisabledBtn(true);

    // Очищення значення file input
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  const handleKeyDown = e => {
    if (e.key === 'Enter') {
      e.preventDefault(); 
      handleSubmit(e);
    }
  };

  return (
    <Form onSubmit={handleSubmit} className={css.form}>
      <Form.Group 
        controlId="formText"
        className={css.groupTextarea} 
      >
        <Form.Label className={css.userName}>
          {user.name}
        </Form.Label>
          <Form.Control 
            as="textarea" rows={1} 
            placeholder="Написати повідомлення" 
            value={textInput} 
            onChange={handleTextChange}
            onKeyDown={handleKeyDown}
            className={css.textarea} 
          />
      </Form.Group>
      <div className={css.wrapperBtn}>
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
        <Button 
          variant="primary"
          type="submit"
          disabled={isDisabledBtn}
          className={css.primaryBtn}
        >
          Відправити
        </Button>     
      </div>
    </Form>
  ) 
};
