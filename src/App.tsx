import { Outlet } from 'react-router-dom';
import styles from './App.module.scss';
import { Header } from './components/Header';
import { Footer } from './components/Footer';

export const App = () => {

  return (
    <div className={styles.page}>
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
};
