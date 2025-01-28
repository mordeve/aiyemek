import { createBrowserRouter } from 'react-router-dom';
import Home from './page';
import ErrorBoundary from './error';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <Home />,
        errorElement: <ErrorBoundary />,
    },
    // Gelecekte eklenecek rotalar için:
    // {
    //   path: '/tarif/:id',
    //   element: <RecipePage />,
    //   errorElement: <ErrorBoundary />,
    // },
]); 