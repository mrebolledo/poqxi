import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {createHashRouter, RouterProvider} from 'react-router'
import Economy from "./pages/Economy.tsx";
import Mid from "./pages/Mid.tsx";
import Premium from "./pages/Premium.tsx";

// Define tus rutas usando createBrowserRouter
const router = createHashRouter([
    {
        path: "/",
        element: <App />,
        // App actúa como layout
        children: [
            {
                path : "economy",
                element : <Economy />
            },
            {
                path : "mid",
                element : <Mid />
            },
            {
                path : "premium",
                element : <Premium />
            },
        ]
    },
]);

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <RouterProvider router={router} />
    </StrictMode>,
)