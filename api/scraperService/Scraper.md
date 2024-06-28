# Scraper Service


This service provides a unified interface for scraping data from various museum websites.

## Supported Sites
-----------------

* Metropolitan Museum of Art (MET)
* Victoria and Albert Museum (VA)
* Cincinnati Art Museum (CAM)
* Philadelphia Museum of Art (PHILA)
* Los Angeles County Museum of Art (LACMA)
* The Museum at FIT (FIT)
* Royal Ontario Museum (ROM)
* Colonial Williamsburg (CW)

## Using the Service
-------------------

To use the service, simply call the `scrape` function with the URL of the page you want to scrape. The service will automatically detect the site and use the corresponding scraper function to extract the data.

## Directory Structure
---------------------

* scraperService/
    + scraper.js (main orchestrator file)
    + Scrapers/
        - METScraper.js
        - VAScraper.js
        - CAMScraper.js
        - PHILAScraper.js
        - LACMAScraper.js
        - FITScraper.js
        - ROMScraper.js
        - CWScraper.js
    + Helpers/
        - urlHelper.js
        - stringHelper.js
        - dateHelper.js

## TODO
----

* Add support for more sites:
    + The British Museum
    + The National Gallery of Art
    + The Smithsonian American Art Museum
    + The Art Institute of Chicago