import React from 'react';
import { Link } from 'react-router-dom';

function Overview({ match }) {
    const { path } = match;

    return (
        <div>
            <h1>Admin</h1>
            <p>This section can only be accessed by advertiser users.</p>
            <p><Link to={`${path}/proposals`}>Manage Proposals</Link></p>
        </div>
    );
}

export { Overview };