const express = require('express');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const path = require('path');
const app = express();

const port = 5000;
//const {getHomePage} = require('./routes/index');
//const {addPlayerPage, addPlayer, deletePlayer, editPlayer, editPlayerPage} = require('./routes/player');
var db = mysql.createConnection ({
                                    host: 'localhost',  
                                    user: 'root',       
                                    password: 'basketball126',   
                                    database: 'arenaSystem'}); 

// connect to database
db.connect((err) => { if (err) { throw err; } console.log('Connected to database'); });
global.db = db;


app.set('port', process.env.port || port); 
app.set('views', __dirname + '/views'); 
app.set('view engine', 'ejs'); 
app.use(bodyParser.urlencoded({ extended: false })); 
app.use(bodyParser.json()); 
// app.use(express.static(path.join(__dirname, 'public'))); 
app.use(express.static(__dirname + '/'));
app.use(fileUpload()); 

var router=express.Router();


//comment this section
router.get('/', function(req, res){ //connecting to root database 
  if(db.state == 'disconnected')
  {
    db = mysql.createConnection ({
      host: 'localhost',  
      user: 'root',       
      password: 'basketball126',   
      database: 'arenaSystem'}); 
    db.connect((err) => { if (err) { throw err; } console.log('Reconnected to database'); });
  }
  else{
    console.log("Database still connected")
  }
  
  res.render('home.ejs', {
    title: 'Home Page', //rendering the home page
    incorrect: false
  });
});

  router.post('/login', function(req,res) //user logs in 
  {
    console.log(req.body)
    if (req.body.username=="admin") //check if the admin logged in
    {
      if(req.body.password=="admin")
      {
        let query = "SELECT * FROM Customer; " //render each customer info if the admin logged in 
    
        
        db.query(query, (err, result) => {
          if (err) 
          {
            res.redirect('/');
          }
          res.render('index.ejs', { 
            title: 'Customer Info'
            ,customers: result   //pass all customer info to an array which index.ejs renders 
          });
        });
      }
      else
      {
        console.log("Not a user or incorrect password");  //if it is not an admin or user, render the home page for guest
        res.render('home.ejs', {
          incorrect: true
        });
      }
    }

    else
    {
      let query = 'SELECT * FROM Customer WHERE username = "'+req.body.username+'"';   //check if the user exists in database
      db.query(query, (err, result) => {
        console.log(result)

        if (err) 
        {
          res.redirect('/'); 
        }

        if(result.length!=0)
        {
          if(result[0].customerPassword==req.body.password) //if the password entered matches the password in the database
          {
            let flag=true;
            if(result[0].rewardPoints==0)
            {
              flag=false;
            }
            console.log("flag is set to: "+ flag) 

            
            res.render('customer.ejs', { //if the customer login is successful, render their account page
              title: 'Customer Info', 
              customers: result,
              button:false,
              button1: flag
            });
          }

          else
          {
            console.log("Not a user or Incorrect Password"); //username exists, incorrect password
            res.render('home.ejs', {
              incorrect: true
            });
          }

        }else{
          console.log("Not a user or Incorrect Password"); //not a user
            res.render('home.ejs', {
              incorrect: true
            });
        }

      });
    }

  });


  router.get('/customer', function(req, res){

    res.render('signup.ejs') //signup page for new users
      
  });

router.post('/customer', function(req, res) { //registering a new customer
let message = '';
let username = req.body.username;
let customerName = req.body.customerName;
let personalInfo = req.body.personalInfo;
let customerPassword = req.body.customerPassword;
let walletPassword = req.body.walletPassword;
//let purchaseHistory = req.body.purchaseHistory;
//let rewardPoints = req.body.rewardPoints;

let usernameQuery = "SELECT * FROM Customer WHERE username = '" + username + "'";  //check if the username that the user entered already exits

db.query(usernameQuery, (err, result) => { 
  if (err) {
      return res.status(500).send(err);
  }
  if (result.length > 0) { 
      message = 'Username already exists'; //if it exists, prompt the user to enter a different username
      let flag=true;
            if(result[0].rewardPoints==0)
            {
              flag=false;
            }
            
      res.render('customer.ejs', {
        button:false, 
        button1: flag

      });
  } else { //if the username is unique, enter all the values the user entered
              let query = "INSERT INTO Customer (username, customerName, personalInfo, customerPassword, walletPassword, purchaseHistory, rewardPoints) VALUES ('" + 
                  username + "', '" + customerName + "', '" + personalInfo + "', '" + customerPassword + "', '" + walletPassword + "', '" + "None" + "', '" + "0" + "')";
              db.query(query, (err, result) => {
                  if (err) {
                      return res.status(500).send(err);
                  }
                  res.render('home.ejs', {
                    title: 'Home Page', //render the home page for the new user to login 
                    incorrect: false
                  });
              });
  }
});
});

router.get('/cashRewards/:id', function(req, res){  //set the rewards to zero using the id that is passed as a parameter
  let username=req.params.id
     
     let query = "UPDATE Customer SET `rewardPoints` = 0 WHERE username = '" + username + "'";  //find the username, set their rewards to zero 
     db.query(query, (err, result) => {
         if (err) {
             return res.status(500).send(err);
         }
 });
 
 let usernameQuery = "SELECT * FROM Customer WHERE username = '" + username + "'";       //render the customer page with the updated values of the database 

 
 db.query(usernameQuery, (err, result1) => {
         if (err) {
             return res.status(500).send(err);
         }

     res.render('customer.ejs', {
          title: 'Customer Info', //new rendering of page will show rewards set to zero 
          customers: result1,
          button: true,
          button1: false
        });
 });
});



router.get('/viewReceipt/:id', function(req, res){  //view the receipt of cashing in rewards for a given user

  let username=req.params.id
     
     let query = "SELECT * FROM CustomerAddress WHERE username = '" + username + "'"; //display the users address and info on the receipt


     db.query(query, (err, result) => {
         if (err) {
             return res.status(500).send(err);
         } 
         
         res.render('receipt.ejs', { //render receipt and pass customer info as an array
    customer : result
  });
 });
 




});

router.get('/thanks', function(req, res){ //quit function to close the database
  db.end(function(err) {
    if (err) {
      return console.log('error:' + err.message);
    }
    console.log('Closed the database connection.');
  });
  
  res.render('thanks.ejs', {
    title: 'Home Page',
    incorrect: false
  });
});

router.get('/cityUpdated', function(req, res){    //admin function to set rewards to zero for all users living in a specific era
  console.log(req.query.selectpicker)
 
  let query = "UPDATE (Customer NATURAL JOIN CustomerAddress) SET `rewardPoints` = 0 WHERE city = '" + req.query.selectpicker + "'"; //natural join customer to customer address to set rewards to zero
  

  db.query(query, (err, result) => {
    if (err) {
      return res.status(500).send(err);
  }
  
});

let query2 = "SELECT * FROM Customer NATURAL JOIN CustomerAddress";  //display the customer info with address to the admin to show that users living in this area have rewards of zero 

db.query(query2, (err, result2) => {

  if (err) {
    return res.status(500).send(err);
}  

  res.render('city.ejs', {
    title: 'City Info' //render the city.ejs with all customer info and addresses 
    ,customers: result2 
  });
});

});



router.get('/expiry', function(req, res){ //prompt users with expired cards to re enter card information 
  let expiryDate =req.body.expiryDate
  
  let query = "SELECT * FROM PaymentInfo"; //query to find all payment info 
  var yearInt = []
  var expiryTracker = []
  db.query(query, (err, result) => {
      if (err) {
          return res.status(500).send(err);
      } 
for(var i=0; i<result.length; i++){
    result[i].expiryDate=result[i].expiryDate.split("/")[2]; //split date to find the year 
    var yearString = result[i].expiryDate.toString();
     var Determiner =Number(yearString);
     if(Determiner < 1980){ //if the credit cards expired before 1980, push the username of all of the expired cards 
     yearInt.push( result[i].username);
     expiryTracker.push(result[i].expiryDate) 
     }
}
for(var i = 0; i<yearInt.length; i++){
  //for each user, update their personal info to state that they need to update card information wherever a username is found in the array

   let query2 = "UPDATE (Customer NATURAL JOIN PaymentInfo) SET personalInfo = 'Credit Card Expired' WHERE username = '" +yearInt[i]+"'"; 
   db.query(query2, (err, result2) => {
    if (err) {
        return res.status(500).send(err);
    } 
  });

   result[i].username = yearInt[i];
  result[i].expiryDate = expiryTracker[i];
}

      res.render('expiry.ejs', { //render the expiry page to the admin with the username and expiry date 
     dates : result, totalRows : yearInt.length


});

});
});
router.get('/sent', function(req, res){
  res.render('sent.ejs')
});

app.use('/', router)
// set the app to listen on the port
app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});