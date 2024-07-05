you have to create 3 new .env following the .env.dist given, and in the same directory of the .env.dist, otherwise the app wont work:

    -.env seed-data:
        only define a password for a new user created in initmongo.js(remember the name)

    -.env server:
        have to define port, seed for the jwt, email and password for the mailer, and the URL to connect with mongo. In local, the one for local, in docker, the one for docker.

    -.env root: DB_URL:
        to connect to mongo, choose username and password only for init,
