import { useNavigate } from 'react-router-dom';
import css from './Olympiad.module.css';

export default function Olympiad () {
  const navigate = useNavigate();

    return (
      <div className={css.container}>
        <h1 className={css.title}>Мовні олімпіади, де ви отримуєте нагороду завдяки своїм знанням з української мови</h1>
        <h2>Наступна олімпіада відбудеться вже скоро. <br/>Слідкуйте за оновленнями.</h2>
        {/* <ul>
          <li>
            Призовий фонд 5045 гривень
          </li>
          <li>
            До старту турніру залишилося 64 годин 15 хвилин 44 секунд
          </li>
          <li>
            <button 
              type="button"
              onClick={handleClickStartTournament} 
              className={css.button}
            >
              Стартувати
            </button>
              { isModalOpen && 
              <Exercise
                exercise={exercise}
              />
              }  
          </li>
          <li>
            Час проведення олімпіади обмежений. Заплануйте у своєму календарі.
          </li>
          <li>
            <button 
              type="button"
              onClick={() => navigate("/uk/game")} 
              className={css.button}
            >
              Тренуватись
            </button>
          </li>
        </ul> */}
        <ul className={css.listGame}>
            <li className={css.item}>
              <span className={css.numberItem}>1 </span>
              Готуйся до олімпіади. Виконуй різноманітні цікаві вправи у ігровій формі на сторінці “Паляниця”.
            </li>
            <li className={css.item}>
              <span className={css.numberItem}>2 </span>
              Збільшуй свої шанси на перемогу. Запроси друзів та сформуй власну команду.
            </li>
            <li className={css.item}>
              <span className={css.numberItem}>3 </span>
              Перемагай! Бери участь у олімпіаді та стань одним з 10-ти кращих учасників у особистому або командному заліку!
            </li>
        </ul>
        <h2>Переможці отримують приємні подарунки від проєкту!</h2>
        <button 
              type="button"
              onClick={() => navigate("/uk/game")} 
              className={css.button}
            >
              Тренуватись
            </button>
        <h3 className={css.result}>Топ-10 учасників попередньої олімпіади</h3>
        <ul className={css.wrapperRating}>
          <li>
            <h3 className={css.rating}>Особистий залік</h3>
            <div className={css.tableTournament}>
              <table className={css.table}>
                <thead>
                    <tr>
                        <th className={css.th}>#</th>
                        <th className={css.th}>Ім'я учасника</th>
                        <th className={css.th}>Кількість балів</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className={css.td}>1</td>
                        <td className={css.td}></td>
                        <td className={css.td}></td>
                    </tr>
                    <tr>
                        <td className={css.td}>2</td>
                        <td className={css.td}></td>
                        <td className={css.td}></td>
                    </tr>
                    <tr>
                        <td className={css.td}>3</td>
                        <td className={css.td}></td>
                        <td className={css.td}></td>
                    </tr>
                    <tr>
                        <td className={css.td}>4</td>
                        <td className={css.td}></td>
                        <td className={css.td}></td>
                    </tr>
                    <tr>
                        <td className={css.td}>5</td>
                        <td className={css.td}></td>
                        <td className={css.td}></td>
                    </tr>
                    <tr>
                        <td className={css.td}>6</td>
                        <td className={css.td}></td>
                        <td className={css.td}></td>
                    </tr>
                    <tr>
                        <td className={css.td}>7</td>
                        <td className={css.td}></td>
                        <td className={css.td}></td>
                    </tr>
                    <tr>
                        <td className={css.td}>8</td>
                        <td className={css.td}></td>
                        <td className={css.td}></td>
                    </tr>
                    <tr>
                        <td className={css.td}>9</td>
                        <td className={css.td}></td>
                        <td className={css.td}></td>
                    </tr>
                    <tr>
                        <td className={css.td}>10</td>
                        <td className={css.td}></td>
                        <td className={css.td}></td>
                    </tr>
                </tbody>
              </table>
            </div>
          </li>
          <li>
            <h3 className={css.rating}>Командний залік</h3>
            <div className={css.tableTournament}>
              <table className={css.table}>
                <thead>
                    <tr>
                        <th className={css.th}>#</th>
                        <th className={css.th}>Команда учасника</th>
                        <th className={css.th}>Кількість балів</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className={css.td}>1</td>
                        <td className={css.td}></td>
                        <td className={css.td}></td>
                    </tr>
                    <tr>
                        <td className={css.td}>2</td>
                        <td className={css.td}></td>
                        <td className={css.td}></td>
                    </tr>
                    <tr>
                        <td className={css.td}>3</td>
                        <td className={css.td}></td>
                        <td className={css.td}></td>
                    </tr>
                    <tr>
                        <td className={css.td}>4</td>
                        <td className={css.td}></td>
                        <td className={css.td}></td>
                    </tr>
                    <tr>
                        <td className={css.td}>5</td>
                        <td className={css.td}></td>
                        <td className={css.td}></td>
                    </tr>
                    <tr>
                        <td className={css.td}>6</td>
                        <td className={css.td}></td>
                        <td className={css.td}></td>
                    </tr>
                    <tr>
                        <td className={css.td}>7</td>
                        <td className={css.td}></td>
                        <td className={css.td}></td>
                    </tr>
                    <tr>
                        <td className={css.td}>8</td>
                        <td className={css.td}></td>
                        <td className={css.td}></td>
                    </tr>
                    <tr>
                        <td className={css.td}>9</td>
                        <td className={css.td}></td>
                        <td className={css.td}></td>
                    </tr>
                    <tr>
                        <td className={css.td}>10</td>
                        <td className={css.td}></td>
                        <td className={css.td}></td>
                    </tr>
                </tbody>
              </table>
            </div>
          </li>
        </ul>
        <p className={css.text}>При однаковій кількості балів перевага надається учаснику, який має вищий рівень стабільності підтримки проєкту. При однаковому значенні рівня стабільності підтримки перевага надається учаснику, який має вищий українськомовний слід.</p>
      </div>
    )
}