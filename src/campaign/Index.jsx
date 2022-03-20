import React from 'react';

import { accountService } from '@/_services';

const Campaign = () => {
    const user = accountService.userValue;

    return (
        <div className="p-4">
            <div className="container">
                <h1>Hi {user.firstName}!</h1>
                <p>You're logged in with React & JWT!! And you are on Campaign page</p>
            </div>
        </div>
    );
}

Campaign.propTypes = {};

export { Campaign };