const fs = require("fs");
const ptynCodes = require("./configs/PTYN_config.json");
const telnetConfigs = require("./configs/telnet_configs.json");
const { genCommands, endCommands } = require("./helpers/genCommands");
// const endCommands = require("./helpers/genCommands");
const sendViaTelnet = require("./helpers/telnetSender");
const schema = require("./configs/xlsx_Schema");

async function init() {
  // import xlsx and setup output files
  const scheduleIn = "../input/rds_template.xlsx";
  const scheduleOut = "../output/rds_schedule.txt";
  const msgFile = "../output/rt2Messages.txt";
  const telnetOut = "../output/telnetOut.txt";

  // clean up prep
  if (fs.existsSync(scheduleOut)) {
    fs.unlinkSync(scheduleOut);
  }
  if (fs.existsSync(msgFile)) {
    fs.unlinkSync(msgFile);
  }
  if (fs.existsSync(telnetOut)) {
    fs.unlinkSync(telnetOut);
  }

  const commands = await genCommands(scheduleIn, ptynCodes, msgFile, schema);

  await endCommands(commands, scheduleOut);

  await sendViaTelnet(telnetConfigs, scheduleOut, telnetOut);
}

init();
