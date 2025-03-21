import express from 'express';
import httpProxy from 'http-proxy';
import path from 'path';
import { fileURLToPath } from 'url';

// Fix __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const proxy = httpProxy.createProxyServer();

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, '..', 'public')));

// Serve home.html at the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'home.html'));
});

// Proxy requests to the user_service
app.all('/user-service/*', (req, res) => {
    proxy.web(req, res, { target: 'http://user_service:5001' });
});
// Start the server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`API Gateway is running on port ${PORT}`);
});