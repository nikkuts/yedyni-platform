import { useState } from "react";
import { Link } from 'react-router-dom';
import { ReactComponent as Copy } from '../../icons/copy.svg';
import { ReactComponent as Telegram } from '../../icons/telegram.svg';
import css from './CopyUrl.module.css'

const text = 'Тут проходжу безкоштовний курс та отримую потужну підтримку у переході на українську! Доєднуйся'

export default function CopyUrl({ url }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500); // ховаємо через 1.5 сек
  };

  return (
    <div className={css.wrapper}>
      <input 
        value={url} 
        readOnly
        className={css.input} 
      />

      <div className={css.copyWrapper}>
        <button onClick={handleCopy} className={css.button}>
          <Copy />
          <span className={css.text}>Скопіювати</span>
        </button>

        {copied && <span className={css.copiedToast}>Скопійовано!</span>}
      </div>

      <Link
        to={`https://t.me/share/url?url=${url}&text=${encodeURIComponent(text)}`} 
        target='_blank'
        className={css.telegramBtn}
      >
        <Telegram />
      </Link>
    </div>
  );
}
