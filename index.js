var fs = require("fs");

const readXlsxFile = require("read-excel-file/node");

const schema = {
  SHOW: {
    prop: "show",
    type: String,
    required: true,
  },
  days: {
    prop: "days",
    type: Number,
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
  console.log("genCommands!!");
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
          if (r && r.show) {
            // console.log(r);

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
            // console.log(commandEntry);
            // commandsList.concat(commandEntry);

            validRowCount++;
            return commandEntry;
          }
          return;
        }); // end map
        // console.log(commandsList);
        return commandsList;
      }
    ); // end readfile

    return gennedCommands;
  } catch (e) {
    console.log("error occured in gencommands");
    console.log(e);
  }
}

function end(createdCommands, outFile) {
  try {
    console.log("Running End");
    // console.log(createdCommands);

    const sendCommand = "*SEN=1\n*SEN\n";

    const closeCommands = createdCommands.concat(sendCommand);

    const stringCommands = closeCommands.toString();

    const stringCommandsClean = stringCommands.replace(/,/g, "");

    fs.writeFile(outFile, stringCommandsClean, function (err) {
      if (err) throw err;
      console.log("Commands Saved!");
    });
  } catch (e) {
    console.log("error occured in end");
  }
}

async function init() {
  const commands = await genCommands(scheduleIn);
  // console.log(commands);

  end(commands, scheduleOut);
}

init();
