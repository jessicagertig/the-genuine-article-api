# Project Notes/Journal #

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