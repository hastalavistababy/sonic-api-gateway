export interface Errors {
    message: string
    target?: string
    endpoint?: string
    reason?: any
    isExeptionError?: boolean,
    status?: any
}