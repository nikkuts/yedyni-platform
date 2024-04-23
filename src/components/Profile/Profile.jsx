import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from '../../hooks';
import { formatDate } from "../../service/handleDate";
import { getIndicators } from '../../redux/partners/operations';
import { selectIndicators } from '../../redux/partners/selectors';
import css from './Profile.module.css';

export default function Profile () {
  const dispatch = useDispatch();
  const {user} = useAuth();
  const indicators = useSelector(selectIndicators);

  useEffect(() => {
    dispatch(getIndicators()); 
  }, [dispatch]);

  return (  
    <div className={css.containerProfile}>
        <h1 className={css.title}>Профіль</h1>
        <ul className={css.userInfo}>
            <li className={css.userName}>{user.name}</li>
            <li className={css.userEmail}>{user.email}</li>
            <li>
              Дата реєстрації: 
              <span className={css.registerDate}> {formatDate(user.registerDate)}</span>
            </li>
            <li className={css.userLevel}>
              Українськомовний слід: 
              <span className={css.userLevelNum}> {indicators.ukrainianMark}</span>
            </li>
            <li className={css.userLevel}>
              Рівень стабільності підтримки: 
              <span className={css.userLevelNum}> {indicators.levelSupport.toFixed(2)}</span>
            </li>
        </ul>
    </div>
  );
};