import request from 'supertest';
import app from '../server';
import path from 'path';

describe('Image Processing API Endpoints', () => {
    console.log(__dirname);

    // Test for uploading an image
    it('should upload an image successfully', async () => {
        const response = await request(app)
            .post('/api/image/upload')
            .attach('image', path.resolve(__dirname, 'testImage.png'));

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Image uploaded successfully');
    });

    // Test for resizing an image
    it('should resize an image to specified dimensions', async () => {
        const response = await request(app)
            .post('/api/image/resize')
            .attach('image', path.resolve(__dirname, 'testImage.png'))
            .field('width', '100')
            .field('height', '100');

        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toMatch(/^image\/png/);
        expect(response.body).toBeDefined();
    });

    // Test for cropping an image
    it('should crop an image to specified area', async () => {
        const response = await request(app)
            .post('/api/image/crop')
            .attach('image', path.resolve(__dirname, 'testImage.png'))
            .field('width', '100')
            .field('height', '100')
            .field('left', '0')
            .field('top', '0');

        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toBe('image/png');
        expect(response.body).toBeDefined();
    });

    // Test for applying grayscale filter
    it('should apply a grayscale filter to an image', async () => {
        const response = await request(app)
            .post('/api/image/filter')
            .attach('image', path.resolve(__dirname, 'testImage.png'))
            .field('filter', 'grayscale');

        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toBe('image/png');
        expect(response.body).toBeDefined();
    });

    // Test for applying blur filter
    it('should apply a blur filter to an image', async () => {
        const response = await request(app)
            .post('/api/image/filter')
            .attach('image', path.resolve(__dirname, 'testImage.png'))
            .field('filter', 'blur');

        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toBe('image/png');
        expect(response.body).toBeDefined();
    });

    // Test for adding a watermark to an image
    it('should add a watermark to an image', async () => {
        const response = await request(app)
            .post('/api/image/watermark')
            .attach('image', path.resolve(__dirname, 'testImage.png'))
            .field('text', 'Watermark Text');

        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toBe('image/png');
        expect(response.body).toBeDefined();
    }, 1000);

    // Test for downloading a processed image
    it('should return a 400 error if no processedImagePath is provided for download', async () => {
        const response = await request(app)
            .post('/api/image/download')
            .send({}); // No processedImagePath provided

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Image path is required');
    });
});
