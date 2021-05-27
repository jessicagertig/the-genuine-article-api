# Project Notes/Journal #

**TO DO:**
 - arrange models back to separate anything related to colors to colors folder & anything related to materials to materials folder
 - implement middleware checking to be sure neither the collection_item_url nor collection_item_id is a duplicate
 - ensure all editing methods are appropriate - item info, colors, and materials should be able to be edited separately
 - create delete item method (will need to be transactional)
 - format all existing code to current prettier settings in one commit

## Motivation ##

The initial motivation for this project is a personal interest in history, social history, and in historical clothing.

For a number of reasons the project is currently focused on women's clothing from the 19th century.  Due to the lack of working class clothing preserved as textiles, the collection will by default contain clothing owned by middle to upper class women.

I spent a significant amount of time in the years 2006 and 2007 researching clothing from the middle of the 19th century and the resources available were mostly books containing descriptions, photographs, and a variety of historical imaging.  Another source was the periodicals of the time, such as Godey's Lady's Book, which featured fashion plates of the most current fashions (an American women's magazine).  Of course, were I to travel, I could also have visited exhibitions at museums in order to see examples of clothing in person.

While I did not continue to research in following years, I did start using pinterest and to my delight I found an increasing number of historical images such as Dagurreotyes, Abrotypes, and Tintypes scanned or photographed which I could pin in my free time, I also found images of antique dresses housed in various collections (or as described for auctions) available.  

As I became more serious in my collection of such images, I became frustrated by the number of what I call "orphaned" images on Pinterest. Some examples are images uploaded by users with no information provided, images taken from blog posts, also without information on the source/time period provided, and some images no longer even have pinterest accounts associated with them.  

From this frustration came the idea to create an API where I slowly collected images and their related information, to preserve the context of examples of historical clothing.  

I further expanded my idea by providing not just API endpoints accessible to developers, but also by creating a front end web application to allow searches and display of the collection.

## Current State ##

At this point in the project:

1. Initially, I was only going to design an API, however I liked the aestheic appeal of also designing a frontend application to consume the API.  I have designed the first iteration on Figma.

2. I have created a basic database schema, which does not yet include the images.  I have created migrations and seeds.

3. I have researched media storage solutions and currently plan on using AWS S3.  

4.  I have contemplated any secure/authenticated routes needed and concluded only editing the database should be secured (if I choose to do so on the front end).  If the application grows to include user accounts, I will implement a more robust authentication system, but for the time being a basic login for the adminstrative account is all that is needed.


## Dependencies ##
### **express** ###  
Fast, unopinionated, minimalist web framework for node.
* Robust routing
* Focus on high performance
* Super-high test coverage
* HTTP helpers (redirection, caching, etc)
* View system supporting 14+ template engines
* Content negotiation
* Executable for generating applications quickly
  
### **knex** ###
A batteries-included, multi-dialect (MSSQL, MySQL, PostgreSQL, SQLite3, Oracle (including Oracle Wallet Authentication)) query builder for Node.js, featuring:

* transactions
* connection pooling
* streaming queries
* both a promise and callback API
* a thorough test suite
* the ability to run in the Browser

### **knex-cleaner** ###
Helper library to clean a PostgreSQL, MySQL or SQLite3 database tables using Knex. Great for integration tests.
### **pg** ###
Non-blocking PostgreSQL client for Node.js. Pure JavaScript and optional native libpq bindings.
### **bcryptjs** ###
Optimized bcrypt (middleware for hashing passwords) in JavaScript with zero dependencies. Compatible to the C++ bcrypt binding on node.js and also working in the browser.
### **jsonwebtoken** ###
**An implementation of JSON Web Tokens.**
JSON Web Token (JWT) is a compact, URL-safe means of representing claims to be transferred between two parties.  The claims in a JWT are encoded as a JSON object that is used as the payload of a JSON Web Signature (JWS) structure or as the plaintext of a JSON Web Encryption (JWE) structure, enabling the claims to be digitally signed or integrity protected with a Message Authentication Code (MAC) and/or encrypted.
### **cors** ###
CORS is a node.js package for providing a Connect/Express middleware that can be used to enable CORS with various options.
### **helmet** ###
Helmet helps you secure your Express apps by setting various HTTP headers. It's not a silver bullet, but it can help!
### **dotenv** ###
Dotenv is a zero-dependency module that loads environment variables from a .env file into process.env.

### **morgan** ###
HTTP request logger middleware for node.js

## DevDependencies ##

### **cross-env** ###
Run scripts that set and use environment variables across platforms

### **jest** ###
Delightful JavaScript Testing

👩🏻‍💻 Developer Ready: Complete and ready to set-up JavaScript testing solution. Works out of the box for any React project.

🏃🏽 Instant Feedback: Failed tests run first. Fast interactive mode can switch between running all tests or only test files related to changed files.

📸 Snapshot Testing: Jest can capture snapshots of React trees or other serializable values to simplify UI testing.
### **nodemon** ###
nodemon is a tool that helps develop node.js based applications by automatically restarting the node application when file changes in the directory are detected.

nodemon does not require any additional changes to your code or method of development. nodemon is a replacement wrapper for node. To use nodemon, replace the word node on the command line when executing your script.b
### **supertest** ###
HTTP assertions made easy via superagent.

The motivation with this module is to provide a high-level abstraction for testing HTTP, while still allowing you to drop down to the lower-level API provided by superagent.

