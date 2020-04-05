# rds-command-gen

Command generator for RDS schedules for RDS Pro based on Excel file input. Designed for use with RDS Pro GUI Command Line.

This is to help make keeping RDS schedules uptodate easier so somebody non-technical can do it. Someone who has access to the station's RDS encoder box can then paste the generated commands straight in and send to the box reducing technical overhead.

## Install instructions

- Install node
- clone this repo
- run 'npm i' to install the dependencies (only 1)

## Operation Instructions

- Edit the template xlsx file in the input folder. There is a guide
- cd into the directory of the repo
- run 'node index.js'

## ToDo

- Create an install bat file
- Create a run bat file
- Add stricter parsing and error handling on the field inputs
