import { useEffect, Suspense } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Outlet } from 'react-router-dom';
import { getIndicators } from '../../redux/partners/operations';
import { selectIndicators, selectIsLoading } from '../../redux/partners/selectors';
import css from './Home.module.css';

export default function Home () {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const indicators = useSelector(selectIndicators);
  const isLoading = useSelector(selectIsLoading);

    useEffect(() => {
        dispatch(getIndicators());
    }, [dispatch]);

    return (
      <>
        <div>{isLoading && <b>Завантаження даних...</b>}</div>
        {indicators &&     
        <div className={css.wrapperHome}>
            <h1 className={css.titleHome}>
                Мій українськомовний слід разом із Єдиними
            </h1>
            <div className={css.wrapperMark}>
                <div className={css.mark}>
                    {indicators.ukrainianMark || ''}
                </div>
                <span className={css.points}>балів</span>
            </div>
            <p className={css.description}>Цей показник у загальному відображає рівень моєї причетності до реалізації цілей проєкту “Єдині”. А саме, перейти на українську та допомогти це зробити іншим українцям.</p>
            <p className={css.titleTable}>Завдяки яким досягненням зростає мій українськомовний слід разом із Єдиними?</p>
            <div className={css.tableTrace}>
            <table className={css.table}>
                <thead>
                    <tr className={css.tr}>
                    <th></th>
                    <th className={css.th}>Кількість балів</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                <tr className={css.tr}>
                    <td className={css.tdChild1}><span className={css.child1}>Реєстрація на платформі</span></td>
                    <td className={css.tdChild2}>40</td>
                    <td className={css.tdChild3}></td>
                </tr>
                <tr className={css.tr}>
                    <td className={css.tdChild1}><span className={css.child1}>Завершений курс з отриманням сертифікату від проєкту “Єдині”</span></td>
                    <td className={css.tdChild2}>400</td>
                    <td className={css.tdChild3}>
                        <button type="button"
                        onClick={() => navigate("learn")} 
                        className={css.button}
                        >
                        Перейти до курсу
                        </button>
                    </td>
                </tr>
                <tr className={css.tr}>
                    <td className={css.tdChild1}><span className={css.child1}>Організація зустрічі розмовного клубу</span></td>
                    <td className={css.tdChild2}>400</td>
                    <td className={css.tdChild3}>
                        <button type="button"
                        onClick={() => navigate("clubs")} 
                        className={css.button}
                        >
                        Детальніше
                        </button>
                    </td>
                </tr>
                <tr className={css.tr}>
                    <td className={css.tdChild1}><span className={css.child1}>Проходження тестувань</span></td>
                    <td className={css.tdChild2}>сума набраних балів</td>
                    <td className={css.tdChild3}></td>
                </tr>
                <tr className={css.tr}>
                    <td className={css.tdChild1}><span className={css.child1}>Фінансова підтримка проєкту “Єдині”</span></td>
                    <td className={css.tdChild2}>сума підтримки у гривнях</td>
                    <td className={css.tdChild3}>
                        <button type="button"
                        onClick={() => navigate("donat")}  
                        className={css.button}
                        >
                        Підтримати
                        </button>
                    </td>
                </tr>
                <tr className={css.tr}>
                    <td className={css.tdChild1}><span className={css.child1}>Реєстрація на платформі нового учасника у моїй команді</span></td>
                    <td className={css.tdChild2}>40</td>
                    <td className={css.tdChild3}>
                        <button type="button"
                        onClick={() => navigate("bonus/tools")}  
                        className={css.button}
                        >
                        Детальніше
                        </button>
                    </td>
                </tr>
                <tr className={css.tr}>
                    <td className={css.tdChild1}><span className={css.child1}>Завершений курс учасником моєї команди</span></td>
                    <td className={css.tdChild2}>400</td>
                    <td className={css.tdChild3}></td>
                </tr>
                {/* <tr className={css.tr}>
                    <td className={css.tdChild1}><span className={css.child1}>Отримання винагороди у бонусній програмі</span></td>
                    <td className={css.tdChild2}>сума отриманих бонусів</td>
                    <td className={css.tdChild3}>
                        <button type="button"
                        onClick={() => navigate("bonus/rules")} 
                        className={css.button}
                        >
                        Детальніше
                        </button>
                    </td>
                </tr> */}
                <tr className={css.tr}>
                    <td className={css.tdChild1}><span className={css.child1}>Участь у олімпіаді</span></td>
                    <td className={css.tdChild2}>сума призових балів</td>
                    <td className={css.tdChild3}>
                        <button type="button"
                        onClick={() => navigate("olympiad")} 
                        className={css.button}
                        >
                        Детальніше
                        </button>
                    </td>
                </tr>
                </tbody>
            </table>
            </div>
            <h2 className={css.sertificate}>
                Мої сертифікати
            </h2>
            <Suspense fallback={null}>
            <Outlet />
            </Suspense>
        </div>
        }
      </>
    );
  };