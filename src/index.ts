const express = require('express');


const app = express();

app.get('/', (req: any, res: any) => {
    res.json({
        ok: true,
        message: 'Server is running'
    })
});
const port = process.env.PORT || 4000;

app.listen( port, () => {
    console.log('Server running on port: ', port);
})