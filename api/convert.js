const CloudConvert = require('cloudconvert');

// Vercel Environment Variable থেকে API Key নিবে
const cloudConvert = new CloudConvert(process.env.CLOUDCONVERT_API_KEY);

export default async function handler(req, res) {
    // CORS Settings: আপনার ব্লগস্পট সাইট থেকে কানেক্ট করার পারমিশন
    res.setHeader('Access-Control-Allow-Origin', '*'); 
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // ব্রাউজার যদি চেক করে (Preflight), তবে ওকে সিগন্যাল দিবে
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // শুধু POST রিকোয়েস্ট গ্রহণ করবে
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        // ১. CloudConvert-এ জব ক্রিয়েট করা
        const job = await cloudConvert.jobs.create({
            tasks: {
                'import-1': { operation: 'import/upload' },
                'task-1': {
                    operation: 'convert',
                    input: 'import-1',
                    output_format: 'docx', // আপনি চাইলে এটা ডাইনামিক করতে পারেন
                },
                'export-1': { 
                    operation: 'export/url', 
                    input: 'task-1' 
                }
            }
        });

        // ২. জবের ডিটেইলস ব্লগের কাছে পাঠানো
        res.status(200).json(job);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'CloudConvert API Error: ' + error.message });
    }
}
