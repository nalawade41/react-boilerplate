import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { List } from './List';
import { AddEdit } from './AddEdit';
import { accountService } from '@/_services';

const Campaign = ({match}) => {
    const { path } = match;
    const user = accountService.userValue;

    return (
        <Switch>
            <Route exact path={path} component={List} />
            <Route path={`${path}/add`} component={AddEdit} />
            <Route path={`${path}/edit/:id`} component={AddEdit} />
        </Switch>
    );
}

Campaign.propTypes = {};

export { Campaign };