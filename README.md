# UDAAN_INTERNSHIP_ROUND2 IIT BHU
#Created By ~Akshay Malhotra



## Setup Instructions 

- Please download this folder
- Open your terminal and select your working directory to this folder
- You may need to install packkages using the below commands:
-  Install packages with `npm install` 
- Run the backend server `node index.js`
- Now you can make the api calls on the below written routes and the url `localhost:3000` using Postman or anything else


## API GUIDE 

- `/book?name=somename&type=yoga` is a POST route for booking a slot in a class with a user name and a type of class  , it takes two query parameters `name` and `type` and returns an appropriate result 
- `/cancel?name=somename&type=yoga` is a POST route for cancelling a slot in a class with a user name and a type  , it takes two query parameters `name` and `type` and returns an appropriate result 

## Notes 

- The classes and their respective timing have been intialized to some arbitrary values they can be changed and checked as needed
