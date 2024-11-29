import { useDispatch, useSelector } from 'react-redux';
import { recovery } from '../../redux/auth/operations';
import { selectIsRecovery } from '../../redux/auth/selectors';
import { ReactComponent as Favicon } from '../../icons/favicon.svg';
import bgImage from '../../service/bgimg.jpg';
import css from './Recovery.module.css';

export default function RecoveryForm () {
    const dispatch = useDispatch();
    const isRecovery = useSelector(selectIsRecovery);
    
    const isEmailValid = (email) => {
    const emailRegexp = /^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/;
    
    if (!emailRegexp.test(email)) {
      alert('Email невалідний');
      return false;
    }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        const inputEmail = form.elements.email.value;
      
        if (!isEmailValid(inputEmail)) {
            return;
        }
    
        dispatch(recovery({
            email: form.elements.email.value,
        })
        );
    };

  return (
    <div className={css.wrapper}>
      <div className={css.wrapperForm}>
        <div className={css.logo}>
          <Favicon />
          <span className={css.textLogo}>ЄДИНІ</span>
        </div>
        <h1 className={css.title}>Відновити пароль</h1>
        {!isRecovery ? (
            <>
                <p>
                    Введіть свою електронну адресу, і ми надішлимо вам інструкцію для відновлення паролю. 
                </p>
                <form className={css.form} onSubmit={handleSubmit} autoComplete="off">
                <div>
                    <input 
                        type="email" 
                        name="email" 
                        placeholder='Вкажіть вашу електронну пошту'
                        className={css.input}
                    />
                </div>          
                <button className={css.button} type="submit">Надіслати</button>
                </form>
            </>
        ) : (
            <div className={css.wrapperMsg}>
                <h2>Перевірте свою пошту</h2>
                <p>
                    Ми надіслали вам листа з інструкціями для відновлення паролю. Будь ласка, перевірте свою електронну скриньку. 
                </p>
            </div>               
        )}
      </div>
      <img src={bgImage} alt='Обкладинка' className={css.image} />
    </div>
  );
};