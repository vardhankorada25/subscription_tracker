const http = require('http');

async function testAPI() {
    try {
        console.log('--- Logging in ---');
        const loginData = JSON.stringify({
            email: "4321@gmail.com",
            password: "123456"
        });

        const loginRes = await new Promise((resolve, reject) => {
            const req = http.request('http://localhost:5500/api/v1/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': loginData.length
                }
            }, res => {
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => resolve({statusCode: res.statusCode, body: JSON.parse(data)}));
            });
            req.on('error', reject);
            req.write(loginData);
            req.end();
        });

        console.log('Login Response:', loginRes.statusCode);
        console.log('Login Body:', loginRes.body);

        if (!loginRes.body.data || !loginRes.body.data.token) {
            console.log('Failed to get token');
            return;
        }

        const token = loginRes.body.data.token;
        const userId = loginRes.body.data.user.id;

        console.log('\n--- Fetching User Details ---');
        console.log('Using Token:', token);

        const userRes = await new Promise((resolve, reject) => {
            const req = http.request(`http://localhost:5500/api/v1/users/${userId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }, res => {
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => resolve({statusCode: res.statusCode, body: JSON.parse(data)}));
            });
            req.on('error', reject);
            req.end();
        });

        console.log('User Details Response:', userRes.statusCode);
        console.log('User Details Body:', userRes.body);

    } catch (err) {
        console.error('Error:', err);
    }
}

testAPI();
