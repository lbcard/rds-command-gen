var fs = require("fs");
var ptynCodes = require("./PTYN_config.json");

const readXlsxFile = require("read-excel-file/node");

const schema = {
  SHOW: {
    prop: "show",
    type: String,
    required: true,
  },
  DAYS: {
    prop: "days",
    type: String,
    required: true,
  },
  TIMES: {
    prop: "times",
    type: String,
    required: true,
  },
  GENRE: {
    prop: "genre",
    type: Number,
  },
};

async function genCommands(inFile, msgFile) {
  console.log("Generated Commands");
  // need to return a promise here!
  try {
    const gennedCommands = await readXlsxFile(inFile, { schema }).then(
      ({ rows, errors }) => {
        // `rows` is an array of rows
        // each row being an array of cells.

        // `errors` have shape `{ row, column, error, value }`.
        errors.length === 0;

        let validRowCount = 0;
        const commandsList = rows.map((r) => {
          // r is the row

          if (r && r.show && validRowCount <= 48) {
            let showName = r.show;
            const times = r.times;
            const days = r.days;
            const genre = r.genre;

            let showCode = "RT1";

            if (genre > 31) {
              showCode = "PTYN";
              showName = () => {
                const parsedCodes = JSON.parse(ptynCodes);
                return parsedCodes.PTYN.genre;
              };
            }

            const entryNumb =
              validRowCount + 1 <= 9
                ? `0${validRowCount + 1}`
                : validRowCount + 1;

            // the command max length is 35 chars. About 9 to 10 are taken up already.
            // therefore if over 25 then write it to a message instead and recall the message.
            // like RT1 text, messages can be 64 chars but command still has to be under 35
            // so its better to use the output rt2messages.txt file to manually add these as messages.
            if (showName.length > 25) {
              let originalShowName = showName;

              if (originalShowName.length > 64) {
                originalShowName = originalShowName.substring(0, 61) + "...";
              }

              showName = `RT2MSG=${entryNumb}`;

              // add to message file
              fs.appendFileSync(
                msgFile,
                `Message: ${validRowCount + 1}, ${originalShowName}\n`,
                function (err) {
                  if (err) throw err;
                  console.log("Message required note Saved!");
                }
              );
            }

            // encode times commas so they don't get stripped out later. "bzTaEq" unlikely to be used in a showname
            const encodedTimes = times.replace(/,/g, "bzTaEq");

            const commandEntry =
              `*S${entryNumb}C=${showCode}=${showName}\n` +
              `*S${entryNumb}P=${genre}\n` +
              `*S${entryNumb}T=${encodedTimes}\n` +
              `*S${entryNumb}D=${days}\n`;

            validRowCount++;

            return commandEntry;
          }
          return;
        }); // end map

        return commandsList;
      }
    ); // end readfile

    return gennedCommands;
  } catch (e) {
    console.log("error occured in gencommands function");
    console.log(e);
  }
}

function end(createdCommands, outFile) {
  try {
    const sendCommand = "*SEN=1\n*SEN\n";

    const closeCommands = createdCommands.concat(sendCommand);

    const stringCommands = closeCommands.toString();

    // strip out commas
    const stringCommandsClean = stringCommands.replace(/,/g, "");

    //decode times commas encoding for final output
    const stringFixTimesClean = stringCommandsClean.replace(/bzTaEq/g, ",");

    fs.writeFile(outFile, stringFixTimesClean, function (err) {
      if (err) throw err;
      console.log("Commands Saved!");
    });
  } catch (e) {
    console.log("error occured in end function");
    console.log(e);
  }
}

async function init() {
  // import xlsx and setup output files
  const scheduleIn = "../input/rds_template.xlsx";
  const scheduleOut = "../output/rds_schedule.txt";
  const msgFile = "../output/rt2Messages.txt";

  // clean up prep
  if (fs.existsSync(scheduleOut)) {
    fs.unlinkSync(scheduleOut);
  }
  if (fs.existsSync(msgFile)) {
    fs.unlinkSync(msgFile);
  }

  const commands = await genCommands(scheduleIn, msgFile);

  end(commands, scheduleOut);
}

init();
