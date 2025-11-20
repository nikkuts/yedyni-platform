import { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { DateRange } from '../DateRange/DateRange';
import { SubscriptionItem } from '../SubscriptionItem/SubscriptionItem';
import { Pagination } from '../Pagination/Pagination';
import { getSubscriptions } from "../../redux/payments/operations";
import { 
  selectIsLoading, 
  selectSubscriptions,
  selectPage,
  selectStart,
  selectEnd, 
} from '../../redux/payments/selectors';
import css from './Subscriptions.module.css';

export default function Subscriptions () {
  const dispatch = useDispatch();
  const limit = 2;

  const isLoading = useSelector(selectIsLoading);
  const subscriptions = useSelector(selectSubscriptions);
  const start = useSelector(selectStart);
  const end = useSelector(selectEnd);
  const page = useSelector(selectPage);
  
  const queryParams = useMemo(() => ({
    start,
    end,
    page: page || 1,
    limit,
  }), [start, end, page]);

  useEffect(() => {
      dispatch(getSubscriptions(queryParams)); 
  }, [dispatch, queryParams]);

  return (
    <>
      <div>{isLoading && <b>Завантаження даних...</b>}</div> 
      <div className={css.historyWrapper}>
        <h2 className={css.title}>Історія моїх підписок</h2>
        <DateRange />

        <div className={css.tableWrapper}>
          <table className={css.table}>
              <thead>
                  <tr>
                      <th>Дата підписки</th>
                      <th>Сума</th>
                      <th>Призначення</th>
                      <th>Коментар</th>
                      <th>Наступний внесок</th>
                      <th>Статус</th>
                  </tr>
              </thead>

              {subscriptions.length > 0 && (
                  <tbody>
                      {subscriptions.map(({ _id, data, objSub }) => (
                          <SubscriptionItem
                              key={_id}
                              data={data}
                              objSub={objSub}
                          />
                      ))}
                  </tbody>
              )}
          </table>
        </div>

        <Pagination />
      </div>
    </>
  );
};