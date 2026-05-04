import Home from './pages/Home';
import AddFood from './pages/AddFood';
import FoodDetail from './pages/FoodDetail';
import Reminders from './pages/Reminders';
import Admin from './pages/Admin';
import Settings from './pages/Settings';
import Login from './pages/Login';
import type { ReactNode } from 'react';

interface RouteConfig {
  name: string;
  path: string;
  element: ReactNode;
  visible?: boolean;
}

const routes: RouteConfig[] = [
  {
    name: 'Home',
    path: '/',
    element: <Home />,
    visible: false,
  },
  {
    name: 'Add Food',
    path: '/add',
    element: <AddFood />,
    visible: false,
  },
  {
    name: 'Food Detail',
    path: '/food/:id',
    element: <FoodDetail />,
    visible: false,
  },
  {
    name: 'Reminders',
    path: '/reminders',
    element: <Reminders />,
    visible: false,
  },
  {
    name: 'Admin',
    path: '/admin',
    element: <Admin />,
    visible: false,
  },
  {
    name: 'Settings',
    path: '/settings',
    element: <Settings />,
    visible: false,
  },
  {
    name: 'Login',
    path: '/login',
    element: <Login />,
    visible: false,
  },
];

export default routes;