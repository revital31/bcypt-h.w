const bcrypt= require('bcrypt');
const SaltRounds=10;
const myPassword = 'Revital';
const myHash= '$2b$10$..6X8CiKsGMn4sM3PrbOS.Jc1mMJ/gn9zIhH4DlTrAt/M6hMbdMGK';


bcrypt.genSalt(SaltRounds,(err,salt)=>{
console.log(salt);

bcrypt.hash(myPassword,salt,(err,hash)=>{
console.log(hash);

bcrypt.compare(myPassword,myHash,(err,res)=>{
console.log(res);

});
});
});
