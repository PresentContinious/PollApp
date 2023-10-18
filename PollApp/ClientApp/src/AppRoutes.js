import SignUp from "./pages/signUp/SignUp";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Admin from "./pages/admin/Admin";
import Test from "./pages/test/Test";

const AppRoutes = [
    {
        index: true,
        element: <Home/>
    },
    {
        path: '/sign-in',
        element: <Login/>
    },
    {
        path: '/sign-up',
        element: <SignUp/>
    },
    {
        path: '/admin',
        element: <Admin/>
    },
    {
        path: '/test/:testId',
        element: <Test/>
    }
];

export default AppRoutes;
