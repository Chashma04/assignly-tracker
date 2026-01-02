# Assignly — Homework Tracker

Assignly helps teachers post homework and students track and complete tasks — great for absent learners and everyday study routines. It is a simple, responsive UI built with Create React App.

## Features

- Role-based views: Teacher and Student
- Teacher: post homework (class, subject, description, due date)
- Student: view tasks, mark as completed, add notes
- Status badges and clean, mobile-first design
- LocalStorage persistence (data remains across reloads)
- Dark mode toggle
- Optional AI: Gemini-powered homework explanations

## Available Scripts

In the project directory, you can run:

### `pnpm start`

Runs the app in the development mode.\
Open [http://localhost:4000](http://localhost:4000) to view it in the browser.

On first load, sign in:

- Teacher: enter your name, select Teacher, and PIN (default 1234) to continue.
- Student: enter your name, select Student, continue.

Teacher dashboard lets you create homework; student dashboard shows tasks to complete and add notes.

Data is saved to LocalStorage automatically.

## AI: Gemini Homework Explanations

This app can optionally provide student-friendly explanations using Google Gemini.

### Setup

1. Get an API key from Google AI Studio.
2. Create `.env.local` at the project root and add:

   REACT_APP_GEMINI_API_KEY=your_api_key_here

3. If needed, install the SDK:

   pnpm add @google/generative-ai

### Usage

- In the Student dashboard, click "Explain Homework (AI)" on a card.
- The app calls `gemini-1.5-flash` and displays an explanation.

### Notes

- For production, proxy requests through a server to avoid exposing API keys in the client.
- If the key is missing, an error message is shown instead of the explanation.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `pnpm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

## Environment Variables

- `REACT_APP_TEACHER_PIN`: PIN for teacher login (default 1234 if unset)
- `REACT_APP_ADMIN_PIN`: PIN for Admin Panel (default 9999 if unset)
- `REACT_APP_GEMINI_API_KEY`: Google Gemini API key (optional for AI explanations)

Create an env file and restart dev server after changes:

```bash
cp .env.example .env
# edit .env and set your values
```

CRA will load `.env`, `.env.local`, etc. See Create React App docs for details.
