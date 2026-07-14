import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import {AXIOS_BASE_URL} from '../../constants';
import { register } from '../../redux/auth/operations';
import { ReactComponent as Favicon } from '../../icons/favicon.svg';
import { ReactComponent as EyeOff } from '../../icons/eye-off.svg';
import { ReactComponent as Eye } from '../../icons/eye.svg';
import bgImage from '../../service/bgimg.jpg';
import css from './RegisterForm.module.css';

axios.defaults.baseURL = AXIOS_BASE_URL;

export default function RegisterForm() {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const contactId = searchParams.get("contactId");

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });
  const [isLoadingContact, setIsLoadingContact] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const isNameValid = (name) => {
    const nameRegex = /^[a-zA-Zа-яА-ЯїЇіІєЄґҐ\s]{2,30}$/u;
    const cleanString = name.replace(/\s+/g, ' ').trim();

    if (!nameRegex.test(cleanString)) {
      alert(`Некоректно введено ім${`'`}я або прізвище`);
      return false;
    }
    return true;
  };

  const isEmailValid = (email) => {
    const emailRegexp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
    if (!emailRegexp.test(email)) {
      alert('Email невалідний');
      return false;
    }
    return true;
  };

  const isPasswordValid = (password) => {
    const passwordRegex = /^[\w!@#$%^&*()+=\-[\]{};':"\\|,.<>/?]{8,24}$/;
    
    if (!passwordRegex.test(password)) {
      alert('Пароль може складатися з латинських літер, цифр, знаків довжиною від 8 до 24 символів');
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

    dispatch(
      register(formData)
    );
  };

  useEffect(() => {
    if (!contactId) return;
    
    const fetchContact = async () => {
      try {
        setIsLoadingContact(true);

        const { data } = await axios.get(
          `/api/contacts/${contactId.toString()}`
        );

        setFormData(prev => ({
          ...prev,
          first_name: data.first_name ?? "",
          last_name: data.last_name ?? "",
          email: data.email ?? "",
        }));
      } catch (error) {
        console.error("Помилка отримання контакту:", error);
      } finally {
        setIsLoadingContact(false);
      }
    };

    fetchContact();
  }, [contactId]);

  if (contactId && isLoadingContact) {
    return <b>Завантаження даних...</b>;
  }

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
              value={formData.email}
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
              value={formData.first_name}
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
              value={formData.last_name}
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
                name="password"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  password: e.target.value ?? "",
                }))}
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
          
          <button className={css.button} type="submit">Зареєструватися</button>
        </form>
      </div>
      <img src={bgImage} alt='Обкладинка' className={css.image} />
    </div>
  );
};
