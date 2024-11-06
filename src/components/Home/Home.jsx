import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { selectIndicators, selectIsLoading } from '../../redux/partners/selectors';
import css from './Home.module.css';

export default function Home () {
  const navigate = useNavigate();
  const indicators = useSelector(selectIndicators);
  const isLoading = useSelector(selectIsLoading);

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
            <p className={css.description}>Цей показник у загальному відображає рівень моєї причетності до реалізації цілей проєкту “Єдині”. А саме, перейти на українську та допомогти це зробити <span className={css.num}>1 000 000</span> українців.</p>
            <p className={css.titleTable}>Завдяки яким досягненням зростає мій українськомовний слід разом із Єдиними?</p>          
            <ul className={css.listTrace}>
                <li className={css.trHead}>
                    <span className={css.th1}></span>
                    <span className={css.th2}>Кількість балів</span>
                </li>
                <li className={css.tr}>
                    <span className={css.tdchild1}>Реєстрація на платформі</span>
                    <span className={css.tdchild2}>40<br/><span className={css.bal}>балів</span></span>
                </li>
                <li className={css.tr}>
                    <span className={css.tdchild1}>Завершений курс з отриманням сертифікату від проєкту “Єдині”</span>
                    <span className={css.tdchild2}>400<br/><span className={css.bal}>балів</span></span>
                    <button type="button"
                        onClick={() => navigate("learn")} 
                        className={css.button}
                        >
                        Перейти до курсу
                    </button>
                </li>
                <li className={css.tr}>
                    <span className={css.tdchild1}>Організація зустрічі розмовного клубу</span>
                    <span className={css.tdchild2}>400<br/><span className={css.bal}>балів</span></span>
                    <button type="button"
                        onClick={() => navigate("clubs")} 
                        className={css.button}
                        >
                        Детальніше
                    </button>
                </li>
                <li className={css.tr}>
                    <span className={css.tdchild1}>Проходження тестувань</span>
                    <span className={css.tdchild2}>сума набраних балів</span>
                </li>
                <li className={css.tr}>
                    <span className={css.tdchild1}>Фінансова підтримка проєкту “Єдині”</span>
                    <span className={css.tdchild2}>сума підтримки у гривнях</span>
                    <button type="button"
                        onClick={() => navigate("donat")} 
                        className={css.button}
                        >
                        Підтримати
                    </button>
                </li>
                <li className={css.tr}>
                    <span className={css.tdchild1}>Реєстрація на платформі нового учасника у моїй команді</span>
                    <span className={css.tdchild2}>40<br/><span className={css.bal}>балів</span></span>
                    <button type="button"
                        onClick={() => navigate("bonus/team")} 
                        className={css.button}
                        >
                        Детальніше
                    </button>
                </li>
                <li className={css.tr}>
                    <span className={css.tdchild1}>Завершений курс учасником моєї команди</span>
                    <span className={css.tdchild2}>400<br/><span className={css.bal}>балів</span></span>
                </li>
                <li className={css.tr}>
                    <span className={css.tdchild1}>Участь у олімпіаді</span>
                    <span className={css.tdchild2}>сума призових балів</span>
                    <button type="button"
                        onClick={() => navigate("olympiad")} 
                        className={css.button}
                        >
                        Детальніше
                    </button>
                </li>
            </ul>
            <h2 className={css.sertificate}>
                Мої сертифікати
            </h2>
        </div>
        }
      </>
    );
  };