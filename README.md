# Introduction
This is a commandline application that sorts data from a csv file and insert some of it into a sqlite database and the rest into an activemq queue. It is written in javascript. The application was developed based on the following guidelines.
### Part 0

Generate a CSV file by hand or by a program with random values according the format in Appendix I.

The file should contain 100 rows. 20% of the rows must have “C” or “G” as the values for column 5. The

columns are zero indexed (meaning the first column is index 0 so the 5th column is index 4)

### Part I

Your program should open and read a CSV file with the format described in Appendix I. The program

will process each line and if the value column 5 in the file has the value “C”or “G” the entire row

should be inserted into a database of your choosing.

If the value in column 5 is anything other than “C” or “G” then the entire row should be inserted as a

JSON object into an Apache ActiveMQ queue with a key of your choice.

Your program should read the csv file name as a command line parameter. You can hard code the

database and ActiveMQ connection strings.

Constraints - Do not use an ORM for the database queries. Do not use a CSV library to read and parse

the CSV file. You may use ActiveMQ libraries to perform the exercise. You can design the table name in

any way you want to store the database rows.

### Part II

Upon starting your program should do two things (a) Connect to a database you created in Part I

above and then read the rows stored there and write them to a CSV file.

(b) Connect to the ActiveMQ queue and read the data contained therein and write them to a separate

CSV file from (b) above.

Constraints - Do not use an ORM for the database queries. Do not use a CSV library to write the CSV

file. You may use ActiveMQ libraries to perform the exercise.

### Appendix I

### CSV File Format

The csv file has 12 columns. Each column is separated by a pipe character “|” and each column can

contain any of the following values “A”,”G”,”C”,”T”



# Solution
## Prerequisites

activeMQ version 5.14 or later,nodejs and npm.

## Setup 

Grab this repository and navigate into application folder using the commandline.

```cmd/bash
git clone https://github.com/vinmugambi/devtest
cd devtest
```

Then install the dependencies by giving the following command in the cmd/terminal

```cmd/bash
npm install
```

In case you are using Ubuntu and the above command logs errors. Check whether you have latest versions of g++ and gcc installed on your machine.

## Running 
The application is made up of two scripts. The script named `insert.js` ; reads data from a given csv file and inserts it into activeMQ and sqlite. The one named `query.js`; reads data from both activeMQ and sqlite. It then creates two files namely `fromDb.csv`and `fromActiveMQ.csv` where it writes data from sqlite and activeMQ respectively.
The scripts are executed as follows.


```bash
node insert [csv_file_name]
node query 
```

Incase no argument is given as `csv_file_name` when running the insert script, the csv file located on the root (dummy_delimited.csv) is sorted instead.

## note
The query script will result into an error in case it is run before running the insert script. The `node query` command will create a folder named `output` in the root of the application; it will contain the `fromDb.csv` and `fromActiveMQ.csv` files.

