import React, { useState, useEffect } from 'react';
import { Route, Switch, Redirect, useLocation } from 'react-router-dom';

import { Role } from '@/_helpers';
import { accountService } from '@/_services';
import { PrivateRoute, Alert, SideNav } from '@/_components';

import { Home } from '@/home';
import { Profile } from '@/profile';
import { Admin } from '@/admin';
import { Account } from '@/account';
import { Advertiser } from '@/advertiser';

function App() {
    const { pathname } = useLocation();  
    const [user, setUser] = useState({});
    useEffect(() => {
        const subscription = accountService.user.subscribe(x => setUser(x));
        return subscription.unsubscribe;
    }, []);
    return (
        <div className={'app-container' + (user && ' bg-light')}>
            <SideNav user={user}/>
            <Alert />
            <Switch>
                <Redirect from="/:url*(/+)" to={pathname.slice(0, -1)} />
                <PrivateRoute exact path="/" component={Home} />
                <PrivateRoute path="/profile" component={Profile} />
                <PrivateRoute path="/advertiser" component={Advertiser} />
                <PrivateRoute path="/admin" roles={[Role.Admin]} component={Admin} />
                <Route path="/account" component={Account} />
                <Redirect from="*" to="/" />
            </Switch>
        </div>
    );
}

export { App }; 