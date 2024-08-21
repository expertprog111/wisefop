import CryptoJS from 'crypto-js';
import fetch from 'node-fetch';

let tokenCashalot = null;

async function authorizeCashalot() {
    const url = 'https://my.cashalot.org.ua/api/v1/Authorization';
    const publicKey = '0MwZCbchMv88WuNi'; // or Load from environment variable
    const privateKey = 'bcXXJIRSiojWCVwK';
    const fopEdrpou = '2384208006';
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const hashCashalot = generateHash(date, publicKey, privateKey);  

    const data = { edrpou: fopEdrpou, hash: hashCashalot };

    try {
        // Dynamic import
        const fetch = (await import('node-fetch')).default;
        const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Accept': 'application/json', // Expect a JSON response
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) { // Check for HTTP errors
            throw new Error(`Authorization failed with status code ${response.status}: ${await response.text()}`);
        }

        const jsonResponse = await response.json(); // Parse the JSON response
        tokenCashalot=jsonResponse.token;
       // console.log('Отримано токен авторизації:', jsonResponse.token);
    } catch (error) {
        console.error('Помилка отримання токена авторизації:', error);
    }
}

// Corrected generateHash function
function generateHash(date, publicKey, privateKey) {
    const combinedString = date + publicKey;
    const rawHash = CryptoJS.HmacSHA256(combinedString, privateKey); // Use privateKey directly as a string
    const hashString = CryptoJS.enc.Hex.stringify(rawHash);

   // console.log("Hash:", hashString);

    return hashString;
}

export {authorizeCashalot,tokenCashalot};
//authorizeCashalot();
