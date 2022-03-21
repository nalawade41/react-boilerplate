import React, {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';

import { accountService } from '@/_services';

function Details({ match }) {
    const { path } = match;
    const [user, setUser] = useState(accountService.userValue)
    useEffect(() => {
        if (!user) {
            loadUserDetails();
        }
    });

    const loadUserDetails = () => {
        accountService.getById(user.data.id).then(user => {
            setUser(user);
        });
    };

    return (
        <div>
            <h1>My Profile</h1>
            <p>
                <strong>Name: </strong> {user.data.title} {user.data.firstName} {user.data.lastName}<br />
                <strong>Email: </strong> {user.data.email}
            </p>
            <p><Link to={`${path}/update`}>Update Profile</Link></p>
        </div>
    );
}

export { Details };