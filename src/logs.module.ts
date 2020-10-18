import fs from 'fs';
import { Request } from 'express';

export const RequestLog = async (req: Request) => {
    let date = `${new Date().getFullYear()}-${new Date().getMonth()}-${new Date().getDate()}`;
    let dirName = `_logs/request/${date}`;
    let fileName = `${dirName}/${new Date().getHours()}.csv`;

    if (!fs.existsSync('_logs')) fs.mkdirSync('_logs');

    if (!fs.existsSync('_logs/request')) fs.mkdirSync('_logs/request');

    if (!fs.existsSync(dirName)) fs.mkdirSync(dirName);

    if (!fs.existsSync(fileName)) fs.writeFileSync(fileName, 'endpoint,method,date,ip,user_agent\n');

    // ip, endpoint, method, date
    let logData = `${req.hostname}${req.path},${req.method},${Date.now()},${req.ip},${req.headers['user-agent']}\n`;
    fs.appendFile(fileName, logData, {}, () => { })
}

export const BadResponseLog = async (req: Request, data: { target: string, content: {} }) => {
    let date = `${new Date().getFullYear()}-${new Date().getMonth()}-${new Date().getDate()}`
    let dirName = `_logs/backend/${date}`
    let fileName = `${dirName}/${new Date().getHours()}.csv`

    if (!fs.existsSync('_logs/backend')) fs.mkdirSync('_logs/backend')

    if (!fs.existsSync(dirName)) fs.mkdirSync(dirName)

    if (!fs.existsSync(fileName)) fs.writeFileSync(fileName, 'endpoint,target,method,ip,date,err_response\n')

    // ip, endpoint, method, date
    let logData = `${req.url},${data.target},${req.method},${req.ip},${new Date()},${JSON.stringify(data.content)}}\n`
    fs.appendFile(fileName, logData, {}, () => { })
}
