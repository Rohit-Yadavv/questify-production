import bcrypt from 'bcryptjs';

// Hash the password using bcrypt
export const hashPassword = async (password) => {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
};

// Compare the provided password with the hashed password using bcrypt
export const comparePassword = async (password, hashedPassword) => {
    return bcrypt.compare(password, hashedPassword);
};
