# Max-DeLaRosa_Back-Final-Project-202201-MAD

## Surftrip Backend

This is a full backend created in NestJS. Its puropse is to serve an application that helps surfcamps publish their packages, receive comments and ratings from travelling surfers that are looking for an application that groups many different surfcamps.

There are 3 main Data Models being used which are the following:

-   Users (normal users => surfers)
-   Surfcamps (surfcamp admins)
-   Packages (surfcamp packages)

The database chosen in this project is MongoDB.

The surfcamp model has an array of packageIds, in order to have a ownership over the packages it has created.

This project is fully tested, using jest for unit tests.
