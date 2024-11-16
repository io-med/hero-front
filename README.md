# Hero frontend

## Setup

Make sure to setup backend server at first. Follow the [link](https://github.com/io-med/hero-back) to repo.

1. run `npm i`
2. default `API_URL` is stored in `.env`
3. run `npm run dev` to start local server

## Description

Technologies:

- Typescript
- SCSS

Application mainly consists of this components:

- Homepage (stores all HeroData)
  - List (with pagination 5 cards per page as in the task)
    - Card (hero card with main image and name)
  - Modal (detailed view with all data and images)
    - Details (hero details and all pictures)
    - Form (used for managing all CRUD operations)
  - Add button (used to open Modal in creation mode)

For ease of use some images where added to app and can be used by pressing `random image` button.
To switch hero images open it's modal and look for arrows on sides (they are hidden if hero has only one image).

Although `router` is added to application, currently all elements are on the homepage.

Styling and some other aspects may feel inconsistent and archaic due to 'designing by creating', further refactoring and bug fixing are on the way.

Please, consider using Chrome browser, as the app wasn't tested on Safari and Firefox at the moment.
