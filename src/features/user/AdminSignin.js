import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import PropTypes from 'prop-types';
import LandingIntro from "./LandingIntro";
import ErrorText from "../../components/Typography/ErrorText";
import { Link } from "react-router-dom";

AdminSignin.propTypes = {
    onSubmit: PropTypes.func
};

function AdminSignin(props) {
    const schema = yup.object().shape({
        email: yup.string().required('Please enter email'),
        password: yup.string().required('Please enter password'),
    });
    const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
        resolver: yupResolver(schema),
    });
    const onSubmitHandler = async (value) => {
        console.log('login form', value);
        const { onSubmit } = props;
        // Check if the parent component has called onSubmit
        if (onSubmit) {
            await onSubmit(value)
        }
        // reset();
    }
    return (
        <div className="min-h-screen bg-base-200 flex items-center">
            <div className="card mx-auto w-full max-w-5xl shadow-xl">
                <div className="grid md:grid-cols-2 grid-cols-1 bg-base-100 rounded-xl">
                    <div className=''>
                        <LandingIntro />
                    </div>
                    <div className='py-24 px-10'>
                        <h2 className='text-2xl font-semibold mb-2 text-center'>Login</h2>
                        <form onSubmit={handleSubmit(onSubmitHandler)}>
                            <div className="mb-4">
                                <div className="mt-4">
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                        Email
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        {...register("email")}
                                        className="mt-1 focus:ring-primary focus:border-primary block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                    />
                                    {errors.email && <ErrorText>{errors.email.message}</ErrorText>}
                                </div>
                                <div className="mt-4">
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                        Password
                                    </label>
                                    <input
                                        id="password"
                                        type="password"
                                        {...register("password")}
                                        className="mt-1 focus:ring-primary focus:border-primary block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                    />
                                    {errors.password && <ErrorText>{errors.password.message}</ErrorText>}
                                </div>
                            </div>
                            <div className='text-right text-primary'>
                                <Link to="/forgot-password">
                                    <span className="text-sm inline-block hover:text-primary hover:underline hover:cursor-pointer transition duration-200">Forgot Password?</span>
                                </Link>
                            </div>
                            <button type="submit" className={"btn mt-2 w-full btn-primary"}>Login</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminSignin;
