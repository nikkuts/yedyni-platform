import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { useParams } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import DatePicker, {registerLocale} from 'react-datepicker';
import uk from 'date-fns/locale/uk';
import 'react-datepicker/dist/react-datepicker.css';
import { addDiary, updateDiary } from '../../redux/diary/operations';
import { selectDiary } from '../../redux/diary/selectors';
import { selectCurrentLesson } from '../../redux/exercises/selectors';
import css from './Diary.module.css';

export default function Diary () {
    registerLocale('uk', uk)
  const dispatch = useDispatch();
  const {courseId, lessonId} = useParams();  

  const {date, test, entry, plan} = useSelector(selectDiary);
  const currentLesson = useSelector(selectCurrentLesson);
  
  const [dateInput, setDateInput] = useState(date);
  const [testInput, setTestInput] = useState(test);
  const [entryInput, setEntryInput] = useState(entry);
  const [planInput, setPlanInput] = useState(plan);
  const [isActiveTextarea, setIsActiveTextarea] = useState(false);

  const handleDateInputChange = date => {
    setDateInput(date);
  };

  const handleTestInputChange = (e) => {
    setTestInput(e.target.value);
  };

  const handleEntryChange = (e) => {
    setEntryInput(e.target.value);
    setIsActiveTextarea(true);
  };

  const handlePlanChange = (e) => {
    setPlanInput(e.target.value);
    setIsActiveTextarea(true);
  };

  const isTestValid = (num) => {
    if (Math.floor(num) !== Math.ceil(num) || num < 0 || num > 10) {
      alert('Поле "Тест" повинно містити ціле значення від 0 до 10.');
      return false;
    }
    return true;
  };

  const isTextValid = (text) => {
    if (text.length > 500) {
      alert('Поле повинно містити не більше 500 символів.');
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
   
    const data = {
      courseId,
      lessonId,
    }

    if (!isTestValid(testInput) || !isTextValid(entryInput) || !isTextValid(planInput)) {
      return;
    }

    data.date = dateInput;
    data.test = testInput;
    data.entry = entryInput;
    data.plan = planInput;
  
    if (!test && entry === '' && plan === '') {
      dispatch(
        addDiary(data)
      );
    } else {
      dispatch(
        updateDiary(data)
      );
    }
    setIsActiveTextarea(false);
  };

  useEffect(() => {
    // Функція-обробник для обробки події beforeunload
    const handleBeforeUnload = (e) => {
      // Перевірка, чи активне текстове поле, і якщо так, попередження користувача
      if (isActiveTextarea) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    // Додавання обробника події beforeunload при монтуванні компонента
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Видалення обробника події beforeunload при розмонтуванні компонента
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isActiveTextarea]);

  return (
    <>
      <Form onSubmit={handleSubmit} className={css.form}>
        <Form.Group 
            controlId="formInput"
            className={css.groupInput} 
            >
        <Form.Group 
            controlId="formDate"
            className={css.groupInputDate} 
            >
            <Form.Label className={css.label}>
                Дата:
            </Form.Label>
            <DatePicker 
                className={css.inputDate}
                selected={dateInput}
                onChange={handleDateInputChange}
                dateFormat="dd-MM-yyyy"
                maxDate={new Date()}
                locale="uk" 
            />
        </Form.Group>
        <Form.Group 
            controlId="formTest"
            className={css.groupInputTest} 
            >
            <Form.Label className={css.label}>
                Тест:
            </Form.Label>
            <Form.Control 
            as="input"
            type="number"   
            value={testInput}
            min={0}
            max={10}
            step={1}
            onChange={handleTestInputChange}
            className={css.inputTest} 
            />
            <Form.Label className={css.label}>
                з 10
            </Form.Label>
        </Form.Group>
        </Form.Group>
        <Form.Group 
          controlId="formText"
          className={css.groupTextarea} 
        >
          <Form.Label className={css.label}>
            Що я вмію?
          </Form.Label>
          <Form.Control 
            as="textarea" rows={4} 
            placeholder="Введіть текст" 
            value={entryInput} 
            onChange={handleEntryChange}
            className={css.textarea} 
          />
        </Form.Group>
        <Form.Group 
          controlId="formText"
          className={css.groupTextarea} 
        >
          <Form.Label className={css.label}>
            Над чим варто попрацювати?
          </Form.Label>
          <Form.Control 
            as="textarea" rows={4} 
            placeholder="Введіть текст" 
            value={planInput} 
            onChange={handlePlanChange}
            className={css.textarea} 
          />
        </Form.Group>
        <div className={css.wrapperBtn}>
          <Button 
            variant="primary"
            type="submit"
            className={css.primaryBtn}
          >
            Зберегти
          </Button>
        </div>        
      </Form>
      <img src={currentLesson.diary} alt='Щоденник' width="100%" />
    </>
  ) 
};