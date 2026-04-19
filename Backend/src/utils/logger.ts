// logger.ts — replace console.log/error everywhere with this
//
// currently the whole codebase uses raw console.log which
// makes it impossible to filter logs or add timestamps
//
// what to build:
//   logger.info(message, ...meta)   — general info
//   logger.warn(message, ...meta)   — heads up
//   logger.error(message, ...meta)  — something broke
//   logger.debug(message, ...meta)  — dev only stuff
//
// can use winston or pino, or even just a thin wrapper
// around console with timestamps + colors
//
// places that need this (search for console.log/console.error):
//   - server.ts → "Server is running on port"
//   - config/db.ts → "MongoDB connected" / "connection error"
//   - error.middleware.ts → "Unhandled error:"
//   - passport.ts → "Google profile received"
//   - auth.route.ts → "OAuth error" / "OAuth failed"
//
// hint: start simple, something like:
//   const log = (level: string, msg: string) => 
//     console.log(`[${new Date().toISOString()}] [${level}] ${msg}`);

