import React, { useEffect, useState } from 'react'
// import { IoIosArrowDown } from "react-icons/io";
import Homeitems from '../components/Homeitems';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../ThemeContext';
export default function Home() {
    const navigate = useNavigate();
    const { theme } = useTheme();
    const [isOpen, setOpen] = useState(false)

    const isLoggedIn = useSelector(store => store.auth.isLoggedIn);
    useEffect(() => {
        if (isLoggedIn) {
            navigate("/")
        }
    }, []);
    const toggleDropdown = () => {
        setOpen(!isOpen)
    }
    return (
        <div className="d-flex flex-column main-post-res">

            <div className='d-flex justify-content-center top-nav' style={{ width: '95vw', height: "10vh" }}>
                <h5 onClick={toggleDropdown} style={{ height: "3vh" }} className={`my-3 ${theme} `}>For you </h5>
                {/* {isOpen === true ? <div className={`Dropdown-Container ${theme}`}>
                    <h5 className={`my-3 ${theme}`}>For you</h5>
                    <h5 className={`my-3 ${theme}`}>Following</h5>
                    <h5 className={`my-3 ${theme}`}>Saved</h5>
                    <h5 className={`my-3 ${theme}`}>Liked</h5>
<IoIosArrowDown />

                </div> : null} */}
            </div>
            <Homeitems />
        </div>

    )
}
