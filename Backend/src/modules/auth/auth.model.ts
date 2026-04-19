// auth.model.ts — decide what this file is for
//
// right now auth uses User model directly (from ../user/user.model.ts)
// so this file has no purpose yet
//
// options:
//   1. delete it — auth doesn't need its own model if User handles everything
//   2. use it for refresh tokens — store { userId, token, expiresAt, revoked }
//      this would fix the "logout doesn't invalidate token" problem
//      (see todo.md phase 8)
//   3. use it for sessions / token blacklist
//
// if going with refresh tokens, schema would look like:
//   RefreshTokenSchema {
//     userId: ObjectId (ref User, required),
//     token: String (required, unique),
//     expiresAt: Date (required),
//     revoked: Boolean (default false),
//   }
//
// references:
//   - auth.service.ts → currently generates JWT with 1h expiry, no refresh
//   - auth.controller.ts → logout just returns success, doesnt invalidate anything
//   - user.model.ts → the actual user schema lives here

