import bcrypt from 'bcrypt'

export async function hashPassword(password) {
    try {
        const saltround = 10;
        const hashPassword = await bcrypt.hash(password, saltround);
        return hashPassword;
    }
    catch (err) {
        console.log(err);
    }
}

export async function comparePassword(password, hashPassword){
    let chk = await bcrypt.compare(password, hashPassword);
    return chk;
}