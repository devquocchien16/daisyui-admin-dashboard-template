import React, { useState } from 'react';
import { unwrapResult } from '@reduxjs/toolkit';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {loginAdmin, setAdminInfo} from '../../slice/adminSlice';
import AdminSignin from './AdminSignin';

function Login() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [admin, setAdmin] = useState(null);

    const handleSubmit = async (values) => {
        console.log('form submit', values);
        try {
            const adminId = await dispatch(loginAdmin(values));
            const result_admin = await dispatch(setAdminInfo(adminId.payload));
            const admin = unwrapResult(result_admin);
            setAdmin(admin)
            setTimeout(() => {
                navigate("/app/welcome");
            }, 0);
        } catch (error) {
            console.log('fail to login', error);

        }
    };

    return (
        <div><AdminSignin onSubmit = {handleSubmit}/></div>
       
    );
}

export default Login;
