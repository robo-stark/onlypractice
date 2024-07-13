import crypto from 'crypto';

const ENC= 'robo1bf3c199c2470cb4712e0f1stark';
const IV = crypto.randomBytes(16);
const ALGO = "aes-256-cbc"

const encrypt = ((text) => 
{
    try{
        let cipher = crypto.createCipheriv(ALGO, ENC, IV);
        let encrypted = cipher.update(text, 'utf8', 'base64');
        encrypted += cipher.final('base64');
        return encrypted;
	}catch(err) {
        //log error
		return text;
	}
  
});

const decrypt = ((text) => 
{
    try{
        let decipher = crypto.createDecipheriv(ALGO, ENC, IV);
        let decrypted = decipher.update(text, 'base64', 'utf8');
        return (decrypted + decipher.final('utf8'));
	}catch(err) {
        //log error
		throw err;
	}
  
});

export { decrypt, encrypt };

