import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from 'react-router-dom';
import { logOut } from '../../redux/auth/operations';
import { useAuth } from '../../hooks';
import { getIndicators } from '../../redux/partners/operations';
import { selectIndicators } from '../../redux/partners/selectors';
import { ReactComponent as LogOut } from '../../icons/log-out.svg';
import css from './OfficeMenu.module.css';

export const OfficeMenu = () => {
  const dispatch = useDispatch();
  const {user} = useAuth();
  const {levelSupport} = useSelector(selectIndicators);

  useEffect(() => {
    dispatch(getIndicators()); 
  }, [dispatch]);

  return (  
<>
  <ul className={css.menu}>
    <li>
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