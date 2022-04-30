const http = require('http');
const fs = require('fs');
const urlQ = require('url');

const { nuevaCancion, prepararCancion, editarCancion, eliminarCancion } = require('./funciones');

const server = http.createServer(async(req, res) => {
    const { url, method } = req;
    if (url == "/" && method == "GET") {
        try {
            const index = fs.readFileSync('./index.html', 'utf8');
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf8' });
            res.end(index);
        } catch (error) {
            funError(res, error, "text/html");
        }

    } else if (url == "/cancion" && req.method == "POST") {
        try {
            res.writeHead(201, { 'Content-Type': 'application/json' });
            let body = '';
            req.on('data', (chunk) => {
                body += chunk;
            });
            req.on('end', async() => {
                const parametros = Object.values(JSON.parse(body));
                const resultado = await nuevaCancion(parametros);
                res.end(JSON.stringify(resultado));
            });
        } catch (error) {
            funError(res, error, 'application/json');
        }
    } else if (req.url == '/canciones' && req.method === 'GET') {
        try {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            const resultado = await prepararCancion();
            res.end(JSON.stringify(resultado.rows));
        } catch (error) {
            funError(res, error, "application/json");
        }
    } else if (req.url == '/cancion' && req.method === 'PUT') {
        try {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            let body = '';
            req.on('data', (chunk) => {
                body += chunk;
            });
            req.on('end', async() => {
                const parametros = Object.values(JSON.parse(body));
                const resultado = await editarCancion(parametros);
                res.end(JSON.stringify(resultado));
            });
        } catch (error) {
            funError(res, error, "application/json");
        }

    } else if (req.url.startsWith('/cancion?id=') && req.method === 'DELETE') {
        try {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            const { id } = urlQ.parse(req.url, true).query;
            const resultado = await eliminarCancion(id);
            res.end(JSON.stringify(resultado));
        } catch (error) {}
    } else {
        funError(res, null, "text/html");
    }
});

const port = 3000;
server.listen(port, () => console.log(`Escuchando en el puerto ${port}`));

const funError = (res, error, contentType) => {
    if (error) console.log(error);
    res.writeHead(404, { 'Content-Type': contentType });
    if (contentType === 'text/html')
        res.write("<p>Error 404: Pagina no encontrada</p>");
    res.end();
};
