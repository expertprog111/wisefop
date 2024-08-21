import fetch from 'node-fetch';
let reportsZ =null;
let receipts =null;

async function getReportsZ(token,dateFrom,dateTo,prroNumbers) {
    const url = 'https://my.cashalot.org.ua/api/v1/GetReports';

    // Update dateFrom and dateTo as needed within a 365-day range
    //const dateFrom = '2024-07-01T00:00:00.000Z';
    //const dateTo = '2024-07-01T23:59:59.999Z';

    const filters = {
        dateFrom: dateFrom, // 
        dateTo: dateTo,     // 
        rros: prroNumbers,   // масив з фіскальними номерами кас
        pageNumber: 1      // 
    };

    const requestBody = {
        token: token,
        filters: filters
    };

    //console.log('Request Body:', JSON.stringify(requestBody, null, 2));

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        const responseText = await response.text();
        //console.log('Response Text:', responseText);

        if (!response.ok) {
            throw new Error(`Request failed with status code ${response.status}: ${responseText}`);
        }

        reportsZ = JSON.parse(responseText);
        //console.log('Response:',  zReports);
        
    } catch (error) {
        console.error('Error fetching reports:', error);
    }
}

async function getReceipts(token,dateFrom,dateTo,prroNumbers) {
    const url = 'https://my.cashalot.org.ua/api/v1/GetReceipts';

    // Update dateFrom and dateTo as needed within a 365-day range
    //const dateFrom = '2024-07-01T00:00:00.000Z';
    //const dateTo = '2024-07-01T23:59:59.999Z';

    const filters = {
        dateFrom: dateFrom, // 
        dateTo: dateTo,     // 
        rros: prroNumbers,   // масив з фіскальними номерами кас
        pageNumber: 1      // 
    };

    const requestBody = {
        token: token,
        filters: filters
    };

    //console.log('Request Body:', JSON.stringify(requestBody, null, 2));

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        const responseText = await response.text();
        //console.log('Response Text:', responseText);

        if (!response.ok) {
            throw new Error(`Request failed with status code ${response.status}: ${responseText}`);
        }

        receipts = JSON.parse(responseText);
        //console.log('Response:',  zReports);
        
    } catch (error) {
        console.error('Error fetching reports:', error);
    }
}

export {getReportsZ,reportsZ};

export{getReceipts,receipts};
