const client = require('..');
client.on("error", (err) =>{
    console.log(`Error: ${err}`);
});
