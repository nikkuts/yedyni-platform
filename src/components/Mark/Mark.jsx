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
          <div>
            <h2 className={css.title}>Історія українськомовного сліду</h2>
            <DateRange />
            <div className={css.tableHistory}>
                <table className={css.table}>
                  <thead>
                    <tr>
                        <th className={css.th}>Дата</th>
                        <th className={css.th}>Бали</th>
                        <th className={css.th}>Коментар</th>
                        <th className={css.th}>Підсумкове значення</th>
                    </tr>
                  </thead>
                  {mark.length !== 0 && 
                  <tbody>
                  {mark.map(item => (           
                      <tr 
                        key={item._id}
                        className={css.tr}
                      >
                        <td className={css.td}>{formatDate(item.date)}</td>
                        <td className={css.td}>{item.points}</td>
                        <td className={css.td}>{item.comment}</td>
                        <td className={css.td}>{item.finalValue}</td>
                      </tr>
                  ))}
                  </tbody>
                  }
                </table>
              </div>
              <Pagination/>
          </div>
        </>
      );
    };