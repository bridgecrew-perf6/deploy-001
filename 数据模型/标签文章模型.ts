import { DataTypes } from "sequelize";
import { MysqlInstance, 数据库连接_wenya, 数据库连接接口 } from "../库/Mysql";

export async function 标签文章模型(
    dbname = '',
) {
    const sequelize = await MysqlInstance.getInstance(数据库连接_wenya, dbname);
    const TagPostModel = sequelize.define(
        'TagPost',
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            keyword_slug: {
                type: DataTypes.BIGINT,
                allowNull: false,
            },
            post_slug: {
                type: DataTypes.BIGINT,
                allowNull: false,
            },
            createdAt: {
                type: DataTypes.DATE,
                field: 'created_at',
            },
            updatedAt: {
                type: DataTypes.DATE,
                field: 'updated_at',
            },
            deletedAt: 'deleted_at',

        },
        {
            modelName: 'TagPostModel',
            tableName: `keyword-posts`,
            underscored: true,
            paranoid: true, //软删除
        },
    );

    return TagPostModel;
}