import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { UserMenu } from '../components/UserMenu/UserMenu';
import './../index.css';

export const HomeLayout = () => {

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