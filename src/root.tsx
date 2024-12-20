import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { App } from './App';
import { HomePage } from './pages/HomePage';
import { NotFoundPage } from './pages/NotFoundPage';

export const Root = () => (
  <Router>
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<HomePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  </Router>
);
