import React, { useEffect, useState } from 'react'
import { Modal } from 'react-bootstrap';
import { gql, useLazyQuery, useMutation } from "@apollo/client";
import { useDispatch, useSelector } from 'react-redux';
import MoreSpinner from '../components/MoreSpinner';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { GoEyeClosed } from "react-icons/go";
import { IoEye } from "react-icons/io5";

export default function Login() {
    const GET_USER_QUERY = gql`
        query Query($email: String!, $password: String!) {
            getUserToken(email: $email, password: $password)
        }
    `;

    const CREATE_USER = gql`
        mutation CreateUser($firstName: String!, $lastName: String!, $email: String!, $password: String!) {
            createUser(firstName: $firstName, lastName: $lastName, email: $email, password: $password)
        }
    `;

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [hidePass, setHidePass] = useState(false);
    const [passwordType, setPasswordType] = useState("password");
    const [currComponent, setCurrComponent] = useState(false);
    const [user, setUser] = useState({
        firstName: '',
        lastName: '',
        cemail: '',
        cpassword: ''
    });

    const [getUserToken, { data, loading, error }] = useLazyQuery(GET_USER_QUERY);
    const [createUser, { data: data2, loading: loading2, error: error2 }] = useMutation(CREATE_USER);

    const handleLogin = async () => {
        try {
            await getUserToken({
                variables: { email, password }
            });
        } catch (err) {
            console.error("Login error:", err);
        }
    };

    const handleSignup = async () => {
        try {
            await createUser({
                variables: {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.cemail,
                    password: user.cpassword
                },
            });
        } catch (err) {
            console.error("Signup error:", err);
            // toast.error(err.message);
        }
    };

    useEffect(() => {
        if (data && data.getUserToken) {
            localStorage.setItem('token', data.getUserToken);
            navigate("/");
            toast.success("You are logged in");
        }
    }, [data, navigate]);

    useEffect(() => {
        if (data2 && data2.createUser) {
            localStorage.setItem('token', data2.createUser);
            navigate("/");
            toast.success("You are signed up");
        }
    }, [data2, navigate]);

    useEffect(() => {
        if (error) {
            toast.error(error.message);
        } else if (error2) {
            toast.error(error2.message);
        }
    }, [error, error2]);

    const isLoggedIn = useSelector(store => store.auth.isLoggedIn);
    useEffect(() => {
        if (isLoggedIn) {
            navigate("/");
        }
    }, [isLoggedIn, navigate]);

    const togglePasswordVisibility = () => {
        setHidePass(!hidePass);
        setPasswordType(hidePass ? "password" : "text");
    };

    return (
        <>
            <Modal className='border-rounded' show={!currComponent} centered scrollable>
                <Modal.Header className='b-black d-flex justify-content-center'>
                    <Modal.Title className='login-title text-white'>Login</Modal.Title>
                </Modal.Header>

                {loading ? <MoreSpinner /> : (
                    <div>
                        <Modal.Body className='b-black'>
                            <div className='user-info'>
                                <strong className='text-white mx-2'>Enter Your Email</strong>
                                <input onChange={(e) => setEmail(e.target.value)} type="text" value={email} placeholder="Email" className="bw-input" />
                            </div>
                            <div className="user-info">
                                <strong className='text-white mx-2'>Enter Your Password</strong>
                                <input onChange={(e) => setPassword(e.target.value)} type={passwordType} value={password} placeholder="Password" className="bw-input" />
                                <span onClick={togglePasswordVisibility} className=' password'>
                                    {hidePass ? <GoEyeClosed /> : <IoEye />}
                                </span>
                            </div>
                            <div className="container d-flex justify-content-between">
                                <button onClick={handleLogin} className='post-btn'>Log-in</button>
                                <button onClick={() => setCurrComponent(true)} className='post-btn'>Sign-up</button>
                            </div>
                        </Modal.Body>
                    </div>
                )}
            </Modal>

            <Modal className='border-rounded' show={currComponent} centered scrollable>
                <Modal.Header className='b-black d-flex justify-content-center'>
                    <Modal.Title className='login-title text-white'>Sign Up</Modal.Title>
                </Modal.Header>

                {loading2 ? <MoreSpinner /> : (
                    <Modal.Body className='b-black'>
                        <div className='user-info'>
                            <strong className='text-white mx-2'>First Name</strong>
                            <input value={user.firstName} onChange={(e) => setUser({ ...user, firstName: e.target.value })} type="text" placeholder="Enter Your First Name" className="bw-input" />
                        </div>
                        <div className='user-info'>
                            <strong className='text-white mx-2'>Last Name</strong>
                            <input onChange={(e) => setUser({ ...user, lastName: e.target.value })} value={user.lastName} type="text" placeholder="Enter Your Last Name" className="bw-input" />
                        </div>
                        <div className='user-info'>
                            <strong className='text-white mx-2'>Enter Your Email</strong>
                            <input onChange={(e) => setUser({ ...user, cemail: e.target.value })} value={user.cemail} type="email" placeholder="Email" className="bw-input" />
                        </div>
                        <div className="user-info">
                            <strong className='text-white mx-2'>Enter Your Password</strong>
                            <input onChange={(e) => setUser({ ...user, cpassword: e.target.value })} value={user.cpassword} type={passwordType} placeholder="Create Password" className="bw-input" />
                            <span onClick={togglePasswordVisibility} className=' password-signup'>
                                {hidePass ? <GoEyeClosed /> : <IoEye />}
                            </span>
                        </div>
                        <div className="container d-flex justify-content-between">
                            <button onClick={() => setCurrComponent(false)} className='post-btn'>Log-in</button>
                            <button onClick={handleSignup} className='post-btn'>Sign-up</button>
                        </div>
                    </Modal.Body>
                )}
            </Modal>
        </>
    );
}
