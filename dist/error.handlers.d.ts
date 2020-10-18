import { Errors } from './interfaces/error.interface';
import { Response } from 'express';
export declare class ErrorResponse {
    private response;
    private error;
    constructor(error: Errors, res?: Response);
    endResponse(): void;
    killServer(): void;
}
