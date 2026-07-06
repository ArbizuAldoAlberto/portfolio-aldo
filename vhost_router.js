const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 80;
const PORTFOLIO_TARGET = 'http://127.0.0.1:3001';
const DASHBOARDS_DIR = fs.existsSync('/root/dashboards') ? '/root/dashboards' : path.join(__dirname, 'dashboards');

const STATIC_SUBDOMAINS = {
    'sentinelos.aldoarbizu.com': path.join(DASHBOARDS_DIR, 'sentinelos.html'),
    'agromarket.aldoarbizu.com': path.join(DASHBOARDS_DIR, 'agromarket.html'),
    'ecoconnect.aldoarbizu.com': path.join(DASHBOARDS_DIR, 'ecoconnect.html'),
    'techzone.aldoarbizu.com': path.join(DASHBOARDS_DIR, 'techzone.html'),
    'pawhero.aldoarbizu.com': path.join(DASHBOARDS_DIR, 'pawhero.html'),
    'aeroshot.aldoarbizu.com': path.join(DASHBOARDS_DIR, 'aeroshot.html'),
    'impresion3d.aldoarbizu.com': path.join(DASHBOARDS_DIR, 'impresion3d.html'),
    'habitat.aldoarbizu.com': path.join(DASHBOARDS_DIR, 'habitat.html'),
    'marketingadvisor.aldoarbizu.com': path.join(DASHBOARDS_DIR, 'marketingadvisor.html'),
    'nomadhub.aldoarbizu.com': path.join(DASHBOARDS_DIR, 'nomadhub.html'),
    'sabiobosque.aldoarbizu.com': path.join(DASHBOARDS_DIR, 'sabiobosque.html')
};

const DYNAMIC_PROXIES = {
    'titanflow.aldoarbizu.com': 'http://127.0.0.1:3000',
    'aureus.aldoarbizu.com': 'http://127.0.0.1:3020',
    'cannabis.aldoarbizu.com': 'http://127.0.0.1:3040',
    'arbizulabs.com': 'http://127.0.0.1:3002',
    'www.arbizulabs.com': 'http://127.0.0.1:3002'
};

const getNexusSecurityHeaders = (host) => {
    let csp = "default-src 'self' 'unsafe-inline' 'unsafe-eval' https: data: blob:;";
    // Permitir Firebase y WebSockets de Next.js
    csp += " connect-src 'self' https://*.firebaseio.com wss://*.firebaseio.com https://*.googleapis.com ws://*.aldoarbizu.com wss://*.aldoarbizu.com ws://*.arbizulabs.com wss://*.arbizulabs.com ws://localhost:* wss://localhost:* http://localhost:* https://localhost:* ws://127.0.0.1:* wss://127.0.0.1:*;";
    csp += " script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.gstatic.com https://*.googleapis.com https://*.firebasejs.com;";
    
    return {
        'X-Frame-Options': 'SAMEORIGIN',
        'X-Content-Type-Options': 'nosniff',
        'Content-Security-Policy': csp,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With'
    };
};

const server = http.createServer((req, res) => {
    const hostHeader = req.headers.host || '';
    const host = hostHeader.split(':')[0].replace('.test', '.com');

    if (host === 'cannabis.aldoarbizu.com' || host === 'cannasavias.aldoarbizu.com') {
        res.writeHead(301, { "Location": "https://sabiobosque.aldoarbizu.com" + req.url });
        res.end();
        return;
    }

    const securityHeaders = getNexusSecurityHeaders(host);

    for (const [key, value] of Object.entries(securityHeaders)) {
        res.setHeader(key, value);
    }

    if (STATIC_SUBDOMAINS[host]) {
        fs.readFile(STATIC_SUBDOMAINS[host], (err, data) => {
            if (err) { res.writeHead(404); res.end('404'); return; }
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(data);
        });
        return;
    }

    const target = DYNAMIC_PROXIES[host] || PORTFOLIO_TARGET;
    const tUrl = new URL(target);

    const proxyReq = http.request({
        host: '127.0.0.1',
        port: tUrl.port,
        path: req.url,
        method: req.method,
        headers: {
            ...req.headers,
            'x-forwarded-for': req.socket.remoteAddress,
            'x-forwarded-host': hostHeader,
            'x-forwarded-proto': 'http'
        }
    }, (proxyRes) => {
        res.writeHead(proxyRes.statusCode, proxyRes.headers);
        proxyRes.pipe(res);
    });

    proxyReq.on('error', () => {
        res.writeHead(502);
        res.end('Offline');
    });

    req.pipe(proxyReq);
});

// Soporte robusto de WebSockets para HMR de Next.js
server.on('upgrade', (req, socket, head) => {
    const host = (req.headers.host || '').split(':')[0].replace('.test', '.com');
    const target = DYNAMIC_PROXIES[host] || PORTFOLIO_TARGET;
    const targetUrl = new URL(target);

    const proxyReq = http.request({
        host: '127.0.0.1',
        port: targetUrl.port,
        path: req.url,
        method: req.method,
        headers: req.headers
    });

    proxyReq.on('upgrade', (proxyRes, proxySocket, proxyHead) => {
        socket.write('HTTP/1.1 101 Web Socket Protocol Handshake\r\n');
        for (let i = 0; i < proxyRes.rawHeaders.length; i += 2) {
            socket.write(`${proxyRes.rawHeaders[i]}: ${proxyRes.rawHeaders[i+1]}\r\n`);
        }
        socket.write('\r\n');
        proxySocket.pipe(socket);
        socket.pipe(proxySocket);
    });

    proxyReq.on('error', (err) => {
        socket.destroy();
    });

    proxyReq.end();
});

server.listen(PORT, '0.0.0.0', () => console.log('NEXUS GATEWAY REPAIRED'));
