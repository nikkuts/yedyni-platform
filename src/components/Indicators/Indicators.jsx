import { useEffect, Suspense } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, Outlet } from 'react-router-dom';
import { getIndicators } from '../../redux/partners/operations';
import { selectIndicators, selectIsLoading } from '../../redux/partners/selectors';
import { setCurrentRange } from "../../redux/payments/rangeSlice";
// import { toogleModal } from '../../redux/modal/modalSlice';
// import { selectModal } from '../../redux/modal/selectors';
// import { Withdrawal } from '../Withdrawal/Withdrawal';
import { ReactComponent as Info } from '../../icons/info.svg';
import css from './Indicators.module.css';

export default function Indicators () {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const indicators = useSelector(selectIndicators);
  const isLoading = useSelector(selectIsLoading);
  // const isModalOpen = useSelector(selectModal);

  useEffect(() => {
      dispatch(getIndicators());
  }, [dispatch]);
  
  if (isLoading) {
    return <div><b>Завантаження даних...</b></div>
  }

  return (
    <div className={css.containerBonus}>
      <div className={css.tableIndicators}>
        <table className={css.table}>
          <tbody>
            <tr className={css.tr}>
                <td className={css.tdChild1}>Мій українськомовний слід, балів</td>
                <td className={css.tdChild2}>{indicators.ukrainianMark}</td>
                <td className={css.tdChild3}>
                  {/* <button type="button"
                    onClick={() => navigate("mark")}  
                    className={css.button}
                  >
                    Детальніше
                  </button> */}
                  <Link 
                      onClick={() => dispatch(setCurrentRange())} 
                      to="/uk/bonus/mark"
                      className={css.button}
                  >
                      Детальніше
                  </Link>
                  {/* <button type="button"
                    onClick={() => dispatch(toogleModal())} 
                    className={css.button}
                  >
                    Вивести
                  </button>
                  { isModalOpen && 
                  <Withdrawal />
                  }   */}
                </td>
            </tr>
            <tr className={css.tr}>
                <td className={css.tdChild1}>Скільки українців прямо зараз переходять на українську завдяки моїм внескам на підтримку проєкту</td>
                <td className={css.tdChild2}>{indicators.currentCount}</td>
            </tr>
            <tr className={css.tr}>
                <td className={css.tdChild1}>Скільки українців вже опанували українську завдяки моїм внескам на підтримку проєкту</td>
                <td className={css.tdChild2}>{indicators.pastCount}</td>
            </tr>
            <tr className={css.tr}>
                <td className={css.tdChild1}>
                  <div className={css.level}>
                    <span>
                      Мій рівень стабільності підтримки проєкту
                    </span> 
                    <div className={css.tooltip}>
                      <Info />
                    </div>
                  </div>
                </td>
                <td className={css.tdChild2}>{indicators.levelSupport.toFixed(2)}</td>
                <td className={css.tdChild3}>
                  <button type="button"
                    onClick={() => navigate("/uk/donat")}  
                    className={css.button}
                  >
                    Підтримати
                  </button>
                </td>
            </tr>
          </tbody>
        </table>
      </div>
      <Suspense fallback={null}>
        <Outlet />
      </Suspense>
    </div>
  );
};