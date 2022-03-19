import React from 'react';
import * as IoIcons from 'react-icons/io';
import * as AiIcons from 'react-icons/ai';
import * as CgIcons from 'react-icons/cg';
import * as RiIcons from 'react-icons/ri';
import { accountService } from '@/_services';
import { storageHandler } from '@/_helpers';


const shouldVisible = (roles) => {
    const role = storageHandler.getUserRole();
    if (role && roles.indexOf(role) !== -1) {
        return true;
    }
    return false;
}

export const SidebarData = [
    {
        title: 'Home',
        path: '/',
        icon: <AiIcons.AiFillHome />,
        class: 'nav-text',
        action: () => { },
        visible: shouldVisible(['admin', ' influencer', 'advertiser']),
    },
    {
        title: 'Profile',
        path: '/profile',
        icon: <CgIcons.CgProfile />,
        class: 'nav-text',
        visible: shouldVisible(['admin', 'influencer', 'advertiser']),
    },
    {
        title: 'Admin',
        path: '/admin',
        icon: <RiIcons.RiAdminLine />,
        class: 'nav-text',
        visible: shouldVisible(['admin']), 
    },
    {
        title: 'Logout',
        path: '/logout',
        icon: <IoIcons.IoMdLogOut />,
        class: 'nav-text',
        action: () => accountService.logout(),
        visible: shouldVisible(['admin', ' influencer', 'advertiser']),
    },
];