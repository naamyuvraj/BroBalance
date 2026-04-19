// user.types.ts — types for user endpoints
//
// update payload (what PUT /me accepts):
//   UpdateUserBody {
//     username?: string
//     email?: string
//     mobileNumber?: string
//     instagramHandle?: string
//     avatarUrl?: string
//   }
//   hint: user.controller updateMe currently has NO validation
//   at minimum check that email is valid format if provided
//   and that username isn't empty string
//
// search (needed for adding friends):
//   the frontend calls GET /api/user/search?q=
//   but this endpoint DOES NOT EXIST yet
//   add to user.route.ts: GET /search with query param q
//   SearchUserResult {
//     _id: string
//     username: string
//     email: string
//     avatarUrl?: string
//   }
//   hint: search by username OR email, case-insensitive regex
//   DONT return the currently logged in user in results
//   DONT return users who are already friends
//
// profile response (what GET /me returns):
//   UserProfile = IUser minus password
//   this already works thanks to toJSON transform in user.model.ts
//
// references:
//   - user.model.ts → IUser interface with all fields
//   - user.service.ts → getMe and updateMe methods
//   - user.controller.ts → where these types would be used
//   - user.route.ts → needs the search endpoint added
//   - friends.tsx (frontend) → calls /api/user/search?q=

export interface UpdateUserBody {
    username?: string;
    email?: string;
    mobileNumber?: string;
    instagramHandle?: string;
    avatarUrl?: string;
}

export interface SearchUserResult {
    _id: string;
    username: string;
    email: string;
    avatarUrl?: string;
} 