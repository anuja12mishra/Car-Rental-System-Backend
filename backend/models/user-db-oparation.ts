import sql from "../database/neonDB_connection";

// ✅ Check if username exists
export async function checkUserNameExitOrNot(Username: string): Promise<boolean> {
    if (!Username) throw new Error('Username not provided');
    const result = await sql`SELECT 1 FROM users WHERE username = ${Username}`;
    return result.length > 0;
}

// ✅ Get user credentials for login
export async function getUserCredentials(username: string) {
    const result = await sql`
        SELECT id, password FROM users WHERE username = ${username}
    `;
    return result.length > 0 ? result[0] : null;
}

// ✅ Create new user (for SignUp)
export async function createNewUser(Username: string, Password: string): Promise<string> {
    if (!Username || !Password) throw new Error('Both Username and Password are required');
    
    const result = await sql`
        INSERT INTO users(username, password) 
        VALUES (${Username}, ${Password}) 
        RETURNING id
    `;
    
    if (result.length === 0) throw new Error('Failed to create user');
    return result[0].id;
}
