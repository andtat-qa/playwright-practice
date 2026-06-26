export default function saveUserData(userData: { userName: string; userEmail: string; userPassword: string }, filePath: string) {
    const fs = require('fs');
    const path = require('path');
    const dir = path.dirname(filePath);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify(userData));
}