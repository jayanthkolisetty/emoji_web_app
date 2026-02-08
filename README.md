# EmojiPulse 💓

A real-time emoji status app for close friends. Share how you feel, and get instant suggestions on how to support each other.

![Vibe Check](/public/vibe-check.png)

## Features

- **Auth**: Simple Email/Password sign up.
- **Profile**: Set your unique username and display name.
- **Emoji Status**: Search for emojis or describe your vibe to get suggestions.
- **Friends System**: Generate unique invite links to add friends instantly.
- **1:1 Assist Panel**: Click a friend to see AI-powered suggestions (messages & actions) based on their mood.
- **Real-time**: Friend statuses update automatically every 5 seconds.

## Tech Stack

- **Framework**: Next.js 15+ (App Router)
- **Language**: TypeScript
- **Database**: SQLite (via Prisma ORM)
- **Styling**: Tailwind CSS
- **Auth**: Custom JWT (HttpOnly Cookies)

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Database

Initialize the SQLite database:

```bash
npx prisma db push
```

### 3. Run Locally

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## How to Test with 2 Users (Localhost)

1. Open **Chrome** and go to `localhost:3000`.
   - Sign up as **User A** (e.g., `alice@test.com`).
   - Set your username (e.g., `alice`).
   - Click "Add Friend" or "Invite Friends" to copy your invite link.

2. Open **Incognito Window** (or a different browser like Edge/Firefox).
   - Paste the invite link.
   - You will see "Join Alice's Circle".
   - Click "Create Account" and sign up as **User B** (e.g., `bob@test.com`).
   - Once signed up, click "Accept Invite".

3. **Verify:**
   - Both dashboards should now show each other in the friends grid.
   - Change User A's status to 😢 (Sad).
   - Watch User B's dashboard update (within 5 seconds).
   - Click User A on User B's dashboard to see "Negative Vibe" suggestions.

## License

MIT
