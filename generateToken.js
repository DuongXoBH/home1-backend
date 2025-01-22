import crypto from 'crypto';

const randomHex = crypto.randomBytes(20).toString('hex');
console.log(randomHex);
