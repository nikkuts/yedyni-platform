import { useNavigate } from 'react-router-dom';
import gratitudes from '../gratitudes.json';
import css from './Gratitudes.module.css';

export default function Gratitudes () {
  const navigate = useNavigate();
  const subGratitudes = gratitudes.filter(gratitude => gratitude.typeDonation === "subscribe");
  const onceGratitudes = gratitudes.filter(gratitude => gratitude.typeDonation === "once");

    return (
      <div className={css.wrapper}>
        <p className={css.description}>Наша команда вдячна Вам за підтримку всеукраїнського руху “Єдині”! Ми впевнені: Вам не байдуже майбутнє України, адже Ви долучились до спільноти освічених людей, які підтримують українську мову. Спільними зусиллями ми зберігаємо та оберігаємо українську ідентичність!</p>
        <p className={css.description}>Для сталого розвитку і поширення української мови проєкт потребує вашої фінансової підтримки. Ми безмежно вдячні вам за ваші донати! Завдяки вашій підтримці ми маємо можливість продовжувати допомагати тисячам українців переходити на рідну мову!</p>
        <p className={css.description}>На знак подяки прийміть, будь ласка, від нас наступні дарунки. Оберіть бажаний тип та суму внеску. Після здійснення донату інформація для отримання подарунку надійде на електронну адресу, яка вказана у Вашому особистому кабінеті.</p>
        <h2 className={css.titleList}>Подяки за підписку на щомісячний донат</h2>
        <ul className={css.listGratitudes}>
          <li className={css.tr}>
            <span className={css.th1}>Сума внеску, гривень</span>
            <span className={css.th2}>Подарунок</span>
          </li>
          {subGratitudes.map(({typeDonation, fromDonation, gift}) => (
          <li className={css.tr}>
            <span className={css.tdChild1}>{fromDonation}</span>
            <span className={css.tdChild2}>{gift}</span>
            <button 
              type="button"
              onClick={() => {
                localStorage.setItem('typeDonation', typeDonation);
                localStorage.setItem('sumDonation', fromDonation);
                navigate("/uk/donat");
              }}  
              className={css.button}
            >
              Обрати
            </button>
          </li>
          ))}       
        </ul>
        <h2 className={css.titleList}>Подяки за разовий донат</h2>
        <ul className={css.listGratitudes}>
          <li className={css.tr}>
            <span className={css.th1}>Сума внеску, гривень</span>
            <span className={css.th2}>Подарунок</span>
          </li>
          {onceGratitudes.map(({typeDonation, fromDonation, gift}) => (
          <li className={css.tr}>
            <span className={css.tdChild1}>{fromDonation}</span>
            <span className={css.tdChild2}>{gift}</span>
            <button 
              type="button"
              onClick={() => {
                localStorage.setItem('typeDonation', typeDonation);
                localStorage.setItem('sumDonation', fromDonation);
                navigate("/uk/donat");
              }}    
              className={css.button}
            >
              Обрати
            </button>
          </li>
          ))}       
        </ul>
        <p className={css.description}>Завдяки Вашому внеску більше українців опанують мову, згуртуються та звільняться від впливу росії! А українська відновиться після 4 століть утисків! 💙💛</p>
        <p className={css.description}>Ще раз дякуємо за підтримку! З повагою –  команда Єдиних!</p>
      </div>
    );
  };