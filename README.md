# Apron - Technical assignment

## Submission

### Install

To download and prepare the app

```sh
git clone git@github.com:jazlalli/apron-take-home-task.git
cd apron-take-home-task
npm i
```

### Run

```sh
npm run dev
```

then browse to `http://localhost:5173/`

### Tests

There are a small number of narrow tests around the mocked API which you can run via

```sh
npm run test
```

There are a few happy path end-to-end tests which you can run via

```sh
npm run e2e
```

**N.B.** The end-to-end tests are not completely exhaustive, but they give you an indication of how you could test behaviour, and they (hopefully) demonstrate that I know how to do that.

### Overview & Description

#### Technology

- App - React, TypeScript, Vite, Vitest
- UI - radix-ui (Theme and Icons)
- Mocked backend - msw (with some vitest tests)
- Network requsts - basic/raw fetch
- Form (in `UserFormDialog`) - react-hook-form
- Validation - react-hook-form's built-in validation (i.e. didn't use yup 😬)
- E2E tests - playwright

#### Further details

1. The mock API implementation uses Mock Service Worker. There's some in-memory storage that backs the endpoints, so as to mimic real behaviour. Some tests were written (`handlers.test.ts`) at the same time as this was being developed, to ensure the API was to spec and that the storage mechanism worked as intended.

2. I chose to **not** introduce yup given the time constraints and how much time I'd already spent (I've not used yup before, though I have used zod). For form validation I stuck out of the box approach from react-hook-form. This means that there is some repeated/hand-rolled mapping of user input to `User` entities. Introducing yup would improve this, and could obviously be done incrementally on top of what I've done, but I opted not to given the time.

3. As already mentioned, there are only 3 playwright tests that cover some basic happy path behaviour. Again, I stopped at just those due to time constraints, but hopefully they give you enough of a signal that I know the technology/apprach and can use it to provide value.

4. I put all the client-side networking into an `apiClient.ts` module. It's not a fully featured or robust client, so it's definitely not production grade in anyway. It's there to keep the code separate from where it's used, and create a bit more order in the codebase.

5. commit history is ordinarily something that I pay a fair amount of attention to. It's a valuable and often uptapped source of documentation, it speeds up code review, and it helps with problem solving (thinking about how the changes will be presented upfront). In this case though, I optimised for speed/completeness and so therefore there is nothing to be gained from the commit history on this repo. If that's something you were hoping to see, sorry. If you don't care, then no worries 😅.

## Objective

The objective of this home task is to develop a production-ready web application that provides a
comprehensive UX for CRUD operations over a User entity. This task will evaluate your proficiency
in our technology stack as well as your ability to implement complex web functionalities.

### Task Requirements

You are required to create a simple application and share the results as a GitHub repository,
complete with all necessary instructions on how to build and launch the application.

### Steps of Implementation

#### 1. Mock API

Begin by mocking the API using the `User` entity structure. This mock will serve as the backend for
your application. The API specification you should implement includes:

- [x] List Users (`GET /api/users`) - optional, returns a list of users.
- [x] Add User (`POST /api/users`) - mandatory, adds a new user.
- [x] Edit User (`GET /api/users/:id` and `PATCH /api/users/:id`) - mandatory, retrieves and updates user
      details.
- [x] Delete User (`DELETE /api/users/:id`) - optional, deletes a user.

#### 2. Create React Application

Develop a React application leveraging the mocked APIs. Your application should include the
following functionalities

- [x] List of Users: Display all users with options to edit or delete each one (optional).
- [x] Create User Form: Interface for adding new users (mandatory).
- [x] Edit User Form: Interface for updating existing users (mandatory).
- [x] Delete User Functionality: Option for removing users (optional).

#### 3. Technology Stack

- [x] Frontend: React, TypeScript
- [x] Forms: react-hook-forms
- [ ] yup for form validation 👀
- [x] Testing: Playwright (and vitest)
- [x] Styling: radix-ui (theme and icons)

#### 4. Form Requirements

Each user form should include the following fields:

- [x] Gender Selector: ('MALE', 'FEMALE') - Enum, required
- [x] First Name: String, required, minimum length 5, maximum length 20
- [x] Last Name: String, required, minimum length 5, maximum length 20
- [x] Age: Number, required, minimum age 18, maximum age varies by gender (112 for males, 117 for
      females)

#### 5. Submission

Provide the following in your GitHub repository:

- [x] Complete source code of the application.
- [x] README file with detailed setup and launch instructions.
- [x] Any necessary scripts or configuration files.
