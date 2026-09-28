

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