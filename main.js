import { authorizeCashalot, tokenCashalot } from './authCashalot.js';
import {getReceipts, getReportsZ, receipts, reportsZ} from './getReports.js';

(async () => {
    await authorizeCashalot();
    //console.log('Token for reuse:', tokenCashalot); // Use the token here
    //await getReportsZ(tokenCashalot,'2024-07-19T00:00:00.000Z','2024-07-19T23:59:59.999Z',[4000191676,4000595350]);
    await getReceipts(tokenCashalot,'2024-07-22T00:00:00.000Z','2024-07-22T23:59:59.999Z',[4000191676,4000595350]);
    //console.log (reportsZ);
    //console.log(reportsZ.data);
    console.log(receipts.data)
})();
