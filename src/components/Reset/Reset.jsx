import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { reset } from '../../redux/auth/operations';
import { ReactComponent as Favicon } from '../../icons/favicon.svg';
import { ReactComponent as EyeOff } from '../../icons/eye-off.svg';
import { ReactComponent as Eye } from '../../icons/eye.svg';
import bgImage from '../../service/bgimg.jpg';
import css from './Reset.module.css';

export default function ResetForm() {
  const dispatch = useDispatch();
  const { token } = useParams();
  
  const [password, setPassword] = useState('');
  const [confirmpass, setConfirmpass] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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

    if (!isPasswordValid(password)) {
        return;
    }

    if (password !== confirmpass) {
      alert('Помилка при повторі паролю');
      return;
    }

    dispatch(
      reset({token, password})
    );
  };

  return (
<div className={css.wrapper}>
      <div className={css.wrapperForm}>
        <div className={css.logo}>
          <Favicon />
          <span className={css.textLogo}>ЄДИНІ</span>
        </div>
        <h1 className={css.title}>Створіть новий пароль</h1>
        <p>
        Введіть новий пароль для свого особистого кабінету та підтвердіть його, щоб завершити відновлення доступу. 
        </p>
        <form className={css.form} onSubmit={handleSubmit} autoComplete="off">
          <div className={css.wrapperInput}>   
            <div className={css.passwordInput}>
              <input 
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)} 
                name="password"
                placeholder='Придумайте пароль'
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
            <div className={css.passwordInput}>
              <input 
                type={showPassword ? 'text' : 'password'}
                value={confirmpass}
                onChange={(e) => setConfirmpass(e.target.value)} 
                name="confirmpass"
                placeholder='Повторіть пароль'
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
          <button className={css.button} type="submit">Підтвердити</button>
        </form>
         <Link
          to={"/recovery"}
          className={css.link}
        >
          Повторити спробу
        </Link>
      </div>
      <img src={bgImage} alt='Обкладинка' className={css.image} />
    </div>
  );
};