import { DataTypes } from "sequelize";
import { MysqlInstance, 数据库连接_wenya, 数据库连接接口 } from "../库/Mysql";

export async function 标签模型(
    dbname = '',
) {
    const sequelize = await MysqlInstance.getInstance(数据库连接_wenya, dbname);
    const TagModel = sequelize.define(
        'Post',
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            name_en: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            slug: {
                type: DataTypes.BIGINT,
            },
            zhihu_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            quora_id: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            from: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            createdAt: {
                type: DataTypes.DATE,
                field: 'created_at',
            },
            fetchedAt: {
                type: DataTypes.DATE,
                field: 'fetched_at',
            },
            updatedAt: {
                type: DataTypes.DATE,
                field: 'updated_at',
            },
            deletedAt: 'deleted_at',
        },
        {
            modelName: 'Tag',
            tableName: `keywords`,
            underscored: true,
            paranoid: true, //软删除
        },
    );

    return TagModel;
}