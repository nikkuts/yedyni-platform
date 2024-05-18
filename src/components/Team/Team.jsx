import { useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import CopyUrl from '../CopyUrl/CopyUrl';
import { getTeam, getByIdPartnerTeam, saveTeam, restorePreviosTeam } from '../../redux/partners/operations';
import { selectIsLoading, selectPartner, selectHistory } from '../../redux/partners/selectors';
import { useAuth } from '../../hooks';
import { formatDate } from "../../service/handleDate";
import { ReactComponent as SkipBack } from '../../icons/skip-back.svg';
import { BASE_CLIENT_URL } from '../../constants';
import css from './Team.module.css';

export default function Team() {
  const dispatch = useDispatch();
  const {user} = useAuth();
  const isLoading = useSelector(selectIsLoading);
  const partner = useSelector(selectPartner);
  const history = useSelector(selectHistory);

  const showPreviousTeam = () => {
    const previousTeam = history[history.length - 1];
    dispatch(restorePreviosTeam(previousTeam));
  };

  useEffect(() => {
    dispatch(getTeam()); 
  }, [dispatch]);

    return (
      <div className={css.containerTeam}>
        <h1 className={css.title}>Поклич друзів разом опановувати українську та сформуй свою команду!</h1>
        <div className={css.wrapperRef}>
        <h2 className={css.refLink}>Запрошувальне покликання</h2>
        <CopyUrl url={`${BASE_CLIENT_URL}?x=${user.id}`} />
        </div>
        <div>{isLoading && <b>Завантаження даних...</b>}</div>
        {partner && 
          <div className={css.wrapperTeam}>
            <div className={css.wrapperPartner}>
              {history.length > 0 &&
                <div className={css.btnBack}
                  onClick={showPreviousTeam}
                >
                  <SkipBack />
                </div>
              }
              <h2 className={css.subtitle}>Команда</h2>
              <ul className={css.userInfo}>
                <li className={css.userName}>{partner.name}</li>
                <li className={css.userEmail}>{partner.email}</li>
                <li>Рівень команди: {history.length + 1}</li>
                <li>Учасників: {partner.team.length}</li>
              </ul>
            </div>
            {partner.team.length !== 0 &&
              <div className={css.tableTeam}>
                <table className={css.table}>
                  <thead>
                    <tr>
                        <th className={css.th}>Дата реєстрації</th>
                        <th className={css.th}>Ім'я</th>
                        <th className={css.th}>Email</th>
                        <th className={css.th}>Учасників</th>
                    </tr>
                  </thead>
                  <tbody>
                  {partner.team.map(member => (           
                      <tr 
                        key={member._id}
                        onClick={() => {
                          dispatch(saveTeam(partner))
                          dispatch(getByIdPartnerTeam(member._id))
                        }}
                        className={css.tr}
                      >
                        <td className={css.td}>{formatDate(member.createdAt)}</td>
                        <td className={css.td}>{member.name}</td>
                        <td className={css.td}>{member.email}</td>
                        <td className={css.td}>{member.team.length}</td>
                      </tr>
                  ))}
                  </tbody>
                </table>
              </div>
            }
          </div>
        }
      </div>
    );
  };