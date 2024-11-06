import { Suspense, useEffect } from 'react';
import { useDispatch } from "react-redux";
import { Outlet } from 'react-router-dom';
import { getIndicators } from '../redux/partners/operations';
import { useAuth } from '../hooks';
import { UserMenu } from '../components/UserMenu/UserMenu';
import './../index.css';

export const HomeLayout = () => {
  const dispatch = useDispatch();
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    if (isLoggedIn) {
      dispatch(getIndicators());
    }
  }, [dispatch, isLoggedIn]);

  return (
    <>
      <UserMenu />
      <div className="container">
        <Suspense fallback={null}>
          <Outlet />
        </Suspense>
      </div>
    </>
  );
};