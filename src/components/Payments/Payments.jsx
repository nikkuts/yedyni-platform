import { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { DateRange } from '../DateRange/DateRange';
import { Pagination } from '../Pagination/Pagination';
import { getDonats } from "../../redux/payments/operations";
import { 
  selectIsLoading, 
  selectDonats,
  selectPage,
  selectStart,
  selectEnd, 
} from '../../redux/payments/selectors';
import { formatDate } from "../../service/handleDate";
import css from './Payments.module.css';

export default function Payments () {
  const dispatch = useDispatch();
  const limit = 2;

  const isLoading = useSelector(selectIsLoading);
  const donats = useSelector(selectDonats);
  const start = useSelector(selectStart);
  const end = useSelector(selectEnd);
  const page = useSelector(selectPage);
  
  const queryParams = useMemo(() => ({
    start,
    end,
    page,
    limit,
  }), [start, end, page]);

  useEffect(() => {
      dispatch(getDonats(queryParams));   
  }, [dispatch, queryParams]);

  return (
    <>
      <div>{isLoading && <b>Завантаження даних...</b>}</div> 
      <div className={css.historyWrapper}>
        <h2 className={css.title}>Історія моїх внесків</h2>
        <DateRange />

        <div className={css.tableWrapper}>
            <table className={css.table}>
                <thead>
                    <tr>
                        <th>Дата</th>
                        <th>Сума</th>
                        <th>Призначення</th>
                        <th>Коментар</th>
                        <th>Тип внеску</th>
                    </tr>
                </thead>

                {donats.length > 0 && (
                    <tbody>
                        {donats.map(({ _id, data }) => (
                            <tr key={_id}>
                                <td data-label="Дата">{formatDate(data.end_date)}</td>
                                <td data-label="Сума">{data.amount}</td>
                                <td data-label="Призначення">{data.description}</td>
                                <td data-label="Коментар">{data.info}</td>
                                <td data-label="Тип внеску">
                                    {data.action === 'pay' ? 'разовий' : 'щомісячний'}
                                </td>
                            </tr>
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