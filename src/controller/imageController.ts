import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import sharp from 'sharp';

const storage = multer.memoryStorage();
const upload = multer({ storage });

export const uploadImage = upload.single('image'); 

// Resize Image
export const resizeImage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { width, height } = req.body;
        if (!req.file) {
            res.status(400).json({ message: 'No image uploaded' });
            return;
        }
        const resizedImage = await sharp(req.file.buffer)
            .resize(Number(width), Number(height))
            .toFormat('png')
            .toBuffer();
        
        res.contentType('image/png');
        res.status(200).json({ success: true, message: "Image resized succefully", name: req.body})
    } catch (error) {
        next(error); // Pass the error to the error handling middleware
    }
};

// Crop Image
export const cropImage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { width, height, left, top } = req.body;
        if (!req.file) {
            res.status(400).json({ message: 'No image uploaded' });
            return;
        }
        const croppedImage = await sharp(req.file.buffer)
            .extract({ width: Number(width), height: Number(height), left: Number(left), top: Number(top) })
            .toFormat('png')
            .toBuffer();

        res.contentType('image/png');
        res.send(croppedImage);
    } catch (error) {
        next(error);
    }
};

// Apply Filter (Grayscale or Blur)
export const applyFilter = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { filter } = req.body;
        if (!req.file) {
            res.status(400).json({ message: 'No image uploaded' });
            return;
        }

        let processedImage = sharp(req.file.buffer);

        if (filter === 'grayscale') {
            processedImage = processedImage.grayscale();
        } else if (filter === 'blur') {
            processedImage = processedImage.blur(5); // Adjust blur level as needed
        }

        const filteredImage = await processedImage.toFormat('png').toBuffer();

        res.contentType('image/png');
        res.send(filteredImage);
    } catch (error) {
        next(error);
    }
};

// Add Watermark
export const addWatermark = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        if (!req.file) {
            res.status(400).json({ message: 'No image uploaded' });
            return;
        }

        const watermarkText = req.body.text || 'Sample Watermark';
        const fontSize = 24;

        // Create watermark text as a PNG
        const watermarkImage = Buffer.from(
            `<svg width="200" height="50">
                <text x="0" y="20" font-size="${fontSize}" fill="rgba(255, 255, 255, 0.7)">${watermarkText}</text>
             </svg>`
        );

        const imageWithWatermark = await sharp(req.file.buffer)
            .composite([{ input: watermarkImage, gravity: 'southeast' }])
            .toFormat('png')
            .toBuffer();

        res.contentType('image/png');
        res.send(imageWithWatermark);
    } catch (error) {
        next(error);
    }
};

// Download Processed Image
export const downloadImage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { processedImagePath } = req.body;
        if (!processedImagePath) {
            res.status(400).json({ message: 'Image path is required' });
            return;
        }
        res.download(processedImagePath);
    } catch (error) {
        next(error);
    }
};
