const express = require('express'),
       app = express(),
       http = require('http'),
       server = http.createServer(app),
       { Server } = require("socket.io"),
       io = new Server(server, {allowEIO3: true}),
       mysql = require('mysql');
//php = require('php');
 
// Enable access to the src folder :
app.use(express.static('src')); // https://stackoverflow.com/a/54747432/19601188

//dont forget to isSessionCreated = true;

let numberOfStudentConnected = 0,
       numberOfRegisteredStudents = 0,
       numberOfAnswers = 0,
       listOfRegisteredStudents = [],
       isSessionCreated = new Boolean(false);

// Express routing :
app.get('/', (dataFromClient, serverResponse) => {
       console.log('index.html requested');
       // serverResponse.sendFile(__dirname + '/index.html');
});
app.get('/index.html', (dataFromClient, serverResponse) => {
       serverResponse.sendFile(__dirname + '/index.html');
});
app.get('/teacher', (dataFromClient, serverResponse) => {
       serverResponse.sendFile(__dirname + '/teacher.html');
});
app.get('/teacher.html', (dataFromClient, serverResponse) => {
       serverResponse.sendFile(__dirname + '/teacher.html');
});
app.get('/student', (dataFromClient, serverResponse) => {
       serverResponse.sendFile(__dirname + '/student.html');
});
app.get('/student.html', (dataFromClient, serverResponse) => {
       serverResponse.sendFile(__dirname + '/student.html');
});
// End of Express routing

var connection = mysql.createConnection({
       host: '127.0.0.1',
       user: 'equizz',
       password: 'equizz2023',
       database: 'equizz',
       port: 6666
});

connection.connect(async function (err) {
       if (err)
              throw err;
});

io.on('connection', function (client) {
       console.log('a user connected');
       client.modifiedID = createUniqueID();

       // check if the client is a teacher or a student and join the right room:
       let requestedUrl = client.handshake.headers.referer;

       if (requestedUrl.includes('teacher')) {
              client.join('teacher');
              client.on('teacher tries to connect', (data) => {
                     if (client.rooms.has('teacher')) {
                            if (checkTeacherCredentials(data)) {
                                   client.mail = data.mail;
                                   client.emit('teacher connection success', client.mail);
                                   client.on('fetch quizz', (author) => {
                                          fetchQuizz(client, author);
                                          client.on('fetch student groups', () => {
                                                 fetchStudentGroups(client);
                                          });
                            });
                            } else {
                                   client.emit('teacher connection failed');
                            }
                     }
              });
       } else if (requestedUrl.includes('student')) {
              client.join('student');
              client.to('teacher').emit('student connected changed', ++numberOfStudentConnected);
       } else {
              console.log('Error: client is neither a teacher nor a student');
              client.removeAllListeners();
              client.disconnect();
              return;
       }

       // Signals from students (client side) when they are registered :
       client.on('registered', (studentName) => {
              if (isSessionCreated) {
                     if (client.username == undefined) {
                            numberOfRegisteredStudents++;
                     }
                     client.username = studentName;
                     client.to('teacher').emit('students registered changed', {
                            id: client.modifiedID,
                            studentName: client.username,
                            status: "registered",
                            numberOfRegisteredStudents: numberOfRegisteredStudents
                     });
              } else {
                     client.emit('session not created');
              }
       });

       client.on('disconnecting', () => {
              if (client.rooms.has('teacher')) {
                     isSessionCreated = false;
                     client.to('student').emit('teacher disconnected'); // not used yet
              } else if (client.rooms.has('student')) {
                     client.to('teacher').emit('student connected changed', --numberOfStudentConnected);
                     if (client.modifiedID != undefined && client.username != undefined) {
                            client.to('teacher').emit('students registered changed', {
                                   id: client.modifiedID,
                                   studentName: client.username,
                                   status: "not registered anymore",
                                   numberOfRegisteredStudents: --numberOfRegisteredStudents
                            });
                     }
              }
       });
});

async function checkTeacherCredentials(data) {
       /* Safe query with mysql.format() : */
       var queryCredential = "SELECT * FROM ?? WHERE ?? = ? and ?? = ?";
       var insertsCredential = ['user', 'mail', data.mail, 'password', data.password];
       queryCredential = mysql.format(queryCredential, insertsCredential);

       connection.query(queryCredential, async  function (err, result, fields) {
              if (err) throw err;

              if (result.length > 0) {
                     return true;
              }
              else {
                     return false;
              }
       });
}

function fetchQuizz(client, author) {
       var queryQuizz = "SELECT DISTINCT ?? FROM ?? WHERE ?? = ?";
       var insertsQuizz = ['title', 'quizz', 'author', author];
       queryQuizz = mysql.format(queryQuizz, insertsQuizz);

       connection.query(queryQuizz, function (err, result, fields) {
              if (err) throw err;
              if (result.length > 0) {
                     client.emit('result quizz list', result);
              }
              else {
                     // no quizz found
              }
       });
}

function fetchStudentGroups(client) {
       var queryGroups = "SELECT DISTINCT ?? FROM ??";
       var insertsGroups = ['name', 'student group'];
       queryGroups = mysql.format(queryGroups, insertsGroups);

       connection.query(queryGroups, function (err, result, fields) {
              if (err) throw err;
              if (result.length > 0) {
                     console.log(result);
                     client.emit('result student groups', result);
              }
              else {
                     // no quizz found
              }
       });
}

function createUniqueID() {
       let ID = Math.floor(Math.random() * 1000000);
       if (listOfRegisteredStudents.includes(ID)) {
              createUniqueID();
       } else {
              listOfRegisteredStudents.push(ID);
              return ID;
       }
}

server.listen(8100, () => {
});    