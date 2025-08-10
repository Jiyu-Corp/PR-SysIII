// import path from "path";

// const { spawn } = require('child_process');

// export default function startNest() {
//     const nestProcess = spawn('npm', ['run', 'start'], {
//         cwd: path.join(__dirname, '..', '..', '..', 'backend'),
//         shell: 'C:\\Windows\\System32\\cmd.exe',
//         stdio: 'inherit',
//     });

//     nestProcess.on('close', (code) => {
//         console.log(`NestJS process exited with code ${code}`);
//     });

//     return nestProcess;
// }

import path from "path";
import { spawn } from "child_process";

export default function startNest() {
    // On Windows, "start" in cmd opens a new console window
    const nestProcess = spawn(
        'cmd.exe',
        ['/c', 'start', 'cmd.exe', '/k', 'npm run start'],
        {
            cwd: path.join(__dirname, '..', '..', '..', 'backend'),
            stdio: 'ignore',   // We let the new console handle its own output
            detached: true
        }
    );

    // nestProcess.unref(); // Allow parent process to exit without killing this one

    return nestProcess;
}
