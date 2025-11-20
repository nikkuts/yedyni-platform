import { useDispatch } from "react-redux";
import { cancelSubscribe } from "../../redux/payments/operations";
import { formatDate, getNextPaymentDate } from "../../service/handleDate";
import css from './SubscriptionItem.module.css';

export const SubscriptionItem = ({_id, data, objSub}) => {
  const dispatch = useDispatch();

  return (
    <>          
      <tr>
        <td data-label="Дата підписки">{formatDate(data.end_date)}</td>
        <td data-label="Сума">{data.amount}</td>
        <td data-label="Призначення">{data.description}</td>
        <td data-label="Коментар">{data.info}</td>

        <td data-label="Наступний внесок">
            {!objSub.isUnsubscribe &&
                (objSub.lastPaymentDate
                    ? getNextPaymentDate(objSub.lastPaymentDate)
                    : "очікування проведення платежу")}
        </td>

        <td data-label="Статус">
            {!objSub.isUnsubscribe ? (
                <span className={css.statusWrap}>
                    <span className={css.statusActive}>діє</span>

                    <span
                        className={css.cancelBtn}
                        onClick={() =>
                            dispatch(cancelSubscribe({ orderId: data.order_id }))
                        }
                    >
                        скасувати
                    </span>
                </span>
            ) : (
                <span className={css.statusCanceled}>скасовано</span>
            )}
        </td>
      </tr>
    </>
  );
};