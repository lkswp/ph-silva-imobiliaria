import https from 'https';

https.get('https://phsilva.com/api/imoveis', (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => console.log('Status:', res.statusCode, '\nBody:', data));
}).on('error', (err) => console.error(err));
