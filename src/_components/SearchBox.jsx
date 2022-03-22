import React, {useState, useEffect} from "react";
import PropTypes from "prop-types";
import DatePicker from "react-datepicker";
import { subDays, addDays, format } from 'date-fns'

const SearchBox = (props) => {
    const [value, setValue] = useState(props.value || '');
    const [beginDate, setBeginDate] = useState(subDays(new Date(), 7));
    const [endDate, setEndDate] = useState(addDays(new Date(), 7));
    useEffect(() => {
        if (value === "") {
            setValue('');
        } else {
            setValue(props.value || value);
        }
    }, [value]);

    const handleSearchClick = (e) => {
        e.preventDefault();
        props.onSearch(value);
    }

    const handleSearchByDateRange = (e) => {
        e.preventDefault();
        props.onSearch(format(beginDate, "yyyy-MM-dd"), format(endDate, "yyyy-MM-dd"));
    }

    const handleChange = (e) => {
        setValue(e.target.value);
    }

    const handleBeginDateChange = (e) => {
        setBeginDate(e);
    }

    const handleEndDateChange = (e) => {
        setEndDate(e);
    }
    
    if (props.type === 'DateRange') {
        return (
            <section className="search-component">
                <form onSubmit={handleSearchClick}>
                    <div className="row">
                        <div className="col-2">
                            <DatePicker className="form-control"
                                id="beginDate"
                                selected={beginDate}
                                onChange={handleBeginDateChange}
                            />
                        </div>
                        <div className="col-2">
                            <DatePicker className="form-control"
                                id="endDate"
                                selected={endDate}
                                onChange={handleEndDateChange}
                            />
                        </div>
                        <div className="col-2">
                            <button className="btn btn-primary"
                                onClick={handleSearchByDateRange}>
                                <span className="fa fa-search" />{` Search`}
                            </button>
                        </div>
                    </div>
                </form>
            </section>
        );
    }

    return (
        <section className="search-component">
            <form onSubmit={handleSearchClick}>
                <div className="input-group col-4">
                    <input type="text"
                        placeholder={props.placeholder}
                        value={value}
                        id="search"
                        className="form-control"
                        onChange={handleChange} />
                    &nbsp;
                    <button type="submit" className="btn btn-primary" id="btn-search">
                        <i className="fa fa-search pr-1" />&nbsp;Search
                    </button>
                </div>
            </form>
        </section>
    );
}

SearchBox.protoTypes = {
    onSearch: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
    value: PropTypes.string,
    type: PropTypes.string,
};


export { SearchBox };