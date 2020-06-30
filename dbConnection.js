const mysql = require('mysql');

const pool = mysql.createPool({
    connectionLimit: 12,
    host: 'localhost',
    user: 'revital1',
    password: '123456',
    database: 'jbh_shop'
    //insecureAuth : true
});



pool.on('connection',(db)=>{
    console.log(`New connection id:${db.threadId}`)
    });

    
pool.on('acquire',(db)=>{
    console.log(`Acquire connection id:${db.threadId}`)
    });
    

    pool.on('enqueue',()=>{
        console.log('waiting for available connection slot');
    });

    
   
   pool.on('release', (db) => {
    console.log('Connection %d released', db.threadId);
  });


 
  module.exports = {pool}