export declare const RequestLog: (req: any) => Promise<void>;
export declare const BadResponseLog: (req: any, data: {
    target: string;
    content: {};
}) => Promise<void>;
