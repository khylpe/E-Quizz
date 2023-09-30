# E-Quizz Student Interface
This branch is about the student interface, the connection centralization system and the technologies we are using.
## Tech Stack
**Client:** HTML, CSS, Bootstrap, JavaScript

**Server:** Node, Express, Socket.io (WebSoket)
## Versions
![Node.js version](https://img.shields.io/badge/Node.js-18.15.0-green)
[![Express version](https://img.shields.io/badge/Express-4.18.2-blue)](https://expressjs.com/fr/)
[![Socket.io version](https://img.shields.io/badge/Socket.io-4.5.4-red)](https://socket.io/)
[![Bootstrap version](https://img.shields.io/badge/Bootstrap-5.3.0.alpha_1-purple)](https://getbootstrap.com/)
[![Bootstrap-icons version](https://img.shields.io/badge/Bootstrap_icons-1.10.3-blueviolet)](https://icons.getbootstrap.com/)

## Run Locally
Requires [**Node**](https://nodejs.org/en/) and Git

Clone the project

```bash
  git clone -b server_student_node_express_socket https://github.com/Tristan13R/E-Quizz
```

Go to the project directory

```bash
  cd E-Quizz
```

All dependencies should already be installed in `node_modules` folder, otherwise : 

```bash
  npm install express@4.18.2
  npm install socket.io@4.5.4
  npm i bootstrap@5.3.0-alpha1
  npm i bootstrap-icons
```

Start the server

```bash
  node server.js
```
Access it

```bash
  http://[your_IP]:8100/
```


## Authors of this part of the project :
- [Arthur CRAHÉ](https://github.com/khylpe)
- [Tristan ROOS](https://github.com/Tristan13R)