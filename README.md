# DKTUBE

[![license mit](https://img.shields.io/badge/licence-MIT-6C47FF)](LICENSE)

A project based on Youtube.

## Technologies used

- [Next.Js](https://nextjs.org/)
- [TailwindCSS](https://tailwindcss.com/)
- [Clerk](https://clerk.com/)
- [TanStack Query](https://tanstack.com/query/v3/)
- [react-player](https://github.com/CookPete/react-player)

## Install and run the project

### Global Dependencies

You need to have a main dependency installed:

- [Node.js](https://nodejs.dev/) LTS v18 (or any higher version)

Do you use `nvm`? Then you can run `nvm install` in the project folder to install and use the most appropriate version of Node.js.

### Get the repository

```bash
git clone https://github.com/ncontiero/dk-tube.git
```

### Local Dependencies

So after getting the repository, don't forget to install the project's local dependencies:

```bash
npm install
```

### Environment variables

Create a `.env` file similar to [`.env.example`](./.env.example).

Change [Clerk](https://dashboard.clerk.com/) variables according to your project.

```env
# ...

# Clerk Keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="YOUR_CLERK_PUBLISHABLE_KEY"
CLERK_SECRET_KEY="YOUR_CLERK_SECRET_KEY"
# Only PROD
CLERK_WEBHOOK_SIGNING_SECRET="YOUR_CLERK_WEBHOOK_SIGNING_SECRET"

# Clerk Routes
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL="/"
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL="/"

# ...
```

### Run the project

To run the project locally, just run the command below:

```bash
npm run dev
```

- go to <http://localhost:3000> to see the application.
