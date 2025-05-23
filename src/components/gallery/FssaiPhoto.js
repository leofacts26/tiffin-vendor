import React, { useEffect, useState } from 'react'
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import { useDispatch, useSelector } from 'react-redux';
import { Cancel } from '@mui/icons-material';
import CropIcon from '@mui/icons-material/Crop';
import {
    Box,
    Button,
    DialogActions,
    DialogContent,
    Slider,
    Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import Cropper from 'react-easy-crop';
import { setIsLoading } from '../../features/user/userSlice';
import DeleteModal from './DeleteModal';
import useFetchPhotoGallery from '../../hooks/useFetchPhotoGallery';

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import DeleteIcon from '@mui/icons-material/Delete';
import UploadIcon from '@mui/icons-material/Upload';

import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';


const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

const FssaiPhoto = () => {
    const dispatch = useDispatch()
    const { isLoading } = useSelector((state) => state.user);

    const [openBox, setOpenBox] = useState(false);
    const handleClickBoxOpen = () => {
        setOpenBox(true);
    };
    const handleBoxClose = () => {
        setOpenBox(false);
    };

    const {
        settings,
        photoURL,
        setPhotoURL,
        setCroppedAreaPixels,
        rotation,
        setRotation,
        handleBrandClose,
        handleClose,
        handleBrandClickOpen,
        handleClickOpen,
        BrandDeleteopen,
        open,

        // Fssai Photo
        onUploadFssai,
        onReUploadFssai,
        onHandleRemoveFssaiLogo,
        onReUploadFssaiBanner,
        onUploadFssaiBanner

    } = useFetchPhotoGallery(handleBoxClose)

    // handleChange fn 
    const handleChange = (event) => {
        handleClickOpen()
        const file = event.target.files[0];
        const formData = new FormData();
        formData.append('image', file);
        setPhotoURL(URL.createObjectURL(file));
    }


    // onHandleSubmit 
    const onHandleSubmit = async (event) => {
        event.preventDefault();
        dispatch(setIsLoading(true))
        try {
            if (photoURL) {
                if (settings['vendor-encf']?.length && settings['vendor-encf']?.length > 0) {
                    await onReUploadFssai();
                } else {
                    await onUploadFssai();
                }
            } else {
                console.log("No photo URL to submit.");
            }
        } catch (error) {
            dispatch(setIsLoading(false))
        }
    };

    // crop 
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);

    // console.log(crop, "crop");
    // console.log(zoom, "zoom");

    const cropComplete = (croppedArea, croppedAreaPixels) => {
        // console.log(croppedAreaPixels, "croppedAreaPixels");
        setCroppedAreaPixels(croppedAreaPixels);
    };


    // const [aspect, setAspect] = useState(1); // Initialize aspect ratio to 1:1

    // useEffect(() => {
    //     // Fetch the image dimensions and calculate the aspect ratio
    //     const image = new Image();
    //     image.src = photoURL;
    //     image.onload = () => {
    //         const imageAspectRatio = image.width / image.height;
    //         setAspect(imageAspectRatio);
    //     };
    // }, [photoURL]);

    return (
        <>
            <div>
                <Accordion className="faq-bg" >
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1-content"
                        id="panel1-header"
                    >
                        <p className="settings-faq-title" style={{ fontSize: '14px', fontWeight: '500' }}> FSSAI Licence </p>
                    </AccordionSummary>
                    <AccordionDetails>
                        {
                            settings['vendor-encf'] !== undefined ? (
                                <>
                                    {settings['vendor-encf']?.map((logo, index) => (
                                        <img
                                            className="img-fluid mx-auto gallery-round"
                                            style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
                                            key={logo?.id}
                                            src={logo?.image_name[0]?.medium}
                                            alt={`Brand Logo ${index}`}
                                        />
                                    ))}
                                </>
                            ) : (
                                <>
                                    <Stack direction="row" justifyContent="center">
                                        <img
                                            style={{ width: '200px' }}
                                            src={'https://img.freepik.com/premium-vector/illustration-upload_498740-5719.jpg'}
                                            alt={`Brand Logo`}
                                        />
                                    </Stack>
                                </>
                            )
                        }


                        {/* <p className="settings-small mt-1">Upload FSSAI license</p> */}

                        <Stack direction="row" justifyContent="center" spacing={2} className='mt-2'>
                            <Button variant="contained" component="span" className="cuisines-list-white-btn-setting" onClick={handleClickBoxOpen}>
                                <UploadIcon /> Upload
                            </Button>

                            {!(settings['vendor-encf']?.length && settings['vendor-encf']?.length > 0) ? null : (
                                <Button
                                    onClick={handleBrandClickOpen}
                                    variant="contained"
                                    component="span"
                                    className="cuisines-list-white-btn-setting"
                                    disabled={isLoading}
                                >
                                    <DeleteIcon style={{ fontSize: '18px' }} /> Delete
                                </Button>
                            )}

                        </Stack>



                        {/* <div className="mt-3 text-center">
                            <input
                                accept="image/*"
                                id="vendor-encf"
                                multiple
                                type="file"
                                style={{ display: 'none' }}
                                onChange={handleChange}
                            />
                            <label htmlFor="vendor-encf">
                                <Button variant="contained" component="span" className="cuisines-list-white-btn" disabled={isLoading}>
                                <UploadIcon />  {settings['vendor-encf']?.length && settings['vendor-encf']?.length > 0 ? 'Re Upload' : 'Upload'}
                                </Button>
                            </label>
                        </div> */}

                    </AccordionDetails>
                </Accordion>
            </div>



            <BootstrapDialog
                aria-labelledby="customized-dialog-title"
                open={open}
            >
                <form onSubmit={onHandleSubmit}>
                    {open ? (
                        <>
                            <DialogContent
                                dividers
                                sx={{
                                    background: '#333',
                                    position: 'relative',
                                    height: 400,
                                    width: 'auto',
                                    minWidth: { sm: 500 },
                                }}
                            >
                                <Cropper
                                    image={photoURL}
                                    crop={crop}
                                    zoom={zoom}
                                    rotation={rotation}
                                    aspect={3 / 2}
                                    onZoomChange={setZoom}
                                    onRotationChange={setRotation}
                                    onCropChange={setCrop}
                                    onCropComplete={cropComplete}
                                />
                            </DialogContent>
                            <DialogActions sx={{ flexDirection: 'column', mx: 3, my: 2 }}>
                                <Box sx={{ width: '100%', mb: 1 }}>
                                    <Box>
                                        <Typography>Zoom: {zoomPercent(zoom)}</Typography>
                                        <Slider
                                            valueLabelDisplay="auto"
                                            valueLabelFormat={zoomPercent}
                                            min={1}
                                            max={3}
                                            step={0.1}
                                            value={zoom}
                                            onChange={(e, zoom) => setZoom(zoom)}
                                        />
                                    </Box>
                                    <Box>
                                        <Typography>Rotation: {rotation + '°'}</Typography>
                                        <Slider
                                            valueLabelDisplay="auto"
                                            min={0}
                                            max={360}
                                            value={rotation}
                                            onChange={(e, rotation) => setRotation(rotation)}
                                        />
                                    </Box>
                                </Box>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        gap: 2,
                                        flexWrap: 'wrap',
                                    }}
                                >
                                    <Button
                                        variant="outlined"
                                        startIcon={<Cancel />}
                                        onClick={() => handleClose()}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        disabled={isLoading}
                                        type='submit'
                                        variant="contained"
                                        startIcon={<CropIcon />}
                                    >
                                        {isLoading ? 'Loading...' : 'Crop'}
                                    </Button>
                                </Box>
                            </DialogActions>
                        </>
                    ) : (
                        <p>KFMBlkn</p >
                    )}
                </form>
            </BootstrapDialog>

            {/* Delete Image Modal */}
            <DeleteModal
                DeleteModalopen={BrandDeleteopen}
                handleDeleteModalClose={handleBrandClose}
                onHandleRemoveModalLogo={onHandleRemoveFssaiLogo} />


            {/* open Box Modal  */}
            <React.Fragment>
                <BootstrapDialog
                    onClose={handleBoxClose}
                    aria-labelledby="customized-dialog-title"
                    open={openBox}
                >
                    <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                        Upload Image
                    </DialogTitle>
                    <IconButton
                        aria-label="close"
                        onClick={handleBoxClose}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                    <DialogContent dividers>
                        <Stack direction="row" alignItems="center" justifyContent="center" spacing={2} >

                            <div className="text-center">
                                {settings['vendor-encf']?.length && settings['vendor-encf']?.length > 0 ? (
                                    <>
                                        <input
                                            accept="image/*"
                                            id="onReUploadFssaiBanner"
                                            multiple
                                            type="file"
                                            style={{ display: 'none' }}
                                            onChange={onReUploadFssaiBanner}
                                        />
                                        <label htmlFor="onReUploadFssaiBanner">

                                            <Button variant="contained" component="span" className="upload-btn" disabled={isLoading}>
                                                <CloudUploadIcon style={{ fontSize: '14px' }} className="me-2" /> Re Upload Image </Button>
                                        </label>
                                    </>
                                ) : (
                                    <>
                                        <input
                                            accept="image/*"
                                            id="onUploadFssaiBanner"
                                            multiple
                                            type="file"
                                            style={{ display: 'none' }}
                                            onChange={onUploadFssaiBanner}
                                        />
                                        <label htmlFor="onUploadFssaiBanner">
                                            <Button variant="contained" component="span" className="upload-btn" disabled={isLoading}>
                                                <CloudUploadIcon style={{ fontSize: '14px' }} className="me-2" />  Upload Image </Button>
                                        </label>
                                    </>
                                )}
                            </div>

                            <div> OR </div>

                            <div>
                                <input
                                    accept="image/*"
                                    id="mainbannerlogo"
                                    multiple
                                    type="file"
                                    style={{ display: 'none' }}
                                    onChange={handleChange}
                                />
                                <label htmlFor="mainbannerlogo">
                                    <Button variant="contained" component="span" className="cuisines-list-upload-btn" disabled={isLoading}>
                                        {settings['vendor-encf']?.length && settings['vendor-encf']?.length > 0 ? 'Re Upload Crop Image' : 'Upload Crop Image'}
                                    </Button>
                                </label>
                            </div>
                        </Stack>
                    </DialogContent>
                    <DialogActions>
                        <Button autoFocus onClick={handleBoxClose}>
                            Close
                        </Button>
                    </DialogActions>
                </BootstrapDialog>
            </React.Fragment>

        </>
    )
}

export default FssaiPhoto

const zoomPercent = (value) => {
    return `${Math.round(value * 100)}%`;
};