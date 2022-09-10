const client = require('..');
client.on("disconnect", async () => {
    const exec = require('child_process').execSync('node .');
    await console.log(String(exec))
});
