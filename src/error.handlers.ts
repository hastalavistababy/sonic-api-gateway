import { Errors } from './interfaces/error.interface';
import { Response } from 'express';

export class ErrorResponse {
    private response: Response
    private error: any

    constructor(error: Errors, res?: Response) {
        this.response = res
        this.error = error
        if (error.isExeptionError) {
            this.killServer()
        }
        else {
            this.endResponse()
        }
    }

    endResponse() {
        if (!this.response.writableEnded) {
            this.response.status(400).json(this.error)
            this.response.end()
        }
    }

    killServer() {
        console.log(`
            [ERROR] Message : ${this.error.message}
                    Reason  : ${this.error.reason}
                    Error   : ${JSON.stringify(this.error)}
        `.red)
        process.exit()
    }
}