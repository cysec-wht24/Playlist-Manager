# Playlist-Manager

![alt text](<Structure.png>)

## Command History 

```bash
npm i axios bcryptjs jsonwebtoken nodemailer react-hot-toast mongoose
```

No need to add express in Nextjs (has built-in express alternatives), would be using jwt and nodemailer services as well as mongoose for the ORM to communicate with db, react-hot-toast for popup notification stuff. 

you also need to set up your .env file 
MONGO_URI=
SECRET_TOKEN=nextjsyoutube
DOMAIN=http://localhost:3000

connect ssh with github
ssh -T git@github.com
git remote set-url origin git@github.com:cysec-wht24/Playlist-Manager.git
git remote -v : To verify change

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

Error faced and their solution:

So I tried using the accertinity UI library but I am unable to use due to a runtime error errorMissingDefaultExport
next/dist/src/server/app-render/create-component-tree.tsx (59:9)
createComponentTreeInternal
next/dist/src/server/app-render/create-component-tree.tsx (352:7)
async
next/dist/src/server/app-render/create-component-tree.tsx (500:28)
async createComponentTreeInternal
next/dist/src/server/app-render/create-component-tree.tsx (426:28)
async
next/dist/src/server/app-render/create-component-tree.tsx (500:28)
async createComponentTreeInternal
next/dist/src/server/app-render/create-component-tree.tsx (426:28)
async getRSCPayload
next/dist/src/server/app-render/app-render.tsx (834:20)
async renderToStream
next/dist/src/server/app-render/app-render.tsx (1855:26)
async renderToHTMLOrFlightImpl
next/dist/src/server/app-render/app-render.tsx (1554:20)
async doRender
node_modules/next/src/server/base-server.ts (2777:22)
async DevServer.renderToResponseWithComponentsImpl
node_modules/next/src/server/base-server.ts (3145:24)
async DevServer.renderPageComponent
node_modules/next/src/server/base-server.ts (3730:16)
async DevServer.renderToResponseImpl
node_modules/next/src/server/base-server.ts (3792:24)
async DevServer.pipeImpl
node_modules/next/src/server/base-server.ts (1770:21)
async NextNodeServer.handleCatchallRenderRequest
node_modules/next/src/server/next-server.ts (1085:7)
async DevServer.handleRequestImpl
node_modules/next/src/server/base-server.ts (1522:9)
async
node_modules/next/src/server/dev/next-dev-server.ts (512:14)
async Span.traceAsyncFn
node_modules/next/src/trace/trace.ts (143:14)
async DevServer.handleRequest
node_modules/next/src/server/dev/next-dev-server.ts (510:20)
async invokeRender
node_modules/next/src/server/lib/router-server.ts (292:11)
async handleRequest
node_modules/next/src/server/lib/router-server.ts (541:16)
async requestHandlerImpl
node_modules/next/src/server/lib/router-server.ts (587:7)
async Server.requestListener
node_modules/next/src/server/lib/start-server.ts (154:7) like I made a signup folder inside the src directory under which there is a page .tsx file I also setted the lib folder with utils.tsx and other dependencies still I am getting some sort of error 

 Solution: 
Verify Your Page Component
In Next.js, every page file (e.g., src/signup/page.tsx or src/app/signup/page.tsx if you’re using the new app directory) must have a default export. For example:

// src/app/signup/page.tsx or src/signup/page.tsx
import React from 'react';

export default function Signup() {
  return <div>Sign up here!</div>;
}
Make sure your file isn’t just using named exports. If you’re using something like:

export function Signup() { ... }
change it to a default export. 

Moral: You didn't add default in export default function SignupFormDemo() { } in the page.tsx of signup
__________________________________________________________________________________________________________

The idea behind using controlled components—adding `value` and `onChange` to your `<Input>` elements and managing their state with the `useState` hook—is to keep React in full control of your form data. Here’s why this approach is beneficial:

### Single Source of Truth
- **Consistency:** The state stored in your component is the single source of truth for the form inputs. This means at any point, you have an up-to-date reflection of what the user has entered.
- **Predictability:** Because all changes go through React's state, it's easier to track and manage how data changes over time.

### Real-Time Validation and Feedback
- **Instant Validation:** With the input values stored in state, you can validate them on-the-fly as the user types. For example, you might want to check if an email is correctly formatted before enabling the submit button.
- **User Feedback:** You can provide immediate visual feedback (like error messages or formatting hints) based on the current state of the inputs.

### Separation of Concerns
- **Input Handling vs. Form Submission:** The `onChange` handlers update the state as the user types, while the `onSubmit` or `onSignUp` async function handles the submission logic. This separation means that your async operation only runs when the user decides to submit the form, and it can reliably use the already-managed state values.
- **Easier Debugging:** With the state always reflecting the input fields, debugging becomes simpler—you can inspect the state to see exactly what the user has input at any moment.

### How It Works with Async Submission
- **Before Submission:** As the user fills out the form, each keystroke updates the component's state via the `onChange` handler. This ensures that when the form is submitted, the state holds the current values.
- **On Submission:** When the user presses the sign-up button, the `handleSubmit` (or `onSignUp`) function is called. This async function can then use the current state values to, for instance, send an API request. There’s no need to query the DOM for input values—the state already contains everything you need.

Here’s a simple code example to illustrate the concept:

```jsx
import React, { useState } from 'react';

function SignUpForm() {
  // Controlled input state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Async function for form submission
  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      // Use the current state values in your async API call
      const response = await fetchData({ username, password });
      // Handle the API response
      console.log(response);
    } catch (error) {
      // Handle any errors during the async operation
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSignUp}>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button type="submit">Sign Up</button>
    </form>
  );
}
```

In this example:
- **Controlled Components:** The `<input>` elements are controlled by React state.
- **Async Submission:** The `handleSignUp` function is async and uses the current state values when the form is submitted.

### Summary
Using controlled components with `useState` ensures that your form data is immediately accessible, easy to validate, and seamlessly integrated into your async submission process. This pattern improves the reliability and maintainability of your code by separating input handling from data submission logic.
______________________________________________________________________________________________________

Situation:
I was using react dom in framer motion and had used it everywhere when I installed react dom something package for navigation then I uninstalled it it completely uninstalled the package due to wich framer motion accertinity library started giving error so now when I ran this commandrm -rf node_modules and npm install it gave me huge number of errors but then after deleting the project and recloning it from github then instaling autoprefixer and tailwindcss then running this
 rm -rf node_modules/.cache
npm run dev it somehow ran without error

Reflection:
It sounds like the issue was caused by some dependency conflicts and cache inconsistencies. When you uninstalled that navigation-related React DOM package, it probably removed a dependency that Framer Motion (or one of its internals, like the accertinity library) was expecting to be present. This led to a cascade of errors when you reinstalled your modules.

By deleting the project and recloning it from GitHub, you essentially reset your local environment. Then, reinstalling the necessary packages (autoprefixer, tailwindcss, etc.) and clearing the cache with rm -rf node_modules/.cache forced a completely clean install. This removed any leftover or conflicting cache entries and ensured that all dependencies were installed with the correct versions.

In short, your steps:

-> Re-cloning the project helped remove any corrupt or misconfigured local files.

-> Reinstalling dependencies ensured that you had a consistent set of modules.

-> Clearing the cache forced the build system to reprocess all assets from scratch.

These actions resolved the issues caused by the previous dependency removal and any stale cache data. If you run into similar issues in the future, doing a clean reinstall (or even deleting and recloning if necessary) is often an effective solution.

Moral: Calm down before running any command think before the consequences especially if it invloves deleting or reinstalling something
________________________________________________________________________________________________________

Note: 
1) We'll also get the error dot message in the logs. Now this log message will be available to you on the
user side in the browser because it's a use client. All the console log messages in the API
will be available in the bottom section, the terminal, because it's on the server side.

2) Now, once everything is verified that your user exists, your password is correct, then
we actually create a token. This token is created by simply JSON web token. We encrypt that.
Obviously it's not just a plain token. And we send this token into users cookies, not in the 
user local storage because he can manipulate the token there. But we can send the secure 
cookie to the user. And then later on whenever we wish, we can access those cookies as well. 
So it helps as a bridger to verify whenever the user we want to verify, it just has the id of the
user, but it can have a lot of payload into that. You can send a user id, email, admin, type, 
whatever you wish. You can send all this data as a payload to that.
_______________________________________________________________________________________________________

Question 
1) What is this __next_hmr_refresh_hash__ what is this thing 4df371a36076ac33e9e387abd8fa88c2633457081244afec why is it coming along side my jwt token ?