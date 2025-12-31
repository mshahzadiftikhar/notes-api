# notes-api
A note taking backend infrastructure using Express.js.

## Requirements

- Node.js (recommend v16+)
- npm

## Install

Clone the repo and install dependencies:

```bash
git clone https://github.com/mshahzadiftikhar/notes-api.git
cd notes-api
npm install
```

## Environment

Create a `.env` file in the project root to override defaults. Example:

```
PORT=3000
```

## Scripts

- Start (production):

```bash
npm start
# runs: node src/server.js
```

- Development (auto-reload with nodemon):

```bash
npm run dev
# runs: nodemon src/server.js
```

## Dependencies

- express
- dotenv

## Repository

Repository: https://github.com/mshahzadiftikhar/notes-api