import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { Link } from 'react-router-dom';
import axios from 'axios';
import {AXIOS_BASE_URL, API_PAY_ENDPOINT} from '../../constants';
import { getNewLevelSupport } from '../../service/getNewLevelSupport';
import { getIndicators } from '../../redux/partners/operations';
import { selectIndicators, selectIsLoading } from '../../redux/partners/selectors';
import { ReactComponent as CheckSquare } from '../../icons/check-square.svg';
import { ReactComponent as Square } from '../../icons/square.svg';
import css from './Donat.module.css';

axios.defaults.baseURL = AXIOS_BASE_URL;

export default function Donat () {
  // const apiPayEndpoint = API_PAY_ENDPOINT;

  const [checkboxSubscription, setCheckboxSubscription] = useState(true);
  const [checkboxOnce, setCheckboxOnce] = useState(false);
  const [checkboxOfertaAgreed, setCheckboxOfertaAgreed] = useState(false);
  const [currentAmount, setCurrentAmount] = useState('');
  
  const isLoading = useSelector(selectIsLoading);
  const indicators = useSelector(selectIndicators);
  const {totalTime, totalDonat} = indicators;
  const dispatch = useDispatch();

  const handleCurrentAmount = (e) => {
    setCurrentAmount(e.target.value);
  }

  const toggleCheckboxType = () => {
    setCheckboxSubscription(prev => !prev);
    setCheckboxOnce(prev => !prev);
  };

  const toggleCheckboxOferta = () => {
    setCheckboxOfertaAgreed(prev => !prev);
  };

  const isAmountValid = (value) => {
    const amount = parseFloat(value);
    if (isNaN(amount) || amount % 40 !== 0) {
      alert('Сума повинна бути кратною 40');
      return false;
    }
    return true;
  };

  const isCommentValid = (comment) => {
    if (comment.length > 30) {
      alert('Коментар повинен бути не більше 30 символів');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!checkboxOfertaAgreed) {
      alert('Будь ласка, погодьтесь з умовами договору оферти');
      return;
    } 
    else {
      const calc = e.currentTarget;
      const amount = calc.elements.amount.value;
      const comment = calc.elements.comment.value.trim();

      if (!isAmountValid(amount)) {
        return;
      }
      
      if (!isCommentValid(comment)) {
        return;
      }

      const formData = {amount};

      if (comment !== '') {
        formData.comment = comment;
      }

      if (checkboxSubscription) {
        formData.subscribe = '1';
      }

      try {
        const response = await axios.post("/api/payments/donat", formData);
        const postData = response.data;

        // Створення форми та автоматичне надсилання
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = API_PAY_ENDPOINT;
        form.acceptCharset = 'utf-8';
    
        // Додавання прихованих полів
        Object.entries(postData).forEach(([name, value]) => {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = name;
          input.value = value;
          form.appendChild(input);
        });
    
        // Додавання форми до body та автоматичне відправлення
        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form); 
      } 
      catch (error) {
        console.error('Помилка під час відправлення форми:', error);
        alert('Помилка відправки форми. Будь ласка, спробуйте повторити.');
      }
      finally {
        localStorage.removeItem('typeDonation');
        localStorage.removeItem('sumDonation'); 
        calc.reset();
      }
    }
  };

  useEffect(() => {
    dispatch(getIndicators()); 
  }, [dispatch]);

  useEffect(() => {
    const type = localStorage.getItem('typeDonation');
    const sum = localStorage.getItem('sumDonation');

    if (type && sum) {
      if (type === 'once') {
        setCheckboxSubscription(false);
        setCheckboxOnce(true);
      }
      setCurrentAmount(sum);
    }

    const removeLocalStorageItems = () => {
      localStorage.removeItem('typeDonation');
      localStorage.removeItem('sumDonation');
    };

    window.addEventListener('beforeunload', removeLocalStorageItems);

    return () => {
      removeLocalStorageItems();
      window.removeEventListener('beforeunload', removeLocalStorageItems); 
    };
  }, []);

  if (isLoading) {
    return <div><b>Завантаження даних...</b></div>
  }

  return (
    <div className={css.containerDonat}>
      <h1 className={css.titleDonat}>
        Допоможи
        1 000 000 земляків
        перейти на українську
        та звільнитися
        від впливу росії
      </h1>
      <h2 className={css.decriptionDonat}>
        Кожні 40 гривень Вашої підтримки
        надають проєкту можливість допомогти
        1 українцеві на місяць перейти на українську!
      </h2>
      <form onSubmit={handleSubmit} className={css.formDonat}>
        <ul className={css.listForm}>
          <li className={css.checkBox}>
            <ul>
              <li className={css.checkBox}>
                <div
                  onClick={toggleCheckboxType}
                >
                  {checkboxSubscription ? <CheckSquare /> : <Square />}
                </div>
                <label className={css.text}>
                  Щомісячний внесок
                </label>
              </li>
              <li className={css.checkBox}>
                <div
                  onClick={toggleCheckboxType}
                >
                  {checkboxOnce ? <CheckSquare /> : <Square />}
                </div>
                <label className={css.text}>
                  Разовий внесок
                </label>
              </li>
            </ul>
          </li>
          <li>
            <label className={css.label}>
              Введіть бажану суму у гривнях кратну 40
            </label>
            <div className={css.wrapperInput}>
              <input className={css.input}
                type="number"
                name="amount"
                value={currentAmount}
                placeholder='480'
                onChange={handleCurrentAmount}
              />
              <span className={css.uah}>
                {checkboxSubscription ? 'грн/міс' : 'грн'}
              </span>
            </div>
          </li>
          <li>
            <label className={css.label}>
              Мій новий рівень стабільності підтримки
            </label>
            <div className={css.levelNum}>
              {currentAmount !== '' && getNewLevelSupport(totalTime, totalDonat, currentAmount).toFixed(2)}
            </div>
          </li>
          <li>
            <label className={css.label}>
              Додайте коментар за бажанням
            </label>
            <textarea className={css.textarea}
              id="comment"
              name="comment"
            >
            </textarea>
          </li>
          <li>
            <button
              type="submit"
              className={css.button}>
              Підтримати
            </button>
          </li>
          <li className={css.checkBox}>
            <div
              onClick={toggleCheckboxOferta}
            >
              {checkboxOfertaAgreed ? <CheckSquare /> : <Square />}
            </div>
            <label className={css.text}>
              Я погоджуюсь з <Link
                to="https://yedyni.org/wp-content/uploads/2023/08/dogovir-oferty.pdf"
                target="_blank"
                className={css.oferta}
              >
                Публічною офертою
              </Link>
            </label>
          </li>
        </ul>
      </form>
    </div>
  )
};