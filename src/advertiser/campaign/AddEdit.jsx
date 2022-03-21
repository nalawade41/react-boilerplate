import React, { useEffect } from 'react';
import { format } from 'date-fns'
import { Formik, Field, Form, ErrorMessage, useFormikContext, useField } from 'formik';
import * as Yup from 'yup';
import DatePicker from "react-datepicker";


import { campaignService, alertService } from '@/_services';

function AddEdit({ history, match }) {
    const { id } = match.params;
    const isAddMode = !id;
    const initialValues = {
        title: '',
        description: '',
        start_date: '',
        end_date: '',
        min_budget: '',
        max_budget: '',
        status: ''
    };

    const DatePickerField = ({ ...props }) => {
        const { setFieldValue } = useFormikContext();
        const [field] = useField(props);
        return (
            <DatePicker
                {...field}
                {...props}
                selected={(field.value && new Date(field.value)) || null}
                onChange={(val) => {
                    setFieldValue(field.name, val);
                }}
            />
        );
    };

    const validationSchema = Yup.object().shape({
        title: Yup.string()
            .required('Title is required'),
        description: Yup.string()
            .required('Description is required'),
        start_date: Yup.date()
            .required('Start date is required'),
        end_date: Yup.date()
            .required('End date is required'),
        budget: Yup.number()
            .required('Min budget is required'),
        status: Yup.string()
            .required('Any one status selection is required'),
    });

    function onSubmit(fields, { setStatus, setSubmitting }) {
        setStatus();
        if (isAddMode) {
            createProposal(fields, setSubmitting);
        } else {
            updateProposal(id, fields, setSubmitting);
        }
    }

    function createProposal(fields, setSubmitting) {
        const data = Object.assign({}, {
            ...fields,
            start_date: format(fields.start_date, 'yyyy-MM-dd'),
            end_date: format(fields.end_date, 'yyyy-MM-dd'),
        });
        campaignService.create(data)
            .then(() => {
                alertService.success('User added successfully', { keepAfterRouteChange: true });
                history.goBack();
            })
            .catch(error => {
                setSubmitting(false);
                alertService.error(error);
            });
    }

    function updateProposal(id, fields, setSubmitting) {
        campaignService.update(id, fields)
            .then(() => {
                alertService.success('Update successful', { keepAfterRouteChange: true });
                history.goBack();
            })
            .catch(error => {
                setSubmitting(false);
                alertService.error(error);
            });
    }

    return (
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
            {({ errors, touched, isSubmitting, setFieldValue }) => {
                useEffect(() => {
                    if (!isAddMode) {
                        // get user and set form fields
                        campaignService.getById(id).then(campaign => {
                            const fields = ['title', 'description', 'start_date', 'end_date', 'budget', 'status'];
                            fields.forEach(field => setFieldValue(field, campaign.data[field], false));
                        });
                    }
                }, []);

                return (
                    <Form>
                        <h1>{isAddMode ? 'Add Proposal' : 'Edit Proposal'}</h1>
                        <div className="form-row">
                            <div className="form-group col-6">
                                <label>Title</label>
                                <Field name="title" type="text" className={'form-control' + (errors.title && touched.title ? ' is-invalid' : '')} />
                                <ErrorMessage name="title" component="div" className="invalid-feedback" />
                            </div>
                            <div className="form-group col-6">
                                <label>Description</label>
                                <Field name="description" type="text" className={'form-control' + (errors.description && touched.description ? ' is-invalid' : '')} />
                                <ErrorMessage name="description" component="div" className="invalid-feedback" />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group col-2">
                                <label>Start Date</label>
                                <DatePickerField name="start_date" type="text" className={'form-control' + (errors.start_date && touched.start_date ? ' is-invalid' : '')}/>
                                <ErrorMessage name="start_date" component="div" className="invalid-feedback" />
                            </div>
                            <div className="form-group col-2">
                                <label>End Date</label>
                                <DatePickerField name="end_date" type="text" className={'form-control' + (errors.end_date && touched.end_date ? ' is-invalid' : '')} />
                                <ErrorMessage name="end_date" component="div" className="invalid-feedback" />
                            </div>
                            <div className="form-group col-2">
                                <label>Budget</label>
                                <Field name="budget" type="text" className={'form-control' + (errors.budget && touched.budget ? ' is-invalid' : '')} />
                                <ErrorMessage name="budget" component="div" className="invalid-feedback" />
                            </div>
                            <div className="form-group col-2">
                                <div className="form-row">
                                    <div className="form-group col-6">
                                        <label>Active</label>
                                        <Field name="status" type="radio" value="active" className={'form-control' + (errors.status && touched.status ? ' is-invalid' : '')} />
                                    </div>
                                    <div className="form-group col-6">
                                        <label>In-Active</label>
                                        <Field name="status" type="radio" value="inactive" className={'form-control' + (errors.status && touched.status ? ' is-invalid' : '')} />
                                    </div>
                                </div>
                                <ErrorMessage name="status" component="div" className="invalid-feedback" />
                            </div>
                        </div>
                        <div className="form-group">
                            <button type="submit" disabled={isSubmitting} className="btn btn-primary">
                                {isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
                                Save
                            </button>
                            <button type="button" disabled={isSubmitting} className="btn btn secondary" onClick={ () => history.goBack()}>Cancel</button>
                            {/* <Link to={isAddMode ? '.' : '..'} className="btn btn-link">Cancel</Link> */}
                        </div>
                    </Form>
                );
            }}
        </Formik>
    );
}

export { AddEdit };