import React from 'react';
import { SearchBox } from '@/_components';

//TODO: Optimize this array to use for datagrid header binding
const UserModel = [
    {
        columnName: 'firstName',
        headerName: 'First Name',
        filterAble: true,
        filterComponent: (params) => {
            const filter = `filter[firstName]=`;
            return (
                <div className="col-10">
                    <SearchBox value={params.value}
                        key={params.key}
                        placeholder="Search Firstname"
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
        columnName: 'email',
        headerName: 'Email',
        filterAble: true,
        filterComponent: (params) => {
            const filter = `filter[email]=`;
            return (
                <div className="col-10">
                    <SearchBox value={params.value}
                        key={params.key}
                        placeholder="Search Email"
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
        columnName: 'role',
        headerName: 'Role',
        filterAble: true,
        filterComponent: (params) => {
            const filter = `filter[role]=`;
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

export { UserModel };