// app.ts — decide: consolidate or delete
//
// right now ALL server setup lives in server.ts at the root:
//   cors, session, passport, json parser, routes, error handler, db connect
//
// this file is empty. two options:
//
// option A (recommended): move express setup here
//   - create the express app here
//   - register middleware (cors, json, session, passport)
//   - register routes
//   - register error handler
//   - export the app
//   - server.ts just does: import app from './src/app.js'; app.listen(PORT)
//   - this is the standard express pattern and makes testing easier
//     (you can import app without starting the server)
//
// option B: delete this file
//   - if server.ts is working fine and you dont need to test the app
//     separately, this file has no purpose
//
// references:
//   - server.ts → current home of all setup (~50 lines)
//   - routes/index.ts → the route registrations

