import React from 'react';
import {Container} from 'reactstrap';
import {ToastContainer, toast} from 'react-toastify';
import {NavMenu} from "../navMenu/NavMenu";
import 'react-toastify/dist/ReactToastify.css';

export const launchToast = (message, messageType) => {
    (messageType && toast[messageType]) ? toast[messageType](message) : toast(message);
}
export const launchError = (error) => {
    if (error?.response?.data?.message) {
        setTimeout(() => toast.error(error.response.data.message));
    } else
        setTimeout(() => toast.error('Unknown Error'));
}
export const launchSuccess = (response) => {
    if (response?.data?.message) {
        setTimeout(() => toast.success(response.data.message));
    } else if (response?.data) {
        setTimeout(() => toast.success(response.data));
    } else
        setTimeout(() => toast.success('Success'));
}

export const Layout = ({children}) => {
    return (
        <div>
            <NavMenu/>
            <ToastContainer/>
            <Container tag="main">
                {children}
            </Container>
        </div>
    );
}
