import express from 'express';
const app = express();
app.get('/foo', (req, res) => {
    console.log('Received request at /foo');
    res.send('Hello from /foo');
});
app.get('/bar', (req, res) => {
    console.log('Received request at /bar');
    res.send({x: '3'});
});

app.use(express.static('public'));
app.listen(3000)
console.log('Server is running on port 3000');