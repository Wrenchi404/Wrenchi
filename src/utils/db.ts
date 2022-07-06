import MySQL, { Connection } from "mysql2"

const connectMysql = async (): Promise<Connection> => {
    const connection = MySQL.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'wrench',
        database: 'wrenchits'
    });

    connection.connect((err) => {
        if (err) console.error(err);
        console.log("Connected to MySQL")
    });

    return connection
}

export default connectMysql