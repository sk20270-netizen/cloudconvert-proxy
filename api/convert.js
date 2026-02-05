const CloudConvert = require('cloudconvert');
const cloudConvert = new CloudConvert(process.env.CLOUDCONVERT_API_KEY);

export default async function handler(req, res) {
    // CORS কনফিগারেশন (যাতে আপনার ব্লগ থেকে রিকোয়েস্ট আসে)
    res.setHeader('Access-Control-Allow-Origin', '*'); 
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        const job = await cloudConvert.jobs.create({
            tasks: {
                'import-1': { operation: 'import/upload' },
                'task-1': {
                    operation: 'convert',
                    input: 'import-1',
                    output_format: 'docx',
                },
                'export-1': { operation: 'export/url', input: 'task-1' }
            }
        });
        res.status(200).json(job);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

