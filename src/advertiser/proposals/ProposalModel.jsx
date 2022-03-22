import React from 'react';
import { SearchBox } from '@/_components';

//TODO: Optimize this array to use for datagrid header binding
const ProposalModel = [
    {
        columnName: 'title',
        headerName: 'Title',
        filterAble: true,
        filterComponent: (params) => {
            const filter = `filter[title]=`;
            return (
                <div className="col-10">
                    <SearchBox value={params.value}
                        key={params.key}
                        placeholder="Search Title"
                        type="Text"
                        onSearch={(value) => {
                            const finalFilter = filter + value;
                            params.handleSearchClick(finalFilter);
                        }} />
                </div>
            )
        },
    },
    { 
        columnName: 'description',
        headerName: 'Description',
        filterAble: true,
        filterComponent: (params) => {
            const filter = `filter[description]=`;
            return (
                <div className="col-10">
                    <SearchBox value={params.value}
                        key={params.key}
                        placeholder="Search Description"
                        type="Text"
                        onSearch={(value) => {
                            const finalFilter = filter + value;
                            params.handleSearchClick(finalFilter);
                        }} />
                </div>
            )
        },
    },
    {
        columnName: 'start_date',
        headerName: 'Start Date Range',
        filterAble: true,
        filterComponent: (params) => {
            const filter = `filter[start_date_between]=`;
            return (
                <div className="col-10">
                    <SearchBox value={params.value}
                        key={params.key}
                        placeholder="Search Title"
                        type="DateRange"
                        onSearch={(startDate, endDate) => {
                            const finalFilter = filter + startDate+',' + endDate;
                            params.handleSearchClick(finalFilter);
                        }} />
                </div>
            )
        },
    },
    {
        columnName: 'end_date',
        headerName: 'End Date Range',
        filterAble: true,
        filterComponent: (params) => {
            const filter = `filter[end_date_between]=`;
            return (
                <div className="col-10">
                    <SearchBox value={params.value}
                        key={params.key}
                        placeholder="Search Title"
                        type="DateRange"
                        onSearch={(startDate, endDate) => {
                            const finalFilter = filter + startDate + ',' + endDate;
                            params.handleSearchClick(finalFilter);
                        }} />
                </div>
            )
        },
    },
    {
        columnName: 'min_budget',
        headerName: 'Min Budget',
        filterAble: false,
        filterComponent: () => {
            return (<></>);
        }
    },
    {
        columnName: 'max_budget',
        headerName: 'Max Budget',
        filterAble: false,
        filterComponent: () => {
            return (<></>);
        }
    },
    {
        columnName: 'status',
        headerName: 'Status',
        filterAble: true,
        filterComponent: (params) => {
            const filter = `filter[status]=`;
            return (
                <div className="col-10">
                    <SearchBox value={params.value}
                        key={params.key}
                        placeholder="Search Status"
                        type="Text"
                        onSearch={(value) => {
                            const finalFilter = filter + value;
                            params.handleSearchClick(finalFilter);
                        }} />
                </div>
            )
        },
    }

];

export { ProposalModel };