CREATE DATABASE  arenaSystem;
USE arenaSystem;

create table CustomerAddress(
username VARCHAR(25) NOT NULL,
street VARCHAR(20) NOT NULL,
city VARCHAR(20),
postal VARCHAR(10) NOT NULL,
PRIMARY KEY (username)
);

create table Customer(
username VARCHAR(25) NOT NULL,
customerName VARCHAR(100) NOT NULL,
personalInfo VARCHAR(500),
customerPassword VARCHAR(25) NOT NULL,
walletPassword VARCHAR(25) NOT NULL,
purchaseHistory VARCHAR(50) NOT NULL,
rewardPoints float(6),
PRIMARY KEY (username) 
);
create table Booth(
username VARCHAR(25) NOT NULL,
eventName VARCHAR(25) NOT NULL,
boothID INT(11) NOT NULL, 
PRIMARY KEY(username, eventName)
);

create table PaymentInfo(
username VARCHAR(25) NOT NULL,
cardNumber float(18) NOT NULL,
expiryDate VARCHAR(25) NOT NULL,
securityCode int(3) NOT NULL,
PRIMARY KEY (username) 
);

create table Arena(
arenaName VARCHAR(25) NOT NULL,
seatCapacity int(6) NOT NULL,
PRIMARY KEY (arenaName) 
);

create table ArenaAddress(
arenaName VARCHAR(25) NOT NULL,
street VARCHAR(20) NOT NULL,
city VARCHAR(20),
postal VARCHAR(6) NOT NULL,
PRIMARY KEY (arenaName)
);

create table Seat(
seatNumber VARCHAR(10) NOT NULL,
price int(6) NOT NULL,
locationInArena VARCHAR(20) NOT NULL,
averagePrice int(6),
PRIMARY KEY (seatNumber)
);

create table theEvent(
eventOrganizer VARCHAR(20) NOT NULL,
eventDate Date Not null,
eventType VARCHAR(20) NOT NULL,
timing varchar(10) NOT null,
eventCapacity int(6) NOT NULL,
PRIMARY KEY (eventOrganizer, eventDate)
);

create table Arenatransaction(
transactionID INT(11) NOT NULL, 
totalCost float(6) NOT NULL,
PRIMARY KEY(transactionID)
);

describe Customer;
describe PaymentInfo;
describe Arena;
describe Seat;
describe theEvent;
describe Arenatransaction;

insert into Booth values(
'billy1',
'Raptors Game',
123
);
insert into Seat(seatNumber, price, locationInArena)
Values('ASEAT',12354, 'middleofNowehere');

insert into CustomerAddress values(
'Jayp',
'JPStreet',
'JPCity',
'postaT'
);

INSERT INTO ArenaAddress(arenaName,street, city, postal)
   SELECT username, street, city, postal
   FROM CustomerAddress;
   
   
DESCRIBE Booth;
DESCRIBE CustomerAddress;
DESCRIBE ArenaAddress;


CREATE VIEW RequiredFromCustomer AS SELECT username, customerName, customerPassword, walletPassword, purchaseHistory FROM Customer;
SELECT * FROM RequiredFromCustomer;

CREATE VIEW RewardPointsAbove1000 AS SELECT username, rewardPoints FROM Customer WHERE rewardPoints > 1000;
SELECT * FROM RewardPointsAbove1000;

CREATE VIEW WeakPassword AS SELECT username, customerPassword FROM Customer WHERE LENGTH(customerPassword) < 5;
SELECT * FROM WeakPassword;


insert into RequiredFromCustomer values(
'hasenfd',
'Harry',
'12345678',
'qwerty12',
'2018-01-12 2:12:00'
);
SELECT * FROM RequiredFromCustomer WHERE username = 'hasenfd';







-- ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'Basketball';
