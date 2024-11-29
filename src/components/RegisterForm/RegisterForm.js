import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { useSearchParams } from "react-router-dom";
import { register } from '../../redux/auth/operations';
import { ReactComponent as Favicon } from '../../icons/favicon.svg';
import { ReactComponent as EyeOff } from '../../icons/eye-off.svg';
import { ReactComponent as Eye } from '../../icons/eye.svg';
import { ReactComponent as CheckSquare } from '../../icons/check-square.svg';
import { ReactComponent as Square } from '../../icons/square.svg';
import bgImage from '../../service/bgimg.jpg';
import css from './RegisterForm.module.css';

export default function RegisterForm () {
  const [searchParams] = useSearchParams();
  const inviterId = searchParams.get("x");

  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [checkboxTransition, setCheckboxTransition] = useState(true);
  const [checkboxGrammatical, setCheckboxGrammatical] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleCheckboxCourse = () => {
    setCheckboxTransition(prev => !prev);
    setCheckboxGrammatical(prev => !prev);
  };

  const dispatch = useDispatch();

  const isNameValid = (name) => {
    const nameRegex = /^[a-zA-Zа-яА-Я\s]{2,20}$/;

    if (!nameRegex.test(name)) {
      alert(`Некоректно введено ім${`'`}я або прізвище`);
      return false;
    }
    return true;
  };

  const isEmailValid = (email) => {
    const emailRegexp = /^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/;
    
    if (!emailRegexp.test(email)) {
      alert('Email невалідний');
      return false;
    }
    return true;
  };

  const isPasswordValid = (password) => {
    const passwordRegex = /^[a-zA-Z0-9]{8,24}$/;
    // const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,30}$/;
    
    if (!passwordRegex.test(password)) {
      alert('Пароль має містити від 8 до 24 знаків');
      return false;
    }
    return true;
  };
 
  const handleSubmit = e => {
    e.preventDefault();
    const form = e.currentTarget;
    
    if (
      !isNameValid(form.elements.first_name.value) ||
      !isNameValid(form.elements.last_name.value) ||
      !isEmailValid(form.elements.email.value) ||
      !isPasswordValid(form.elements.password.value)
      ) {
        return;
    }
    const formData = {
      first_name: form.elements.first_name.value,
      last_name: form.elements.last_name.value,
      email: form.elements.email.value,
      password: form.elements.password.value,
    };
    const parseInviterId = JSON.parse(localStorage.getItem("inviterId"));

    if (parseInviterId) {
      formData.inviterId = parseInviterId;
    }

    if (checkboxTransition) {
      formData.titleCourse = 'Курс переходу';
    } else if (checkboxGrammatical) {
      formData.titleCourse = 'Граматичний курс';
    }
  
    dispatch(
      register(formData)
    );
  };

  useEffect(() => {
    if (inviterId) {
      window.localStorage.setItem("inviterId", JSON.stringify(inviterId));
    }
  }, [inviterId]);

  return (
    <div className={css.wrapper}>
      <div className={css.wrapperForm}>
        <div className={css.logo}>
          <Favicon />
          <span className={css.textLogo}>ЄДИНІ</span>
        </div>
        <h1 className={css.title}>Реєстрація</h1>
        <p>
        <span>Вже маєте акаунт?</span> <Link
          to={"/login"}
          className={css.link}
        >
          Увійти
        </Link>
        </p>
        <form className={css.form} onSubmit={handleSubmit} autoComplete="off">
          <div className={css.wrapperInput}>
            <label className={css.label}>
              Вкажіть вашу електронну пошту
            </label>
            <input 
              type="email" 
              name="email" 
              className={css.input}
            />
          </div>
          <div className={css.wrapperInput}>
            <label className={css.label}>
              Ваше ім'я
            </label>
            <input 
              type="text" 
              name="first_name" 
              className={css.input}
            />
          </div>
          <div className={css.wrapperInput}>
            <label className={css.label}>
              Ваше прізвище
            </label>
            <input 
              type="text" 
              name="last_name" 
              className={css.input}
            />
          </div>
          <div className={css.wrapperInput}>   
            <label className={css.label}>
              Придумайте пароль
            </label>
            <div className={css.passwordInput}>
              <input 
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)} 
                name="password"
                className={css.input} 
              />
              <div 
                onClick={togglePasswordVisibility}
                className={css.eye} 
              >
                {showPassword ? <Eye/> : <EyeOff/>} 
              </div>
            </div>
          </div>
          <div className={css.wrapperInput}>
            <label className={css.label}>
              Оберіть курс
            </label>
            <ul className={css.checkBoxList}>
              <li className={css.checkBox}>
                <div
                  onClick={toggleCheckboxCourse}
                >
                  {checkboxTransition ? <CheckSquare /> : <Square />}
                </div>
                <label className={css.checkBoxText}>
                  Курс переходу
                </label>
              </li>
              <li className={css.checkBox}>
                <div
                  onClick={toggleCheckboxCourse}
                >
                  {checkboxGrammatical ? <CheckSquare /> : <Square />}
                </div>
                <label className={css.checkBoxText}>
                  Граматичний курс
                </label>
              </li>
            </ul>
          </div>
          <button className={css.button} type="submit">Зареєструватися</button>
        </form>
      </div>
      <img src={bgImage} alt='Обкладинка' className={css.image} />
    </div>
  );
};