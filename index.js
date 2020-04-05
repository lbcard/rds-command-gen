var fs = require("fs");

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

// import xlsx
const scheduleIn = "./input/rds_template.xlsx";
const scheduleOut = "./output/rds_schedule.txt";

async function genCommands(inFile) {
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
            const showName = r.show;
            const times = r.times;
            // const timesFormatted = times.replace(/, /gi, "");
            const days = r.days;
            const genre = r.genre;

            const showCode = showName === "National" ? "PTYN" : "RT1";

            const commandEntry =
              `*S${validRowCount + 1}C=${showCode}=${showName}\n` +
              `*S${validRowCount + 1}P=${genre}\n` +
              `*S${validRowCount + 1}T=${times}\n` +
              `*S${validRowCount + 1}D=${days}\n`;

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

    const stringCommandsClean = stringCommands.replace(/,/g, "");

    fs.writeFile(outFile, stringCommandsClean, function (err) {
      if (err) throw err;
      console.log("Commands Saved!");
    });
  } catch (e) {
    console.log("error occured in end function");
    console.log(e);
  }
}

async function init() {
  const commands = await genCommands(scheduleIn);

  end(commands, scheduleOut);
}

init();
