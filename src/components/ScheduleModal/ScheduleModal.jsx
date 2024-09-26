import { useState, useEffect } from "react";
import { useDispatch } from 'react-redux';
import { updateScheduledDateLesson } from "../../redux/courses/operations";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import DatePicker, {registerLocale} from 'react-datepicker';
import uk from 'date-fns/locale/uk';
import 'react-datepicker/dist/react-datepicker.css';
import css from './ScheduleModal.module.css';

export const ScheduleModal = ({ courseId, lesson, closeModal }) => {
    registerLocale('uk', uk);
  const dispatch = useDispatch();
  const [dateInput, setDateInput] = useState(lesson.scheduledDate ? new Date(lesson.scheduledDate) : null);

  const handleDateInputChange = date => {
    setDateInput(date);
  };

  const handleSave = () => {
    // Конвертуємо дату в ISO-формат для передачі на сервер
    const isoDate = dateInput.toISOString();

    dispatch(updateScheduledDateLesson({
      courseId,
      lessonId: lesson.day, 
      scheduledDate: isoDate,
    }));
    
    closeModal();
  };

const onBackdropClose = e => {
    if (e.currentTarget === e.target) {
        closeModal();
    }
  };

useEffect(() => {
    const keyDown = e => {
      if (e.code === 'Escape') {
        closeModal();
      }
    };
    window.addEventListener('keydown', keyDown);
    return () => {window.removeEventListener('keydown', keyDown);}
  }, [closeModal])

  return (
    <div  
      onClick={onBackdropClose}
      className={css.overlay}
    >
      <div onClick={(e) => e.stopPropagation()}>
        <Form onSubmit={handleSave} className={css.form}>
          <Form.Group 
              controlId="formDate"
              className={css.groupInputDate} 
              >
              <Form.Label className={css.label}>
                Запланувати відкриття уроку {lesson.day}
              </Form.Label>
              <DatePicker 
                  className={css.inputDate}
                  selected={dateInput}
                  onChange={handleDateInputChange}
                  minDate={new Date()}
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={15}
                  dateFormat="Pp"
                  placeholderText="Виберіть дату та час"
                  locale="uk" 
              />
          </Form.Group>
          <div className={css.wrapperBtn}>
            <Button 
              variant="primary"
              type="submit"
              disabled={!dateInput}
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
    </div>
  );
};