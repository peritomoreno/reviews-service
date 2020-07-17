# reviews-service <br>

### Project Overview

The Reviews service is a back-end system supporting an existing client-facing retail web-portal. It is created in Nodejs and is made up of two EC2 instances. The first contains an Express server equipped with Redis-based caching to handle periods of high customer traffic. The second instance contains a Mongo Database with over 1 million reviews and metadata for over 10,000 distinct products.

This is accomplished using mainly the following tools:

- [Axios](https://github.com/axios/axios) <br/>
- [Bluebird](http://bluebirdjs.com/docs/getting-started.html) <br/>
- [Express](https://expressjs.com/) <br/>
- [Jest](https://jestjs.io/) <br/>
- [Mongoose](https://mongoosejs.com/) <br/>
- [Redis](https://redis.io/) <br/>
- [tidyR](https://tidyr.tidyverse.org/) <br/>
