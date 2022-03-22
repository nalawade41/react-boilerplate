import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { accountService } from '@/_services';
import { Proposal } from './proposals';
import { Overview } from './Overview';
import { Campaign } from './campaign';
import { Content } from './contents';

const Advertiser = ({match}) => {
    const user = accountService.userValue;

    if (!user) {
        
    }

    const { path } = match;
    return (
        <div className="p-4">
            <div className="container">
                <Switch>
                    <Route exact path={path} component={Overview} />
                    <Route path={`${path}/proposals`} component={Proposal} />
                    <Route path={`${path}/campaign`} component={Campaign} />
                    <Route path={`${path}/contents`} component={Content} />
                </Switch>
            </div>
        </div>
    );
}

Proposal.propTypes = {};

export { Advertiser };