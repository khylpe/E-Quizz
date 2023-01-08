const express = require('express'),
       app = express(),
       http = require('http'),
       server = http.createServer(app),
       { Server } = require("socket.io"),
       io = new Server(server),
       mysql = require('mysql'),
       php = require('php'),
       path = require('path');

app.set('views', path.join(__dirname, 'src/php'))
app.set('view engine', 'php');
app.engine('php', php.__express);

// Enable access to the src folder :
app.use(express.static('src')); // https://stackoverflow.com/a/54747432/19601188

let numberOfStudentConnected = 0,
       numberOfRegisteredStudents = 0,
       numberOfAnswers = 0,
       listOfRegisteredStudents = [],
       isSessionCreated = new Boolean(false);

// Express routing :
app.get('/', (dataFromClient, serverResponse) => {
       serverResponse.sendFile(__dirname + '/index.html');
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

app.get('/getQuizzNames.php', (req, res) => {
       res.render('getQuizzNames.php', {
              _REGISTER_GLOBAL_MODEL: false
       })
});
// End of Express routing

io.on('connection', function (client) {
       client.modifiedID = createUniqueID();

       // check if the client is a teacher or a student and join the right room:
       let requestedUrl = client.handshake.headers.referer;

       if (requestedUrl.includes('teacher')) {
              isSessionCreated = true;
              client.join('teacher');
              
       } else if (requestedUrl.includes('student')) {
              client.join('student');
              client.to('teacher').emit('student connected changed', ++numberOfStudentConnected);
       } else {
              console.log("Unknown connected");
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
              }else{
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

async function createQuizzInDB() { // not finished
       var connection = mysql.createConnection({
              host: 'localhost',
              port: 6666,
              user: 'root',
              password: 'admin',
              database: "equizz"
       });

       connection.connect(async function (err) {
              if (err) {
                     throw err;
              }
              else {
                     await fetch('http://localhost:3000/updateDB.php', {
                            method: 'POST',
                            body: JSON.stringify({
                            })
                     })
                            .then(response => response.json())
                            .then(data => {
                                   console.log(data);
                            })
                            .catch((error) => {
                                   console.error('Error:', error);
                            });
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