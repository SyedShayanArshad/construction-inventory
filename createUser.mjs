import bcrypt from 'bcryptjs';

const plainPassword = 'enter the Password here'; // <-- Change manually

const hashed = await bcrypt.hash(plainPassword, 10);
console.log('🔑 Hashed password:', hashed);
 //INSERT INTO User (username, email, password) VALUES ('username', 'emaail', '<paste-hashed-password-here>');
