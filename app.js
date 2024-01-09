const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser'); // Dodana linia
const bcrypt = require('bcrypt');
const saltRounds = 10;
const path = require('path');
const session = require('express-session');
const app = express();
app.set('views', path.join(__dirname, 'views', 'views'));
app.set('view engine', 'ejs'); // Ustawienie silnika widoku na EJS
app.use(bodyParser.json()); // Dodana linia
app.use(bodyParser.urlencoded({ extended: true })); // Dodana linia
const crypto = require("crypto")
const secr3t = crypto.randomBytes(20).toString("hex")
require('dotenv').config()
app.use(
  session({
	secret: secr3t,
	resave: true,
	saveUninitialized: true
}));

const connection = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Połączono z bazą danych MySQL.');
});



app.get('/userData', (req, res) => {
  if (req.session.loggedin) {
    const userIP = req.connection.remoteAddress;
    connection.query('SELECT imieinazwisko FROM users WHERE user_ip = ?', [userIP], (error, results, fields) => {
      if (error) throw error;
      if (results.length > 0) {
        res.send(results[0]); 
      } else {
        res.send('Brak danych użytkownika');
      }
    });
  } else {
    res.sendFile(path.join(__dirname, 'views', 'pls_login.html'));
  }
});


app.get('/success', (req, res) => {

    res.sendFile(path.join(__dirname, 'views', 'zarejestrowano.html'));
});

app.get('/konto', (req, res) => {
  if (req.session.loggedin) {
    res.sendFile(path.join(__dirname, 'views', 'konto.html')); // Plik HTML dla strony /konto
  } else {
     res.sendFile(path.join(__dirname, 'views', 'pls_login.html'));
  }
});

app.get('/getUserDataFromDB', (req, res) => {
  if (req.session.loggedin) {
    const userIP = req.connection.remoteAddress;
    connection.query('SELECT imieinazwisko, username, dataurodzenia, permisje FROM users WHERE user_ip = ?', [userIP], (error, results, fields) => {
      if (error) throw error;
      if (results.length > 0) {
        res.json(results[0]); // Przesyłanie danych jako JSON
      } else {
        res.send('Brak danych użytkownika');
      }
    });
  } else {
    res.redirect('/');
  }
});

// ksiazki



app.get('/getBorrowedBooksFromDB', (req, res) => {

    connection.query('SELECT * FROM wypozyczenia', (error, results, fields) => {
      if (error) throw error;
      res.json(results);
    });
});




app.post('/borrowBook', (req, res) => {
  const { imieinazwisko, tytul, data_wypozyczenia, data_oddania } = req.body;
  const borrow = { imieinazwisko, tytul, data_wypozyczenia, data_oddania };
  connection.query('INSERT INTO wypozyczenia SET ?', borrow, (error, results, fields) => {
    if (error) throw error;
    res.send('Książka wypożyczona pomyślnie.');
  });
});


app.delete('/deleteBorrow/:id', (req, res) => {
  if (req.session.loggedin) {
    const borrowId = req.params.id;
    connection.query('DELETE FROM wypozyczenia WHERE id = ?', [borrowId], (error, results, fields) => {
      if (error) throw error;
      res.send('Wypożyczenie zostało usunięte.');
    });
  } else {
    res.send('Brak odpowiednich uprawnień. Proszę się zalogować.');
  }
});



app.get('/admin/wypozyczone', (req, res) => {
  if (req.session.loggedin) {
    const userIP = req.connection.remoteAddress;
    connection.query('SELECT permisje FROM users WHERE user_ip = ?', [userIP], (error, results, fields) => {
      if (error) throw error;
      if (results.length > 0) {
        const userPermissions = results[0].permisje;
        if (userPermissions === "1") {
          res.sendFile(path.join(__dirname, 'views', 'admin-wypozyczone.html'));
          console.log("Wartość permisji z bazy danych: ", userPermissions);

        } else {
          res.sendFile(path.join(__dirname, 'views', 'main.html'));
          console.log("Wartość permisji z bazy danych: ", userPermissions);

        }
      } else {
        res.sendFile(path.join(__dirname, 'views', 'main.html'));
        console.log("Wartość permisji z bazy danych: ", userPermissions);

      }
    });
  } else {
    res.sendFile(path.join(__dirname, 'views', 'pls_login.html'));
  }
});





app.get('/admin', (req, res) => {
  if (req.session.loggedin) {
    const userIP = req.connection.remoteAddress;
    connection.query('SELECT permisje FROM users WHERE user_ip = ?', [userIP], (error, results, fields) => {
      if (error) throw error;
      if (results.length > 0) {
        const userPermissions = results[0].permisje;
        if (userPermissions === "1") {
          res.sendFile(path.join(__dirname, 'views', 'admin.html'));
          console.log("Wartość permisji z bazy danych: ", userPermissions);

        } else {
          res.sendFile(path.join(__dirname, 'views', 'main.html'));
          console.log("Wartość permisji z bazy danych: ", userPermissions);

        }
      } else {
        res.sendFile(path.join(__dirname, 'views', 'main.html'));
        console.log("Wartość permisji z bazy danych: ", userPermissions);

      }
    });
  } else {
    res.sendFile(path.join(__dirname, 'views', 'pls_login.html'));
  }
});



app.get('/admin/ksiazki', (req, res) => {
  if (req.session.loggedin) {
    const userIP = req.connection.remoteAddress;
    connection.query('SELECT permisje FROM users WHERE user_ip = ?', [userIP], (error, results, fields) => {
      if (error) throw error;
      if (results.length > 0) {
        const userPermissions = results[0].permisje;
        if (userPermissions === "1") {
          res.sendFile(path.join(__dirname, 'views', 'admin-ksiazki.html'));
          console.log("Wartość permisji z bazy danych: ", userPermissions);

        } else {
          res.sendFile(path.join(__dirname, 'views', 'main.html'));
          console.log("Wartość permisji z bazy danych: ", userPermissions);

        }
      } else {
        res.sendFile(path.join(__dirname, 'views', 'main.html'));
        console.log("Wartość permisji z bazy danych: ", userPermissions);

      }
    });
  } else {
    res.sendFile(path.join(__dirname, 'views', 'pls_login.html'));
  }
});


app.post('/addBook', (req, res) => {
  if (req.session.loggedin) {
    const userIP = req.connection.remoteAddress;
    connection.query('SELECT permisje FROM users WHERE user_ip = ?', [userIP], (error, results, fields) => {
      if (error) throw error;
      if (results.length > 0) {
        const userPermissions = results[0].permisje;
        if (userPermissions === "1") {
          const { logo, nazwa, autor, opis, liczbaStron } = req.body;
          const book = { logo, nazwa, autor, opis, liczbaStron };
          connection.query('INSERT INTO ksiazki SET ?', book, (error, results, fields) => {
            if (error) throw error;
            res.send('Książka dodana pomyślnie do bazy danych.');
          });
        } else {
          res.send('Brak odpowiednich uprawnień.');
        }
      } else {
        res.send('Brak odpowiednich uprawnień.');
      }
    });
  } else {
    res.send('Brak odpowiednich uprawnień. Proszę się zalogować.');
  }
});


app.get('/getBooksFromDB', (req, res) => {
  if (req.session.loggedin) {
    const userIP = req.connection.remoteAddress;
    connection.query('SELECT permisje FROM users WHERE user_ip = ?', [userIP], (error, results, fields) => {
      if (error) throw error;
      if (results.length > 0) {
        const userPermissions = results[0].permisje;
        if (userPermissions === "1") {
          connection.query('SELECT * FROM ksiazki', (error, results, fields) => {
            if (error) throw error;
            res.json(results);
          });
        } else {
          res.send('Brak odpowiednich uprawnień.');
        }
      } else {
        res.send('Brak odpowiednich uprawnień.');
      }
    });
  } else {
    res.send('Brak odpowiednich uprawnień. Proszę się zalogować.');
  }
});


app.delete('/deleteBook/:id', (req, res) => {
  if (req.session.loggedin) {
    const userIP = req.connection.remoteAddress;
    connection.query('SELECT permisje FROM users WHERE user_ip = ?', [userIP], (error, results, fields) => {
      if (error) throw error;
      if (results.length > 0) {
        const userPermissions = results[0].permisje;
        if (userPermissions === "1") {
          const bookId = req.params.id;
          connection.query('DELETE FROM ksiazki WHERE id = ?', [bookId], (error, results, fields) => {
            if (error) throw error;
            res.send('Książka usunięta pomyślnie z bazy danych.');
          });
        } else {
          res.send('Brak odpowiednich uprawnień.');
        }
      } else {
        res.send('Brak odpowiednich uprawnień.');
      }
    });
  } else {
    res.send('Brak odpowiednich uprawnień. Proszę się zalogować.');
  }
});



//ksiazki end


app.get('/logout', (req, res) => {
  req.session.destroy(function(err) {
      if (err) {
          console.log(err);
      } else {
          res.clearCookie(secr3t, { path: '/' });
          res.sendFile(path.join(__dirname, 'views', 'logout.html'));
      }
  });
});

app.get('/', (req, res) => {
  if (req.session.loggedin) {
    res.sendFile(path.join(__dirname, 'views', 'main.html'));
  } else {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
  }
});
app.get('/existingUser', (req, res) => {
    const username = req.query.username;
    res.sendFile(path.join(__dirname, 'views', 'existingUser.html'));
  });
app.get('/main', (req, res) => {
  if (req.session.loggedin) {
    res.sendFile(path.join(__dirname, 'views', 'main.html'));
  } else {
    res.sendFile(path.join(__dirname, 'views', 'pls_login.html'));
  }
});


app.get('/biblioteka/dostepne-ksiazki', (req, res) => {
  if (req.session.loggedin) {
  const username = req.query.username;
  res.sendFile(path.join(__dirname, 'views', 'dostepne-ksiazki.html'));
  } else {
    res.sendFile(path.join(__dirname, 'views', 'pls_login.html'));
  }
});



app.post('/register', (req, res) => {
  const { imieinazwisko, dataurodzenia, username, password } = req.body; // Dodano imieinazwisko
  const userIP = req.connection.remoteAddress;
  connection.beginTransaction(function (err) {
    if (err) { throw err; }
    connection.query('SELECT * FROM users WHERE user_ip = ?', [userIP], (error, results, fields) => {
      if (results.length > 0) {
        const existingUser = results[0];
        res.redirect(`/existingUser?username=${existingUser.username}`);
      } else {
        bcrypt.hash(password, saltRounds, (err, hash) => {
          const user = { imieinazwisko, dataurodzenia, username, password: hash, user_ip: userIP }; // Dodano imieinazwisko
          connection.query('INSERT INTO users SET ?', user, (error, results, fields) => {
            if (error) {
              return connection.rollback(function() {
                throw error;
              });
            }
            connection.commit(function(err) {
              if (err) {
                return connection.rollback(function() {
                  throw err;
                });
              }
              res.sendFile(path.join(__dirname, 'views', 'zarejestrowano.html'));
            });
          });
        });
      }
    });
  });
});
  
  
  app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const userIP = req.connection.remoteAddress;
    connection.query('SELECT * FROM users WHERE username = ? AND user_ip = ?', [username, userIP], (error, results, fields) => {
      if (error) throw error;
      if (results.length > 0) {
        const user = results[0];
        bcrypt.compare(password, user.password, (err, result) => {
          if (result) {
            req.session.loggedin = true;
            res.sendFile(path.join(__dirname, 'views', 'login_redirect.html'));
          } else {
            res.sendFile(path.join(__dirname, 'views', 'invalid.html'));
          }
        });
      } else {
        res.sendFile(path.join(__dirname, 'views', 'invalid.html'));
      }
    });
  });

const port = process.env.PORT
app.listen(port, () => {
  console.log('Strona działa na porcie ', port);
});
