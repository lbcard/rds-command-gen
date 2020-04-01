var fs = require("fs");

const readXlsxFile = require("read-excel-file/node");

const schema = {
  SHOW: {
    prop: "show",
    type: String,
    required: true
  },
  days: {
    prop: "days",
    type: Number,
    required: true
  },
  TIMES: {
    prop: "times",
    type: String,
    required: true
  },
  GENRE: {
    prop: "genre",
    type: Number
  }
};

// import xlsx
const scheduleIn = "./input/rds_template.xlsx"; // "./input/rds_schedule.xlsx";
const scheduleOut = "./output/rds_schedule.txt";

function genCommands(inFile) {
  console.log("genCommands!!");
  // need to return a promise here!
  return new Promise((resolve, reject) => {
    const commandsList = "";
    readXlsxFile(inFile, { schema }).then(({ rows, errors }) => {
      // `rows` is an array of rows
      // each row being an array of cells.

      // `errors` have shape `{ row, column, error, value }`.
      errors.length === 0;

      for (i = 0; i < 50; i++) {
        if (rows[i] && rows[i].show) {
          // console.log(rows[i]);

          const showName = rows[i].show;
          const times = rows[i].times;
          // const timesFormatted = times.replace(/, /gi, "");
          const days = rows[i].days;
          const genre = rows[i].genre;

          const showCode = showName === "National" ? "PTYN" : "RT1";

          const commandEntry = `
                                        *S${i + 1}C=${showCode}=${showName}\n
                                        *S${i + 1}P=${genre}\n
                                        *S${i + 1}T=${times}\n
                                        *S${i + 1}D=${days}\n
                                    `;
          // console.log(commandEntry);
          commandsList.concat(commandEntry);
        }
      }
      console.log("commandsList", commandsList);
      return commandsList;
    });

    resolve(commandsList);
  });
}

function end(createdCommands, outFile) {
  console.log("Running End");
  console.log(createdCommands);
  const sendCommand = "SEN=1\n*SEN\n";

  createdCommands.concat(sendCommand);

  fs.writeFile(outFile, createdCommands, function(err) {
    if (err) throw err;
    console.log("Commands Saved!");
  });
}

async function init() {
  const commands = await genCommands(scheduleIn);
  console.log(commands);

  end(commands, scheduleOut);
}

init();
