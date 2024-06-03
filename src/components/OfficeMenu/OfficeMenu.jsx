import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from 'react-router-dom';
import { logOut } from '../../redux/auth/operations';
import { useAuth } from '../../hooks';
import { getIndicators } from '../../redux/partners/operations';
import { selectIndicators } from '../../redux/partners/selectors';
import { getMessages } from '../../redux/exercises/operations';
import { selectCountMessages, selectIsLoading } from '../../redux/exercises/selectors';
import { ReactComponent as LogOut } from '../../icons/log-out.svg';
import { Navigation } from "../Navigation/Navigation";
import css from './OfficeMenu.module.css';

export const OfficeMenu = () => {
  const dispatch = useDispatch();
  const {user} = useAuth();
  const {levelSupport} = useSelector(selectIndicators);
  const countMessages = useSelector(selectCountMessages);
  const isLoading = useSelector(selectIsLoading);

  useEffect(() => {
    dispatch(getIndicators());
    dispatch(getMessages()); 
  }, [dispatch]);

  return (  
<>
  <div>{isLoading && <b>Завантаження даних...</b>}</div>
  <ul className={css.menu}>
    <li>
      <div className={css.nav}>
        <Navigation />
      </div>
      <ul className={css.userInfo}>
        <li className={css.userName}>{user.name}</li>
        <li className={css.userEmail}>{user.email}</li>
        <li className={css.userLevel}>
          Рівень стабільності підтримки: 
          <span className={css.userLevelNum}> {levelSupport.toFixed(2)}</span>
        </li>
      </ul>
    </li>
    <li>
      <ul className={css.officeLink}>
        <li>
          <Link  
              to="profile"
              className={css.link}
          >
              Профіль
          </Link>
        </li>
        <li>
          <Link  
              to="messages"
              className={css.link}
          >
              Повідомлення 
              {countMessages && 
                <span className={css.count}>{countMessages}</span>
              }
          </Link>
        </li>
        <li>
        </li>
        <li>
          <Link  
              to="clubs"
              className={css.link}
          >
              Розмовні клуби
          </Link>
        </li>
        <li>
        <Link  
              to="bonus"
              className={css.link}
          >
              Програма підтримки
          </Link>
        </li>
        <li>
        <Link  
            onClick={() => dispatch(logOut())}
            to="/login"
            className={css.link}
        >
            <div className={css.logout}>
              <span>Вийти</span>
              <LogOut/>
            </div>
        </Link>
        </li>
      </ul>
    </li>
  </ul>
</>
  );
};