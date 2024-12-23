import { useState } from "react";
import { useDispatch } from 'react-redux';
import { updateNextWaveCourse } from "../../redux/courses/operations";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import DatePicker, {registerLocale} from 'react-datepicker';
import uk from 'date-fns/locale/uk';
import 'react-datepicker/dist/react-datepicker.css';
import css from './NextWaveModal.module.css';

export const NextWaveModal = ({ courseId, closeModal }) => {
    registerLocale('uk', uk);
    const dispatch = useDispatch(); 
    const [waveInput, setWaveInput] = useState('');
    const [dateInput, setDateInput] = useState(null);
    const [canalInput, setCanalInput] = useState('');
    const [viberInput, setViberInput] = useState('');
    const [chatInput, setChatInput] = useState('');

    const handleDateInput = date => {
        setDateInput(date);
    };
    
    const handleWaveInput = (e) => {
        setWaveInput(e.target.value);
    };

    const handleCanalInput = (e) => {
        setCanalInput(e.target.value);
    };

    const handleViberInput = (e) => {
        setViberInput(e.target.value);
    };

    const handleChatInput = (e) => {
        setChatInput(e.target.value);
    };

    const handleSubmit = (e) => {
    e.preventDefault();
   
    const data = {
        courseId,
        nextWave: waveInput,
        nextStart: dateInput.toISOString(),
        nextCanal: canalInput,
    }

        if (viberInput) {
            data.nextViber = viberInput;;
        }

        if (chatInput) {
            data.nextChat = chatInput;;
        }

    dispatch(updateNextWaveCourse(data));   
    closeModal();
  };

  return (
    <div onClick={(e) => e.stopPropagation()}>
        <Form onSubmit={handleSubmit} className={css.form}>
            <Form.Group 
                controlId="formText"
                className={css.groupInput} 
            >
                <Form.Label className={css.label}>
                    Наступна хвиля
                </Form.Label>
                <Form.Control 
                    as="input"   
                    value={waveInput} 
                    onChange={handleWaveInput}
                    className={`${css.textarea} ${css.inputWave}`} 
                />
            </Form.Group>
            <Form.Group 
                controlId="formDate"
                className={css.groupInput} 
            >
                <Form.Label className={css.label}>
                    Дата старту 
                </Form.Label>
                <DatePicker 
                    className={`${css.textarea} ${css.inputDate}`}
                    selected={dateInput}
                    onChange={handleDateInput}
                    minDate={new Date()}
                    dateFormat="dd-MM-yyyy"
                    locale="uk" 
                />
            </Form.Group>
            <Form.Group 
                controlId="formText"
                className={css.groupInput} 
            >
                <Form.Label className={css.label}>
                    Канал 
                </Form.Label>
                <Form.Control 
                    as="input"  
                    value={canalInput} 
                    onChange={handleCanalInput}
                    className={css.textarea} 
                />
            </Form.Group>
            <Form.Group 
                controlId="formText"
                className={css.groupInput} 
            >
                <Form.Label className={css.label}>
                    Viber 
                </Form.Label>
                <Form.Control 
                    as="input"  
                    value={viberInput} 
                    onChange={handleViberInput}
                    className={css.textarea} 
                />
            </Form.Group> 
            <Form.Group 
                controlId="formText"
                className={css.groupInput} 
            >
                <Form.Label className={css.label}>
                    Чат 
                </Form.Label>
                <Form.Control 
                    as="input"  
                    value={chatInput} 
                    onChange={handleChatInput}
                    className={css.textarea} 
                />
            </Form.Group>   
            <div className={css.wrapperBtn}>
                <Button 
                    variant="primary"
                    type="submit"
                    disabled={!dateInput || !waveInput || !canalInput}
                    className={css.primaryBtn}
                >
                    Зберегти
                </Button>
                <Button
                    onClick={closeModal} 
                    className={css.cancelBtn}
                >
                    Скасувати
                </Button>
            </div>        
        </Form>
    </div>
  );
};