'use strict';
const client = require('..');
client.on("error", (err) =>{
    console.log(`Error: ${err.stack}`);
});
