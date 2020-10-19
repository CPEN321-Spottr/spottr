This folder contains the API definitions for the project. The Retrofit package is used to build out the
actual API services, so all files in this folder should be defined such that they can be used by
Retrofit. (Trust me, this is going to make life much easier... xD)

You can find the Retrofit documentation here:
https://square.github.io/retrofit/

The FE defines two separate API instances, one for handling information specific to the exercises
and plans, and one for handling users and their interactions with each other. This definition is
arbitrary and totally agnostic to the back end implementation, so these two APIs may in fact be
served by the same server (and most likely will be)


