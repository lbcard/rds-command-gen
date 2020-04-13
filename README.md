# rds-command-gen

Command generator for RDS schedules for the Audessence RDS Pro 2 encoder based on Excel file input. Designed for use with RDS Pro telnet command line and RDS PRO GUI (for RT2 Messages). This may work for other RDS encoders if they take similar commands. Please check your own device ofr compatibility.

This is to help make keeping RDS schedules uptodate easier so somebody non-technical can do it. Someone who has access to the station's RDS encoder box can then paste the generated commands straight in and send to the box reducing technical overhead.

This script currently doesn't auto send the commands via telnet. This is something that will be added with a config setting to toggle on and off. As the script was intended to keep the decoupling between the xlsx file and the actual changing of data on the encoder, this was not initially included - mainly to mitigate formatting errors and force a 'second set of eyes' on the commands before sending them.

## Install instructions

- Install node
- clone this repo
- run 'npm i' to install the dependencies (only 1)

## Operation Instructions

- Edit the template xlsx file in the input folder. There is a guide within it (in green area) for formatting and genre codes etc....
- cd into the directory of the repo
- run 'node index.js'

Also, don't use "bzTaEq" as a string within the show name on the xlsx. This string combination is used to encode commas between times to protect them temporarily. Unlikely but just a heads up!

## Important Notes

### Long Show Names

The shown name max length is normally 64 characters BUT the command max length is 35 characters. The workaround (according to the encoder manual) is to add these longer titles as 'radiotext2 messages'. Therefore, this script generates the command to trigger an rt2msg corresponding to the show schedule entry number. There is then a separate txt file generated in the output folder (rt2Messages.txt) that lists the messages you need to manually add and under which message number to do so.

This is a manual step because although a command for this can be generated, the gain would only be a few characters as the max command length is still 35. Doing it manually here allows you to make full use of the 64 character limit if required.

If the show name is longer than 64 characters, it gets truncated to 61 characters and "..." gets added.

### Custom PTY Codes

Use the PTYN_config.json file to add custom PTY codes if required.

This follows the format of:
[{PTYN: {"32": "myCode", "33": "anotherCode"}}]
The numbers start at 32 as upto 31 is taken by RDS standard PTY codes.

## ToDo

- Create an install bat file
- Create a run bat file
- Add stricter parsing and error handling on the field inputs
- Add telnet client and option to auto send to the box
- Add 'watch' on a folder (probably within the bat file) for fully automated workflow (i.e. user just drops xlsx into that folder). This could be setup as a Dropbox or GDrive folder for remote triggering.
