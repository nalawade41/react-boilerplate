import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Box } from "@mui/system";
import { contentService } from '@/_services';
import {
    DataGrid,
    gridPageCountSelector,
    gridPageSelector,
    useGridApiContext,
    useGridSelector,
} from '@mui/x-data-grid';
import { Pagination, PaginationItem, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle }from '@mui/material';
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import FirstPageIcon from '@mui/icons-material/FirstPage';
import LastPageIcon from '@mui/icons-material/LastPage';
import { styled } from '@mui/material/styles';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import PreviewIcon from '@mui/icons-material/Preview';
import { ContentModel } from './ContentModel';

const PAGE_SIZE = 10;

const useQuery = (page, pageSize, rowCountState, filter) => {
    const [rowCount, setRowCount] = React.useState(undefined);
    const [isLoading, setIsLoading] = React.useState(false);
    const [data, setData] = React.useState([]);

    React.useEffect(() => {
        let active = true;

        setIsLoading(true);
        setRowCount(undefined);
        contentService.getAll({ page: page + 1, pageSize, filter }).then((res) => {
            if (!active) {
                return;
            }
            setData(res.data);
            setIsLoading(false);
            setRowCount(res.meta.pagination.total);
        });

        return () => {
            active = false;
        };
    }, [page, pageSize, rowCountState, filter]);

    return { isLoading, data, rowCount };
};


const StyledGridOverlay = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    '& .ant-empty-img-1': {
        fill: theme.palette.mode === 'light' ? '#aeb8c2' : '#262626',
    },
    '& .ant-empty-img-2': {
        fill: theme.palette.mode === 'light' ? '#f5f5f7' : '#595959',
    },
    '& .ant-empty-img-3': {
        fill: theme.palette.mode === 'light' ? '#dce0e6' : '#434343',
    },
    '& .ant-empty-img-4': {
        fill: theme.palette.mode === 'light' ? '#fff' : '#1c1c1c',
    },
    '& .ant-empty-img-5': {
        fillOpacity: theme.palette.mode === 'light' ? '0.8' : '0.08',
        fill: theme.palette.mode === 'light' ? '#f5f5f5' : '#fff',
    },
}));

const CustomNoRowsOverlay = () => {
    return (
        <StyledGridOverlay>
            <svg
                width="120"
                height="100"
                viewBox="0 0 184 152"
                aria-hidden
                focusable="false"
            >
                <g fill="none" fillRule="evenodd">
                    <g transform="translate(24 31.67)">
                        <ellipse
                            className="ant-empty-img-5"
                            cx="67.797"
                            cy="106.89"
                            rx="67.797"
                            ry="12.668"
                        />
                        <path
                            className="ant-empty-img-1"
                            d="M122.034 69.674L98.109 40.229c-1.148-1.386-2.826-2.225-4.593-2.225h-51.44c-1.766 0-3.444.839-4.592 2.225L13.56 69.674v15.383h108.475V69.674z"
                        />
                        <path
                            className="ant-empty-img-2"
                            d="M33.83 0h67.933a4 4 0 0 1 4 4v93.344a4 4 0 0 1-4 4H33.83a4 4 0 0 1-4-4V4a4 4 0 0 1 4-4z"
                        />
                        <path
                            className="ant-empty-img-3"
                            d="M42.678 9.953h50.237a2 2 0 0 1 2 2V36.91a2 2 0 0 1-2 2H42.678a2 2 0 0 1-2-2V11.953a2 2 0 0 1 2-2zM42.94 49.767h49.713a2.262 2.262 0 1 1 0 4.524H42.94a2.262 2.262 0 0 1 0-4.524zM42.94 61.53h49.713a2.262 2.262 0 1 1 0 4.525H42.94a2.262 2.262 0 0 1 0-4.525zM121.813 105.032c-.775 3.071-3.497 5.36-6.735 5.36H20.515c-3.238 0-5.96-2.29-6.734-5.36a7.309 7.309 0 0 1-.222-1.79V69.675h26.318c2.907 0 5.25 2.448 5.25 5.42v.04c0 2.971 2.37 5.37 5.277 5.37h34.785c2.907 0 5.277-2.421 5.277-5.393V75.1c0-2.972 2.343-5.426 5.25-5.426h26.318v33.569c0 .617-.077 1.216-.221 1.789z"
                        />
                    </g>
                    <path
                        className="ant-empty-img-3"
                        d="M149.121 33.292l-6.83 2.65a1 1 0 0 1-1.317-1.23l1.937-6.207c-2.589-2.944-4.109-6.534-4.109-10.408C138.802 8.102 148.92 0 161.402 0 173.881 0 184 8.102 184 18.097c0 9.995-10.118 18.097-22.599 18.097-4.528 0-8.744-1.066-12.28-2.902z"
                    />
                    <g className="ant-empty-img-4" transform="translate(149.65 15.383)">
                        <ellipse cx="20.654" cy="3.167" rx="2.849" ry="2.815" />
                        <path d="M5.698 5.63H0L2.898.704zM9.259.704h4.985V5.63H9.259z" />
                    </g>
                </g>
            </svg>
            <Box sx={{ mt: 1 }}>No Rows</Box>
        </StyledGridOverlay>
    );
}

const CustomPagination = () => {
    const apiRef = useGridApiContext();
    const page = useGridSelector(apiRef, gridPageSelector);
    const pageCount = useGridSelector(apiRef, gridPageCountSelector);
    return (
        <Pagination
            color="primary"
            count={pageCount}
            page={page+1}
            size='small'
            siblingCount={1}
            boundaryCount={2}
            showFirstButton={pageCount > 4 ? true: false}
            showLastButton={pageCount > 4 ? true : false}
            renderItem={(item) => (
                <PaginationItem
                    components={{ previous: ArrowBackIcon, next: ArrowForwardIcon, first: FirstPageIcon, last: LastPageIcon}}
                    {...item}
                />)}
            components={{
                NoRowsOverlay: CustomNoRowsOverlay,
            }}
            onChange={(event, value) => apiRef.current.setPage(value-1)}
        />
    );
};


const Filter = ({ handleSearchClick, filterColumns}) => {
    const [searchType, setSearchType] = useState('title');

    const handleChangeSearchType = (e) => setSearchType(e.target.value);

    const renderFilterOptions = () => {
        return filterColumns.map((obj,index) => {
            if (obj.filterAble) {
                return (
                    <option key={index} value={obj.columnName}>{obj.headerName}</option>
                );
            }
        })
    };

    const renderFilters = () => {
        return filterColumns.map((obj,index) => {
            if (obj.columnName === searchType) {
                return obj.filterComponent({ value: '', handleSearchClick, key: index });
            }
        });
    };

    return (
        <div className="row position-relative p-2">
            <div className="col-2">
                <select className="form-control" value={searchType} onChange={handleChangeSearchType}>
                    {renderFilterOptions()}
                </select>
            </div>
            {renderFilters()}
        </div>
    );
}


function List({ match }) {
    const { path } = match;
    const [filter, setFilter] = useState('');
    const [rowsState, setRowsState] = useState({
        page: 0,
        pageSize: PAGE_SIZE,
    });
    const [rowCountState, setRowCountState] = useState(0);
    const { isLoading, data, rowCount } = useQuery(
        rowsState.page,
        rowsState.pageSize,
        rowCountState,
        filter
    );
    const [selectionModel, setSelectionModel] = useState([]);
    const [open, setOpen] = useState(false);
    const [deleteID, setDeleteID] = useState(undefined);

    const showDeleteConfirmation = (id) => {
        setDeleteID(id);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setDeleteID(undefined);
    };


    useEffect(() => {
        setRowCountState((prevRowCountState) =>
            rowCount !== undefined ? rowCount : prevRowCountState,
        );
    }, [rowCount, setRowCountState]);

    const onDelete = () => {
        if (deleteID) {
            contentService.delete(deleteID).then(() => {
                setRowCountState(rowCount - 1);
                handleClose();
            });
        }
    };

    const columns = [
        { field: 'title', headerName: 'Title', align: 'center', headerAlign: 'center', flex: 0.5},
        { field: 'description', headerName: 'Description', flex: 1, headerAlign: 'center', },
        {
            field: 'media_type',
            headerName: 'Media Type',
            align: 'center',
            headerAlign: 'center',
            flex: 0.5,
        },
        {
            field: 'status',
            headerName: 'Status',
            flex: 0.7,
            align: 'center',
            headerAlign: 'center',
            renderCell: (params) => (
                <strong>
                    <FiberManualRecordIcon
                        fontSize="small"
                        sx={{
                            mr: 1,
                            color: params.value === 'active' ? '#4caf50' : '#d9182e',
                        }}
                    />
                    {params.value === 'active' ? 'Active' : 'In-Active'}
                </strong>
            ),
        },
        {
            field: 'edit-delete',
            headerName: '',
            flex: 0.8,
            align: 'center',
            renderCell: (params) => (
                <strong>
                    <DeleteForeverIcon color="error" onClick={() => showDeleteConfirmation(params.row.id)} fontSize="large" />
                    <Link to={`${path}/edit/${params.row.id}`}  className="mr-1">
                        <EditIcon fontSize="large" />
                    </Link>
                    {/* <Link to={`${path}/view/${params.row.id}`} className="mr-1">
                        <PreviewIcon color="primary" onClick={() => { }} fontSize="large" />
                    </Link> */}
                </strong>
            ),
        }
    ];

    if (!data || data.length < 0) {
        return (<></>);
    }

    const loadSearchFilter = (value) => {
        setFilter(value);
    };

    return (
        <div>
            <h1>Manage Content</h1>
            <Link to={`${path}/add`} className="btn btn-sm btn-success mb-2">Add Content</Link>
            <Filter handleSearchClick={loadSearchFilter} filterColumns={ContentModel}/>
            <Box display="flex" height="100vh" width="100%">
                <div style={{ flexGrow: 1 }}>
                    <DataGrid
                        columns={columns}
                        rows={data}
                        rowCount={rowCountState}
                        loading={isLoading}
                        pagination
                        {...rowsState}
                        paginationMode="server"
                        onPageChange={(page) => setRowsState((prev) => ({ ...prev, page }))}
                        rowsPerPageOptions={[PAGE_SIZE]}
                        onPageSizeChange={(pageSize) =>
                            setRowsState((prev) => ({ ...prev, pageSize }))
                        }
                        components={{
                            Pagination: CustomPagination,
                        }}
                        onSelectionModelChange={(newSelectionModel) => {
                            setSelectionModel(newSelectionModel);
                        }}
                        selectionModel={selectionModel}
                        autoHeight />
                </div>
            </Box>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Do you want to delete this proposal?"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        This will delete selected content from the system.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={onDelete} color="error"  autoFocus >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export { List };