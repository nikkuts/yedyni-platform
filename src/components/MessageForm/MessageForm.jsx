import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import imageCompression from 'browser-image-compression';
import PropTypes from 'prop-types';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { uploadFile } from '../../redux/chat/operations';
import { selectToken } from '../../redux/auth/selectors';
import { ReactComponent as Close } from '../../icons/x.svg';
import { ReactComponent as Trash } from '../../icons/trash.svg';
import css from './MessageForm.module.css';

export const MessageForm = ({socket, initialMessage, onSubmit, onCancel}) => {
  const dispatch = useDispatch(); 
  const token = useSelector(selectToken);
  const {_id, text, fileURL, sender } = initialMessage; 

  const [textInput, setTextInput] = useState(text);
  const [fileInput, setFileInput] = useState(null);
  const [deletedFile, setDeletedFile] = useState(null);
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

  const handleDeleteFile = () => {
    if (fileURL === '') {
      return;
    };
    setDeletedFile(fileURL);

    if (textInput !== '' && textInput.trim().length <= 500) {
      setIsDisabledBtn(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const data = {
      token,
      messageId: _id,
      text: textInput,
    };
  
    if (fileInput) {
      const formData = new FormData();
      formData.append('file', fileInput);

      const response = await dispatch(uploadFile(formData)).unwrap();
      data.fileURL = response.fileURL;
      data.fileType = response.fileType;
    }

    if (deletedFile) {
      data.deletedFile = deletedFile;
    }
 
    socket.emit('message', data);
  
    setIsDisabledBtn(true);
    setDeletedFile(null);
    onSubmit();
  };

  const handleKeyDown = e => {
    if (e.key === 'Enter') {
      e.preventDefault(); 
      handleSubmit(e);
    }
  };

  return (
    <Form onSubmit={handleSubmit} className={css.form}>
        <div
          onClick={() => {
            setTextInput(text);
            onCancel();
          }}  
          className={css.close}
        >
          <Close className={css.closeIcon} />
        </div>
        <Form.Group 
        controlId="formText"
        className={css.groupTextarea} 
        >
          <Form.Label className={css.userName}>
              {sender.name}
          </Form.Label>
          <div>
            <Form.Control 
              as="textarea" rows={1} 
              placeholder="Надішліть повідомлення" 
              value={textInput} 
              onChange={handleTextChange}
              onKeyDown={handleKeyDown}
              className={css.textarea} 
            />
          </div>
          <div className={css.wrapperBtn}> 
          {fileURL && fileURL !== '' && !deletedFile ?
            <div className={css.groupFile}>
              <Link
                to={fileURL}
                target='blank'
                className={css.link}         
              >
                Прикріплений файл
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
                onChange={handleFileChange}
                className={css.file} 
              />               
            </Form.Group>
          }
            <div className={css.groupBtn}> 
              <Button 
                variant="primary"
                type="submit"
                disabled={isDisabledBtn}
                className={css.primaryBtn}
              >
                Зберегти
              </Button>
              <Button
                onClick={() => {
                  setTextInput(text);
                  onCancel();
                }} 
                className={css.cancelBtn}
              >
                Скасувати
              </Button>
            </div>
          </div>
        </Form.Group>              
    </Form> 
  ) 
};

MessageForm.propTypes = {
    initialMessage: PropTypes.object,
};
