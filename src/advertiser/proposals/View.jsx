import React, { useEffect, useState } from 'react';
import { Container } from '@mui/material';
import Paper from '@mui/material/Paper';
import { proposalService, campaignService } from '@/_services';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { List } from '../campaign/List';

const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
    height: 60,
    lineHeight: '60px',
}));

function View({ history, match }) {
    const { id } = match.params;
    const [isLoading, setIsLoading] = useState(false);
    const [proposal, setPropsal] = useState({});
    const [campgins, setCamapigns] = useState([]);

    useEffect(() => {
        loadProposal();
    },[]);

    const loadProposal = () => {
        setIsLoading(true);
        proposalService.getById(id).then(proposal => {
            setPropsal(proposal.data);
            loadCampaigns(proposal.data.id);
        });
    };

    const loadCampaigns = (proposalID) => {
        //TODO: change this id
        campaignService.getById(2).then(campaigns => {
            setCamapigns(campaigns.data);
            setIsLoading(false);
        });
    }

    if (isLoading) {
        return (<></>);
    }

    return (
        <Container>
            <h1>
                {'View Proposal'}
                <FiberManualRecordIcon
                    fontSize="small"
                    sx={{
                        mr: 1,
                        ml: 3,
                        color: proposal.status === 'active' ? '#4caf50' : '#d9182e',
                    }}
                />
                {proposal.status === 'active' ? 'Active' : 'In-Active'}
            </h1>
            <hr />
            <div className="form-row">
                <div className="form-group col-4">
                    <strong>Title</strong>
                    <span className="">{proposal.title }</span>
                </div>
                <div className="form-group col-4">
                    <label>Description</label>
                    <span>{proposal.Description}</span>
                </div>
            </div>
            <div className="form-row">
                <div className="form-group col-4">
                    <label>Start Date</label>
                    <span>{proposal.start_date}</span>
                </div>
                <div className="form-group col-4">
                    <label>End Date</label>
                    <span>{proposal.end_date}</span>
                </div>
            </div>
            <div className="form-row">
                <div className="form-group col-4">
                    <label>Min Budget</label>
                    <span>{proposal.min_budget}</span>
                </div>
                <div className="form-group col-4">
                    <label>Max Budget</label>
                    <span>{proposal.max_budget}</span>
                </div>
            </div>
            <List match={match} history={history}/>
        </Container>
    );
}

export { View };