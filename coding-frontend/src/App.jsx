import {ChakraProvider, MenuList} from "@chakra-ui/react";
import React from 'react';
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import {Home} from "./Home.jsx";
import RestaurantMapView from "./restaurant/RestaurantMapView.jsx";
import "./styles/fonts.css";
import {theme} from "./component/theme.jsx";
import {MainPage} from "./restaurant/MainPage.jsx";
import {RestaurantMenuList} from "./restaurant/RestaurantMenuList.jsx";
import MapView from "./Map/MapView.jsx";
import Login from "./User/Login.jsx";
import {Signup} from "./User/Signup.jsx";



const router = createBrowserRouter([
    {
        path: "/",
        element: <Home/>,
        children:[

                // user
            {index:true, element:<MainPage/>},
            {path:"signup", element: <Signup/>},
            {path:"login", element:<Login/>},
                // map
            {path:"restaurant", element:<RestaurantMapView/>},
            {path:"menu/:placeId", element:<RestaurantMenuList/>},

        ]
    }
])
function App(props) {
    return (
        <ChakraProvider theme={theme}>
            <RouterProvider router={router} />
        </ChakraProvider>
    );
}

export default App;