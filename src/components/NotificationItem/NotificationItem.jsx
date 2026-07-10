import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { Link } from 'react-router-dom';
import Linkify from 'react-linkify';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { componentDecorator } from '../../service/componentDecorator';
import { CommentsList } from '../CommentsList/CommentsList';
import { selectExercise, selectIsLoading } from '../../redux/exercises/selectors';
import { updateRating } from '../../redux/exercises/operations';
import css from './NotificationItem.module.css';

export default function NotificationItem() {
  const dispatch = useDispatch();
  const {
    _id,
    course,
    lessonId,
    owner,
    homework,
    fileURL,
    fileName,
    rating
  } = useSelector(selectExercise);
  const isLoading = useSelector(selectIsLoading);

  const [ratingInput, setRatingInput] = useState(rating);

  const handleRatingInputChange = (e) => {
    setRatingInput(e.target.value);
  };

  const isRatingValid = (num) => {
    if (Math.floor(num) !== Math.ceil(num) || num < 1 || num > 12) {
      alert('Поле "Оцінка" повинно містити ціле значення від 1 до 12.');
      return false;
    }
    return true;
  };

  const handleRatingSubmit = (e) => {
    e.preventDefault();

    const data = {
      exerciseId: _id,
      rating: ratingInput,
    }

    if (!isRatingValid(ratingInput)) {
      return;
    }

    dispatch(
      updateRating(data)
    );
  };

  useEffect(() => {
    setRatingInput(rating ?? "");
  }, [rating]);

  return ( 
    <>
      <div>{isLoading && <b>Завантаження даних...</b>}</div> 
      {owner && 
      <div className={css.containerItem}>
        <h2 className={css.title}>
          {owner.name}. {course.title}. День {lessonId} 
        </h2>
        <div className={css.form}>
          <h3 className={css.label}>Домашня робота</h3>
          <span className={css.text}>
            <Linkify componentDecorator={componentDecorator}>
              {homework}
            </Linkify>
          </span>
          {fileURL && fileURL !== '' &&
            <div className={css.wrapperLink}>
              <Link
                to={fileURL}
                target='blank'
                className={css.link}         
              >
                {fileName || 'Прикріплений файл'}
              </Link>
            </div>
          }
          </div>
          
          <Form onSubmit={handleRatingSubmit} className={css.formRating}>
            <Form.Group 
              controlId="formRating"
              className={css.groupInputRating} 
              >
              <Form.Label className={css.label}>
                  Оцінка:
              </Form.Label>
              <Form.Control
                type="number"
                value={ratingInput ?? ""}
                min={1}
                max={12}
                step={1}
                required
                inputMode="numeric"
                onChange={handleRatingInputChange}
                className={css.inputRating}
              />
              <Form.Label className={css.label}>
                  з 12
              </Form.Label>
            </Form.Group>
            <Button 
              variant="primary"
              type="submit"
              disabled={ratingInput === rating}
              className={css.primaryBtn}
            >
              {rating ? "Змінити" : "Поставити"}
            </Button>        
          </Form>
          
        <CommentsList />
      </div>
      }
    </>
  );
};
