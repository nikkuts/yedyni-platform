import { useState, useRef } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { Link } from 'react-router-dom';
import imageCompression from 'browser-image-compression';
import PropTypes from 'prop-types';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { uploadFile } from '../../redux/chat/operations';
import { selectToken } from '../../redux/auth/selectors';
import { ReactComponent as Close } from '../../icons/x20.svg';
import { ReactComponent as Trash } from '../../icons/trash.svg';
import { ReactComponent as Send } from '../../icons/send.svg';
import css from './MessageEditForm.module.css';

export const MessageEditForm = ({socket, initialMessage, onSubmit, onCancel}) => {
  const dispatch = useDispatch(); 
  const token = useSelector(selectToken);
  const {_id, text, fileURL, fileType } = initialMessage; 

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
    setIsDisabledBtn(false);
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
      fileURL,
      fileType,
    };

    if (deletedFile) {
      data.deletedFile = deletedFile;
      data.fileURL = '';
      data.fileType = '';
    }

    if (fileInput) {
      const formData = new FormData();
      formData.append('file', fileInput);

      const response = await dispatch(uploadFile(formData)).unwrap();
      data.fileURL = response.fileURL;
      data.fileType = response.fileType;
    } 
 
    socket.emit('message', data);
  
    setIsDisabledBtn(true);
    setDeletedFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
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
        onClick={() => onCancel()}  
        className={css.close}
      >
        <Close />
      </div>
      <Form.Group 
        controlId="formText"
        className={css.groupTextarea} 
      >
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
        {fileURL && fileURL !== '' && !deletedFile ?
          <div className={css.groupBtn}>
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

MessageEditForm.propTypes = {
    initialMessage: PropTypes.object,
};
