export const Debug = (logText: string) => {
    if (process.env.debug == 'logging') {
        console.log(logText)
    }
}