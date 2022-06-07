
import { Sequelize, DataTypes } from 'sequelize';

export interface 数据库连接接口 {
    host: string | undefined;
    dbname: string | undefined;
    username: string | undefined;
    password: string | undefined;
}

export const 数据库连接_wenguang: 数据库连接接口 = {
    host: process.env.MYSQL_HOST_WG,
    dbname: process.env.MYSQL_HOST_WG_DBNAME,
    username: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
};
export const 数据库连接_wenya: 数据库连接接口 = {
    host: process.env.MYSQL_HOST_WY,
    dbname: process.env.MYSQL_HOST_WY_DBNAME,
    username: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
};

export class MysqlInstance {
    static connection = new Map();

    static async getInstance(
        数据库连接: 数据库连接接口 = 数据库连接_wenguang,
        dbname = '',
    ) {
        const database = dbname ? dbname : 数据库连接.dbname;
        const key = `${数据库连接.host}_${database}`;
        if (MysqlInstance.connection.has(key)) {
            return MysqlInstance.connection.get(key);
        }

        const sequelize = new Sequelize(
            database,
            数据库连接.username,
            数据库连接.password,
            {
                host: 数据库连接.host,
                dialect: 'mysql',
            },
        );

        try {
            await sequelize.authenticate();
            console.log('Connection has been established successfully.');
        } catch (error) {
            console.error('Unable to connect to the database:', error);
        }

        MysqlInstance.connection.set(key, sequelize);

        return MysqlInstance.connection.get(key);
    }
}