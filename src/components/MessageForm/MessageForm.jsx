import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import PropTypes from 'prop-types';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { uploadFile } from '../../redux/chat/operations';
import { selectToken } from '../../redux/auth/selectors';
import { ReactComponent as Close } from '../../icons/x.svg';
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file.size > 1048576) {
      alert('Файл повинен бути не більше 1 Мб.');

      // Очищення значення file input
      if (fileInputRef.current) {
        fileInputRef.current.value = null;
      }
    } else {
      setFileInput(file);
      setIsDisabledBtn(false);
    }
  };

  const handleDeleteFile = () => {
    if (fileURL === '') {
      return;
    };

    setDeletedFile(fileURL);
    setIsDisabledBtn(false);
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

      const fileURL = await dispatch(uploadFile(formData)).unwrap();
      data.fileURL = fileURL;
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
          {fileURL && fileURL !== '' && !deletedFile ?
            <div className={css.groupFile}>
              <Link
                to={fileURL}
                target='blank'
                className={css.link}         
              >
                Прикріплений файл
              </Link>
              <Button 
                variant="danger"
                type='button' 
                onClick={handleDeleteFile}
                className={css.dangerBtn}
              >
                Видалити файл
              </Button>
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
          <div className={css.wrapperBtn}> 
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
        </Form.Group>              
    </Form> 
  ) 
};

MessageForm.propTypes = {
    initialMessage: PropTypes.object,
};
