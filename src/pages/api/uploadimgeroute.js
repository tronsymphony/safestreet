import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

// Disable Next.js body parsing for this API route
export const config = {
    api: {
        bodyParser: false,
    },
};

const uploadDir = path.join(process.cwd(), '/public/uploads');

// Ensure the upload directory exists
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const form = formidable({
            uploadDir, // Directory to save uploaded files
            keepExtensions: true, // Retain file extensions
            multiples: false, // Single file upload
            filename: (name, ext) =>
                `${Date.now()}-${Math.random().toString(36).substring(2, 15)}${ext}`,
        });

        form.parse(req, (err, fields, files) => {

            const fileArray = files.file; // Handle the array
            if (!fileArray || fileArray.length === 0) {
                console.error('No file found in the parsed files array');
                return res.status(400).json({ error: 'File upload failed: No file found' });
            }

            const file = fileArray[0]; // Access the first file object
            const filePath = file.filepath || file.newFilename;

            if (!filePath) {
                console.error('File path is undefined. File object:', file);
                return res.status(400).json({ error: 'File upload failed: Invalid file path' });
            }

            // Respond with the public file path
            const publicFilePath = `/uploads/${path.basename(filePath)}`;
            console.log('File uploaded successfully:', publicFilePath);
            res.status(200).json({ filePath: publicFilePath });
        });
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
