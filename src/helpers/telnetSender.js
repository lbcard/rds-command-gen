"use strict";

const Telnet = require("telnet-client");
const fs = require("fs");
const readline = require("readline");

const sendViaTelnet = async (configs, commandsFile, responseFile) => {
  let connection = new Telnet();

  const telnetConfigs = configs[0];

  const readInterface = readline.createInterface({
    input: fs.createReadStream(commandsFile),
    output: process.stdout,
    console: false,
  });

  // send command, write response and command to file, delay of 250ms
  // delay is to give the encoder chance to acknowledge the command
  readInterface.on("line", async function (line) {
    // setTimeout(async function () {

    // setup telnet connection
    try {
      const connectRes = await connection.connect(telnetConfigs);
      console.log(`telnet connection successful, ${connectRes}`);
    } catch (error) {
      // handle the throw (timeout)
      console.log(new Error(`error connecting to device via Telnet ${error}`));
    }

    const trimmedLine = line.trim();
    const res = await connection.exec(trimmedLine);

    fs.appendFileSync(
      responseFile,
      `Command Sent: ${trimmedLine}, Telnet Response: ${res}\n`,
      function (err) {
        if (err) throw err;
        console.log("Telnet response written");
      }
    );
    // }, 250);
  });
};

module.exports = sendViaTelnet;
