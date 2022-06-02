const Pool = require('pg').Pool;
const dotenv = require('dotenv');
dotenv.config();



const devSettings = {
    user:process.env.DBUSERNAME,
    password:process.env.DBPASSWORD,
    host:process.env.DBHOST,
    port:process.env.DBPORT,
    database:process.env.DBNAME
}


const proConfig = {
    connectionString:process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
      }
}

const pool = new Pool (proConfig);


module.exports = pool;