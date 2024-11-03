import express from 'express';
import {
    uploadImage,
    resizeImage,
    cropImage,
    applyFilter,
    addWatermark,
    downloadImage,
} from '../controller/imageController';

const router = express.Router();

// Route for uploading an image
router.post('/upload', uploadImage, (req, res) => {
    res.status(200).json({ message: 'Image uploaded successfully' });
});

// Route for resizing an image
router.post('/resize', uploadImage, resizeImage);

// Route for cropping an image
router.post('/crop', uploadImage, cropImage);

// Route for applying filters to an image (e.g., grayscale, blur)
router.post('/filter', uploadImage, applyFilter);

// Route for adding a watermark to an image
router.post('/watermark', uploadImage, addWatermark);

// Route for downloading a processed image
router.post('/download', downloadImage);

export default router;
