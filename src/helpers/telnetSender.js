"use strict";

const Telnet = require("telnet-client");
const fs = require("fs");
const readline = require("readline");

const sendViaTelnet = async (configs, commandsFile, responseFile) => {
  let connection = new Telnet();

  const readInterface = readline.createInterface({
    input: fs.createReadStream(commandsFile),
    output: process.stdout,
    console: false,
  });

  const telnetConfigs = configs[0];

  // setup telnet connection
  try {
    await connection.connect(telnetConfigs);
    console.log("telnet connection successful");
  } catch (error) {
    // handle the throw (timeout)
    console.log(new Error(`error connecting to device via Telnet ${error}`));
  }

  // send command, write response and command to file, delay of 250ms
  // delay is to give the encoder chance to acknowledge the command
  readInterface.on("line", async function (line) {
    // setTimeout(async function () {
    console.log(line);

    const trimmedLine = line.trim();
    console.log("trimmed line =", trimmedLine);
    const res = await connection.exec(trimmedLine);

    // let res = await connection.exec("uptime");
    // console.log("async result:", res);

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
