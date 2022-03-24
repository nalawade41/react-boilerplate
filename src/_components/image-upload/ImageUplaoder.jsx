import React, { useState, useEffect } from "react";
import { PropTypes} from "prop-types";
import { LinearProgress, Typography, ListItem, Button, Box } from '@mui/material';

import { uploadService } from '@/_services';

const LinearProgressWithLabel = (props) => {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ width: '100%', mr: 1 }}>
                <LinearProgress variant="determinate" {...props} />
            </Box>
            <Box sx={{ minWidth: 35 }}>
                <Typography variant="body2" color="text.secondary">{`${Math.round(
                    props.value,
                )}%`}</Typography>
            </Box>
        </Box>
    );
};

LinearProgressWithLabel.propTypes = {
    value: PropTypes.number.isRequired,
};

const UploadImages = (props) => {
    const [currentFile, setCurrentFile] = useState(undefined);
    const [previewImage, setPreviewImage] = useState(undefined);
    const [progress, setProgress] = useState(0);
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [mediaType, setMediaType] = useState(0);    

    useEffect(() => {
        //TODO: Do we stil need this ??
        // uploadService.getFiles().then((files) => {
        //     setImageInfos(files);
        // });
    }, []);
    


    const selectFile = (e) => {
        if (e.target.files[0]) {
            const file = e.target.files[0];
            setCurrentFile(file);
            setPreviewImage(URL.createObjectURL(file));
            setProgress(0);
            setMessage('');
            props.handleImageSelect(true);
            if (file.type.startsWith("image")) { 
                setMediaType(2);
            }
            if (file.type.startsWith("video")) { 
                setMediaType(1);
            }
        } else {
            props.handleImageSelect(false);
        }
    };

    const upload = () => {
        setProgress(0);

        uploadService.upload(currentFile, (event) => {
            setProgress(Math.round((100 * event.loaded) / event.total));
        }).then((response) => {
            setMessage(response.message);
            setIsError(false);
            props.handleImageUpload(response.path, mediaType);
        }).catch((err) => {
            setCurrentFile(undefined);
            setPreviewImage(undefined);
            setProgress(0);
            setMessage('Could not upload the image!');
            setIsError(true);
        });
    };

    const renderPreviewControl = () => {
        if (currentFile || props.previewLink) {
            if ((currentFile && currentFile.type.startsWith("image")) || parseInt(props.previewType) === 2) {
                return (
                    <img style={{ width: 100 }} className="preview" src={previewImage || props.previewLink} alt="" />
                );
            }
            if ((currentFile && currentFile.type.startsWith("video")) || parseInt(props.previewType) === 1) {
                return (
                    <video width="100" controls>
                        <source src={previewImage || props.previewLink} />
                    </video>
                );
            }
        }
    };

    return (
        <div>
            <div className="row">
                <div className="col-2">
                    <label htmlFor="btn-upload">
                        <input
                            id="btn-upload"
                            name="btn-upload"
                            style={{ display: 'none' }}
                            type="file"
                            accept={props.uploadType || "image/* video/*"}
                            onChange={selectFile} />
                        <Button
                            className="btn-choose"
                            variant="outlined"
                            component="span" >
                            Choose File
                        </Button>
                    </label>
                </div>
                <div className= "col-4">
                    {currentFile ? currentFile.name : null}
                </div>
                <div className="col-2">
                    <Button
                        className="btn-upload"
                        color="primary"
                        variant="contained"
                        component="span"
                        disabled={!currentFile}
                        onClick={upload}>
                        Upload
                    </Button>

                </div>
            </div>
            <div className="row"> 
                <div className="col-4">
                    {(previewImage || props.previewLink)&& (
                    <div>
                        {renderPreviewControl()}
                    </div>)}
                </div>
                <div className="col-6">
                    {currentFile && (
                        <Box display="flex" alignItems="center">
                            <Box width="100%" mr={1}>
                                <LinearProgressWithLabel value={progress} />
                            </Box>
                            <Box minWidth={35}>
                                <Typography variant="body2" color="textSecondary">{`${progress}%`}</Typography>
                            </Box>
                        </Box>)
                    }
                </div>
            </div>
            {message && (
                <Typography variant="subtitle2" className={`upload-message ${isError ? "error" : ""}`}>
                    {message}
                </Typography>
            )}
        </div >
    );
}

UploadImages.propTypes = {
    handleImageUpload: PropTypes.func.isRequired,
    handleImageSelect: PropTypes.func.isRequired,
    previewLink: PropTypes.string,
    uploadType: PropTypes.string.isRequired,
    previewType: PropTypes.number,
};

export { UploadImages };