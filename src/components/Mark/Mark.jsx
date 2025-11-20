import { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { DateRange } from '../DateRange/DateRange';
import { Pagination } from '../Pagination/Pagination';
import { getMark } from "../../redux/payments/operations";
import { 
  selectIsLoading, 
  selectMark,
  selectPage,
  selectStart,
  selectEnd, 
} from '../../redux/payments/selectors';
import { formatDate } from "../../service/handleDate";
import css from './Mark.module.css';

export default function Account () {
  const dispatch = useDispatch();
  const limit = 2;

  const isLoading = useSelector(selectIsLoading);
  const mark = useSelector(selectMark);
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
      dispatch(getMark(queryParams));   
  }, [dispatch, queryParams]);

  return (
    <>
      <div>{isLoading && <b>Завантаження даних...</b>}</div> 
      <div className={css.historyWrapper}>
        <h2 className={css.title}>Історія мого українськомовного сліду</h2>
        <DateRange />

        <div className={css.tableWrapper}>
          <table className={css.table}>
            <thead>
              <tr>
                  <th>Дата</th>
                  <th>Бали</th>
                  <th>Коментар</th>
                  <th>Підсумкове значення</th>
              </tr>
            </thead>
            
            {mark.length > 0 && (
                <tbody>
                    {mark.map(elem => (
                        <tr key={elem._id}>
                            <td data-label="Дата">{formatDate(elem.date)}</td>
                            <td data-label="Бали">{elem.points}</td>
                            <td data-label="Коментар">{elem.comment}</td>
                            <td data-label="Підсумкове значення">{elem.finalValue}</td>
                        </tr>
                    ))}
                </tbody>
            )}
          </table>
        </div>
        
        <Pagination/>
      </div>
    </>
  );
};