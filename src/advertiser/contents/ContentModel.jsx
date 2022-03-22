import React from 'react';
import { SearchBox } from '@/_components';

//TODO: Optimize this array to use for datagrid header binding
const ContentModel = [
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
        columnName: 'media_type',
        headerName: 'Media Type',
        filterAble: true,
        filterComponent: (params) => {
            const filter = `filter[media_type]=`;
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

export { ContentModel };