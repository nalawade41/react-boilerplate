import React, { useEffect, useState } from 'react';
import { format, parseISO } from 'date-fns'
import { Link } from 'react-router-dom';
import { Formik, Field, Form, ErrorMessage, useFormikContext, useField } from 'formik';
import * as Yup from 'yup';
import DatePicker from "react-datepicker";
import { UploadImages } from '@/_components';

import { contentService, alertService } from '@/_services';

function AddEdit({ history, match }) {
    const { id } = match.params;
    const isAddMode = !id;
    const [imageFile, setImageFile] = useState('');
    const [disableSave, setDisableSave] = useState(isAddMode ? true : false);
    const [mediaType, setMediaType] = useState('');

    const initialValues = {
        title: '',
        description: '',
        dimension: '320*250',
        mediafile: '',
        status: '',
        media_type:'',
    };

    const validationSchema = Yup.object().shape({
        title: Yup.string()
            .required('Title is required'),
        description: Yup.string()
            .required('Description is required'),
        status: Yup.string()
            .required('Any one status selection is required'),
    });

    function onSubmit(fields, { setStatus, setSubmitting }) {
        setStatus();
        if (isAddMode) {
            createContent(fields, setSubmitting);
        } else {
            updateContent(id, fields, setSubmitting);
        }
    }

    function createContent(fields, setSubmitting) {
        const data = Object.assign({}, {
            ...fields,
            media_type: mediaType,
            mediafile: imageFile,
        });

        if (!imageFile || !mediaType) {
            alertService.error('Uplaod the content file');
            return;
        }

        contentService.create(data)
            .then(() => {
                alertService.success('Content added successfully', { keepAfterRouteChange: true });
                history.push('.');
            })
            .catch(error => {
                setSubmitting(false);
                alertService.error(error);
            });
    }

    function updateContent(id, fields, setSubmitting) {
        const data = Object.assign({}, {
            ...fields,
            media_type: mediaType || fields.media_type,
            mediafile: imageFile || fields.mediafile,
        });

        if (!data.media_type || !data.mediafile) {
            alertService.error('Missing content file. Please re-upload.');
            return;
        }

        contentService.update(id, fields)
            .then(() => {
                alertService.success('Update successful', { keepAfterRouteChange: true });
                history.push('..');
            })
            .catch(error => {
                setSubmitting(false);
                alertService.error(error);
            });
    }

    const handleImageUpload = (fileLink, mediaType) => {
        setImageFile(fileLink);
        setDisableSave(false);
        setMediaType(mediaType);
    };

    const handleImageSelect = (imageSelectd) => {
        setDisableSave(imageSelectd);
    };

    return (
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
            {({ errors, touched, isSubmitting, setFieldValue, values }) => {
                useEffect(() => {
                    if (!isAddMode) {
                        // get user and set form fields
                        contentService.getById(id).then(content => {
                            const fields = ['title', 'description', 'dimension', 'mediafile', 'media_type', 'status'];
                            fields.forEach(field => setFieldValue(field, content.data[field], false));
                        });
                    }
                }, []);

                return (
                    <Form>
                        <h1>{isAddMode ? 'Add Content' : 'Edit Content'}</h1>
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
                                <label>Dimensions</label>
                                <Field as="select" name="dimension" className={'form-control' + (errors.dimension && touched.dimension ? ' is-invalid' : '')}>
                                    <option value="320*250">320 * 250</option>
                                    <option value="160*600">160 * 600</option>
                                    <option value="90*720">90 * 720</option>
                                </Field>
                                <ErrorMessage name="dimension" component="div" className="invalid-feedback" />
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
                        <UploadImages handleImageUpload={handleImageUpload} handleImageSelect={handleImageSelect} previewLink={(values && values.mediafile) || imageFile} uploadType={"image/* video/*"} previewType={ values && values.media_type}/>
                        <div className="form-group">
                            <button type="submit" disabled={isSubmitting || disableSave} className="btn btn-primary">
                                {isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
                                Save
                            </button>
                            <Link to={isAddMode ? '.' : '..'} className="btn btn-link">Cancel</Link>
                        </div>
                    </Form>
                );
            }}
        </Formik>
    );
}

export { AddEdit };