import pandas as pd
import sqlalchemy
import pymysql

data=pd.read_csv("auspol2019.csv")
data=data.truncate(before=0, after=6999)


usernameData= pd.read_csv("emails.csv")
usernameData= usernameData.truncate(before=0, after=6999)

data2=pd.read_csv("data.csv",  encoding = "ISO-8859-1")
data2=data2.truncate(before=0, after=6999)

data3=pd.read_csv("data4.csv")
data3=data3.truncate(before=0, after=6999)

#customers:
username=usernameData.email
customerName=data.user_name
personalInfo=data.user_description
password=data2.name
walletPassword=data.id
rewardPoints=data2.fav_number
purchaseHistory=data3.date_format.map(str)

columns = ['username','customerName','personalInfo', 'customerPassword', 'walletPassword','purchaseHistory','rewardPoints']
tuples=list(zip(username,customerName,personalInfo, password, walletPassword,purchaseHistory,rewardPoints))
df1=pd.DataFrame(tuples,columns=columns)
print(df1)
df1.to_csv('out.csv')



#payment info
data4=pd.read_csv("data5.csv", index_col=False)
data4=data4.truncate(before=0, after=6999)
cardNumber=data4.ccnumber.map(float)
expiryDate=data4.expirydate.map(str)
securityCode=data4.security

for i in range(len(securityCode)):    
    if(securityCode[i]<100):
        securityCode[i]=330
    
columns2 = ['username','cardNumber', 'expiryDate', 'securityCode']
tuples2=list(zip(username, cardNumber, expiryDate, securityCode))
df2=pd.DataFrame(tuples2,columns=columns2)

print(df2)


#customer address 
cities=data4.city.truncate(before=0, after=2999)
cities2=data4.city.truncate(before=0, after=999)
city=cities.append(cities).append(cities2)

street=data4.streetnum.map(str)+" "+data4.streetname
postal=data4.postal


columns3 = ['username','street', 'city', 'postal']
tuples3=list(zip(username, street, city, postal))
df3=pd.DataFrame(tuples3,columns=columns3)

print(df3)


engine = sqlalchemy.create_engine('mysql+pymysql://root:basketball126@localhost:3306/arenaSystem')

df1.to_sql(
    name='Customer', # database table name
    con=engine,
    if_exists='append',
    index=False
)
df2=df2.reset_index(drop=True)
df2.to_sql(
    name='PaymentInfo', # database table name
    con=engine,
    if_exists='append',
    index=False
)


df3.to_sql(
    name='CustomerAddress', # database table name
    con=engine,
    if_exists='append',
    index=False
)