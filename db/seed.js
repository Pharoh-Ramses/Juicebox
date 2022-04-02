//grab our client with destructuring from the export in index.js
const { client, getAllUsers, createUser, updateUser } = require('./index');

async function createInitialUsers() {
    try {
        console.log("Starting to create users...")
        const albert = await createUser({
            username: 'albert', 
            password: 'bertie99',
            name: "Albert",
            location: "Moreno Valley, CA"
        })
        const sandra = await createUser({
            username: 'sandra',
            password: 'sandapassword',
            name: "Sandra",
            location: "Little Rock, AR"
        });
        const glamgal = await createUser({
            username: 'glamgal',
            password: 'glampassword',
            name: "Georgina",
            location: "Tuscon, AZ"
        });
        console.log(albert);
        console.log(sandra);
        console.log(glamgal);
        console.log("Finished creating users!");
    } catch (error) {
        console.error("Error creating users!")
        throw error;
    }
}

async function dropTables() {
    try {
        console.log("Starting to drop tables")
        await client.query('DROP TABLE IF EXISTS users;');
        console.log("Finished dropping tables")
    } catch (error) {
        console.error("Error dropping tables!");
    }
}
async function createTables() {
    try {
        console.log("Starting to build tables...")
        await client.query(`
        CREATE TABLE users( 
            id SERIAL PRIMARY KEY,            
            username varchar(255) UNIQUE NOT NULL, 
            password varchar(255) NOT NULL,
            name VARCHAR(255) NOT NULL,
            location VARCHAR(255) NOT NULL,
            active BOOLEAN DEFAULT true);
                    
            `);
        
        console.log("Finished building tables!")
    } catch (error) {
        console.error("Error building tables!");
    }
}

async function rebuildDB() {
    try {
        client.connect();

        await dropTables();
        await createTables();
        await createInitialUsers();

    } catch (error) {
        console.error(error);
    }
}
async function testDB() {
    try {

        console.log("Starting to test database...");

        console.log("Calling getAllUsers")
        const users = await getAllUsers();
        console.log("getAllUsers:", users)

        console.log("Calling updateUser on users[0]")
        const updateUserResult = await updateUser(users[0].id, {
            name: "Newname Sogood",
            location: "Lesterville, KY"
        });
        console.log("Result:", updateUserResult);

        console.log("Finished database tests!");
    } catch (error) {
        console.error("Error testing database!")
        throw error;
    }
}


rebuildDB()
    .then(testDB)
    .catch(console.error)
    .finally(()=> client.end());