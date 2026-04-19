// response.ts — shared response helpers
//
// every controller manually builds { success: true, data, message }
// this gets repetitive and easy to mess up
//
// what to build:
//   sendSuccess(res, data, message?, statusCode?)  — wraps the happy path
//   sendError(res, message, statusCode?)            — wraps error responses
//   sendPaginated(res, data, total, page, limit)    — for lists with pagination
//
// example usage in a controller:
//   instead of: res.status(201).json({ success: true, message: 'Created', data: result })
//   just do:    sendSuccess(res, result, 'Created', 201)
//
// references — controllers that would use this:
//   - auth.controller.ts → register (201), login (200), logout (200)
//   - user.controller.ts → getMe (200), updateMe (200)
//   - notification.controller.ts → getAll, getUnreadCount, markAsRead, etc
//   - future: friend.controller.ts, transaction.controller.ts
//
// hint: look at how AppError.ts standardized error creation,
//       this does the same but for success responses

class Response {
    static sendSuccess(res: any, data: any = null, message: string = "Success", statusCode: number = 200) {
        res.status(statusCode).json({ success: true, message, data });
    }

    static sendError(res: any, message: string = "Error", statusCode: number = 500) {
        res.status(statusCode).json({ success: false, message });
    }

    static sendPaginated(res: any, data: any[], total: number, page: number, limit: number) {
        res.json({
            success: true,
            data,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        });
    }
}