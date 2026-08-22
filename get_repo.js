const fs = require('fs');

const authPath = 'C:\\Users\\KD\\AppData\\Roaming\\xdg.data\\com.vercel.cli\\auth.json';
const auth = JSON.parse(fs.readFileSync(authPath, 'utf8'));

fetch('https://api.vercel.com/v9/projects/prj_9ibyz0849Xh9IMnqhulZhcQGNCYs', {
  headers: {
    Authorization: `Bearer ${auth.token}`
  }
})
.then(r => r.json())
.then(data => console.log(JSON.stringify(data, null, 2)))
.catch(e => console.error(e));
