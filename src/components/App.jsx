import { useEffect, lazy } from "react";
import { useDispatch } from "react-redux";
import { Route, Routes } from 'react-router-dom';
import { LendingLayout } from '../pages/LendingLayout';
import { HomeLayout } from "../pages/HomeLayout";
import { BonusLayout } from "../pages/BonusLayout";
import { refreshUser } from '../redux/auth/operations';
import { useAuth } from '../hooks';
import { RestrictedRoute } from "./RestrictedRoute";
import { PrivateRoute } from "./PrivateRoute";

const LendingPage = lazy(() => import('../pages/Lending'));
const ResumeTestPage = lazy(() => import('../pages/ResumeTest'));
const HomePage = lazy(() => import('./Home/Home'));
const RegisterPage = lazy(() => import('./RegisterForm/RegisterForm'));
const LoginPage = lazy(() => import('./LoginForm/LoginForm'));
const ProfilePage = lazy(() => import('./Profile/Profile'));
const GamePage = lazy(() => import('./Game/Game'));
const OlympiadPage = lazy(() => import('./Olympiad/Olympiad'));
const DonatPage = lazy(() => import('./Donat/Donat'));
const GratitudesPage = lazy(() => import('./Gratitudes/Gratitudes'));
const IndicatorsPage = lazy(() => import('./Indicators/Indicators'));
const PaymentsPage = lazy(() => import('./Payments/Payments'));
const SubscriptionsPage = lazy(() => import('./Subscriptions/Subscriptions'));
const MarkPage = lazy(() => import('./Mark/Mark'));
const TeamPage = lazy(() => import('./Team/Team'));
const TalkClubsPage = lazy(() => import('./TalkClubs/TalkClubs'));
const LearnPage = lazy(() => import('./Learn/Learn'));
const CoursePage = lazy(() => import('./Course/Course'));
const LessonPage = lazy(() => import('./Lesson/Lesson'));
const ContentPage = lazy(() => import('./LessonFrames/Content'));
const TheoryPage = lazy(() => import('./LessonFrames/Theory'));
const PracticePage = lazy(() => import('./LessonFrames/Practice'));
const AudioAssistantPage = lazy(() => import('./AudioAssistant/AudioAssistant'));
const VideoMaterialsPage = lazy(() => import('./VideoMaterials/VideoMaterials'));
const TestPage = lazy(() => import('./Test/Test'));
const DiaryPage = lazy(() => import('./Diary/Diary'));
const NotificationsPage = lazy(() => import('./NotificationsList/NotificationsList'));
const NotificationItemPage = lazy(() => import('./NotificationItem/NotificationItem'));

export default function App () {
  const dispatch = useDispatch();
  const { isRefreshing } = useAuth();
  
  useEffect(() => {
    dispatch(refreshUser());
  }, [dispatch]);

  return isRefreshing ? (
    <b>Оновлення користувача...</b>
    ) : (  
    <Routes>
      <Route path="/" element={<LendingLayout />}>
        <Route index element={<LendingPage />} />
        <Route
          path="/register"
          element={
            <RestrictedRoute redirectTo="/uk" component={<RegisterPage />} />
          }
        />
        <Route
          path="/login"
          element={
            <RestrictedRoute redirectTo="/uk" component={<LoginPage />} />
          }
        />
        <Route
          path="/resume"
          element={
            <RestrictedRoute redirectTo="/uk" component={<ResumeTestPage />} />
          }
        />
        <Route
          path="/uk"
          element={
            <PrivateRoute redirectTo="/login" component={<HomeLayout />} />
          }
        >
          <Route index element={<HomePage />} />
          <Route path="learn" element={<LearnPage />} />
          <Route path="learn/:courseId" element={<CoursePage />} >
            <Route path=":lessonId" element={<LessonPage />} >
              <Route path="" element={<ContentPage />} />
              <Route path="theory" element={<TheoryPage />} />
              <Route path="practice" element={<PracticePage />} />
              <Route path="audio" element={<AudioAssistantPage />} />
              <Route path="video" element={<VideoMaterialsPage />} />
              <Route path="test" element={<TestPage />} />
              <Route path="diary" element={<DiaryPage />} />
            </Route>
          </Route>
          <Route path="game" element={<GamePage />} />
          <Route path="olympiad" element={<OlympiadPage />} />
          <Route path="donat" element={<DonatPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="active" element={<NotificationItemPage />} />
          <Route path="clubs" element={<TalkClubsPage />} />
          <Route path="bonus" element={<BonusLayout />} >
            <Route path="" element={<IndicatorsPage />} />
            <Route path="payments" element={<PaymentsPage />} />
            <Route path="subscriptions" element={<SubscriptionsPage />} />
            <Route path="mark" element={<MarkPage />} />
            <Route path="team" element={<TeamPage />} />
            <Route path="gratitudes" element={<GratitudesPage />} />
          </Route>
        </Route>
      </Route>
      <Route path="*" element={<LendingPage />} />
    </Routes>
  );
};