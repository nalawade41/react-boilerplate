import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import { SidebarData } from './SidebarData';
import { IconContext } from 'react-icons';
import { Role } from '@/_helpers';
import { accountService } from '@/_services';
import './navbar.less';

const SideNav = (props) => {
    const [sidebar, setSidebar] = useState(false);
    const [user, setUser] = useState(props.user);

    useEffect(() => {
        const subscription = accountService.user.subscribe(x => setUser(x));
        return subscription.unsubscribe;
    }, []);

    const showSidebar = () => setSidebar(!sidebar);


    // only show nav when logged in
    if (!user) return null;

    return (
        <>
            <IconContext.Provider value={{color: '#fff'}}>
                <div className="navbar">
                    <Link to={'#'} className="menu-bars">
                        <FaIcons.FaBars onClick={showSidebar}/>
                    </Link>
                </div>
                <nav className={sidebar ? 'nav-menu active': 'nav-menu'}>
                    <ul className="nav-menu-items" onClick={showSidebar}>
                        <li className="navbar-toggle">
                            <Link to={'#'} className="menu-bars">
                                <AiIcons.AiOutlineClose />
                            </Link>
                        </li>
                        {
                            SidebarData.map((item, index) => {
                                if (item.visible) {
                                    return (
                                        <li key={index} className={item.class}>
                                            <Link to={item.path} onClick={item.action}>
                                                {item.icon}
                                                <span>{item.title}</span>
                                            </Link>
                                        </li>
                                    );
                                }
                            })
                        }
                    </ul>
                </nav>
            </IconContext.Provider>
        </>
    );
};

SideNav.propTypes = {
    user: PropTypes.object,
};

export {SideNav};
