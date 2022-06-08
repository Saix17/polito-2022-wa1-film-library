# BigLab 2

## Team name: TEAM_NAME

Team members:
* s301270 Gangemi Lorenzo
* s292130 Brescia Alessio 
* s306021 Cosola Davide
* s300269 Ammirati Marco

## Instructions

A general description of the BigLab 2 is avaible in the `course-materials` repository, [under _labs_](https://polito-wa1-aw1-2022.github.io/materials/labs/BigLab2/BigLab2.pdf). In the same repository, you can find the [instructions for GitHub Classroom](https://polito-wa1-aw1-2022.github.io/materials/labs/GH-Classroom-BigLab-Instructions.pdf), covering BigLabs and exam sessions.

Once you cloned this repository, please write the group name and names of the members of the group in the above section.

In the `client` directory, do **NOT** create a new folder for the project, i.e., `client` should directly contain the `public` and `src` folders and the `package.json` files coming from BigLab1.

When committing on this repository, please, do **NOT** commit the `node_modules` directory, so that it is not pushed to GitHub.
This should be already automatically excluded from the `.gitignore` file, but double-check.

When another member of the team pulls the updated project from the repository, remember to run `npm install` in the project directory to recreate all the Node.js dependencies locally, in the `node_modules` folder.
Remember that `npm install` should be executed inside the `client` and `server` folders (not in the `BigLab2` root directory).

Finally, remember to add the `final` tag for the final submission, otherwise it will not be graded.

## Registered Users

Here you can find a list of the users already registered inside the provided database. This information will be used during the fourth week, when you will have to deal with authentication.
If you decide to add additional users, please remember to add them to this table (with **plain-text password**)!

| email | password | name |
|-------|----------|------|
| john.doe@polito.it | password | John |
| mario.rossi@polito.it | password | Mario |

## List of APIs offered by the server

Provide a short description for API with the required parameters, follow the proposed structure.

* [HTTP Method] [URL, with any parameter]
* [One-line about what this API is doing]
* [Sample request, with body (if any)]
* [Sample response, with body (if any)]
* [Error responses, if any]

GET /api/v1/films

retrieve the details of the all single film

Request body: empty

Response body: array of Film objects, in JSON

Error: 500 Interal server error

###

GET /api/v1/films/favorites

retrieve the details of the only favorites films

Request body: empty

Response body: array of Film objects in which favorite is true, in JSON

Error: 500 Interal server error

###

GET /api/films/lastmonth

retrieve the details of the film watched last mounth

Request body: empty

Response body: array of Film objects in which isSeenLastMonth is true, in JSON

Error: 500 Interal server error

###

GET /api/films/bestrated

retrieve the details of the film which are best rated

Request body: empty

Response body: array of Film objects in which rating is equal to 5, in JSON

Error: 500 Interal server error

###

GET /api/films/unseen

retrieve the details of the film which are not seen yet

Request body: empty

Response body: array of Film objects in which unseen is true, in JSON

Error: 500 Interal server error

###

GET /api/films/:id

retrieve the details of a single film, given its id

Request body: empty

Response body: array of Film objects, in JSON

Error: 500 Interal server error

###

POST /api/films

add a completely new film (new unique id)

Request body: JSON of a new film

Response body: none (error code, if an error occurs)

Error: 400 Not found

###

PUT /api/films

update an existing film, by providing information

Request body: JSON of film object

Response body: none (error code, if an error occurs)

Error: 400 Not found

###

PUT /api/films/:id

update the favorite property of a film, given the id

Request body: JSON of film object

Response body:none (error code, if an error occurs)

Error: 400 Not found

###

DELETE /api/films/:id

delete information about one specific exam, given the id

Request body: empty

Response body: empty (error code, if an error occurs)

Error: 400 Not found







