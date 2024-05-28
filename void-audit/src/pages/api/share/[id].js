import prisma from './../../../utility/db'

export default async function handler(req, res)
{

    const { id } = req.query;
    try {
        if (req.method !== 'POST')
            return res.status(405).json({ error: 'Method not allowed' });

        if (!id)
            return res.status(400).json({ error: 'Invalid report ID' });

        const reportPath = await prisma.audit.findUnique({
            where: {
                id: parseInt(id)
            },
            select: {
                report: true,    
                url: true,
                emulatedForm: true            
            }
        });

        if (!reportPath) 
            return res.status(404).json({ error: 'Report not found' });

        const protocol = req.connection.encrypted ? 'https' : 'http';
        const host = req.headers.host;

        return res.status(200).json({ 
            reportPath: `${protocol}://${host}/${reportPath.report}`,
            url: reportPath.url,
            emulatedForm: reportPath.emulatedForm
        });
    } catch (error) {
        return res.status(500).json({ error: 'Server Error 500' });
    }
}
// export default async function handler(req, res)
// {

//     const { id } = req.query;
//     try {
//         if (req.method !== 'POST') {
//             return res.status(405).json({ error: 'Method not allowed' });
//         }

//         if (!id)
//             return res.status(400).json({ error: 'Invalid report ID' });

//         const reportContent = await prisma.audit.findUnique({
//             where: {
//                 id: parseInt(id)
//             },
//             select: {
//                 report: true,
//                 url: true,

//             }
//         });

//         console.log('report == ', reportContent);

//         if (!reportContent) {
//             return res.status(404).json({ error: 'Report not found' });
//         }

//         const reportString = reportContent.report.toString('utf8');

//         const reportStream = Readable.from([reportString]);
//         res.setHeader('Content-Disposition', 'attachment; filename="report.html"');
//         res.setHeader('Content-Type', 'text/html');

//         reportStream.pipe(res);
//     } catch (error) {
//         console.error("error === ", error);
//         return res.status(500).json({ error: 'Ta7 server' });
//     }
// }