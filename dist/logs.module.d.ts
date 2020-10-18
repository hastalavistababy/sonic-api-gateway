import { Request } from 'express';
export declare const RequestLog: (req: Request) => Promise<void>;
export declare const BadResponseLog: (req: Request, data: {
    target: string;
    content: {};
}) => Promise<void>;
