import { DataTypes } from "sequelize";
import { MysqlInstance, 数据库连接接口 } from "../库/Mysql";

export async function 文章模型(
    tbNumber: string | number,
    数据库连接?: 数据库连接接口,
    dbname = '',
) {
    const sequelize = await MysqlInstance.getInstance(数据库连接, dbname);
    const PostModel = sequelize.define(
        'Post',
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            title_zh: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            title_en: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            title_ja: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            title_ru: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            title_es: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            title_ko: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            title_ar: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            title_id: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            title_fr: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            title_pt: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            title_tr: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            title_vi: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            title_de: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            title_fa: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            title_th: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            title_it: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            has_zh: {
                type: DataTypes.BOOLEAN,
                allowNull: true,
            },
            has_en: {
                type: DataTypes.BOOLEAN,
                allowNull: true,
            },
            has_ja: {
                type: DataTypes.BOOLEAN,
                allowNull: true,
            },
            has_ru: {
                type: DataTypes.BOOLEAN,
                allowNull: true,
            },
            has_es: {
                type: DataTypes.BOOLEAN,
                allowNull: true,
            },
            has_ko: {
                type: DataTypes.BOOLEAN,
                allowNull: true,
            },
            has_ar: {
                type: DataTypes.BOOLEAN,
                allowNull: true,
            },
            has_id: {
                type: DataTypes.BOOLEAN,
                allowNull: true,
            },
            has_fr: {
                type: DataTypes.BOOLEAN,
                allowNull: true,
            },
            has_pt: {
                type: DataTypes.BOOLEAN,
                allowNull: true,
            },
            has_tr: {
                type: DataTypes.BOOLEAN,
                allowNull: true,
            },
            has_vi: {
                type: DataTypes.BOOLEAN,
                allowNull: true,
            },
            has_de: {
                type: DataTypes.BOOLEAN,
                allowNull: true,
            },
            has_fa: {
                type: DataTypes.BOOLEAN,
                allowNull: true,
            },
            has_th: {
                type: DataTypes.BOOLEAN,
                allowNull: true,
            },
            has_it: {
                type: DataTypes.BOOLEAN,
                allowNull: true,
            },
            slug: {
                type: DataTypes.BIGINT,
            },
            site_id: {
                type: DataTypes.INTEGER,
            },
            source: {
                type: DataTypes.STRING,
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
            modelName: 'Post',
            tableName: `post-${tbNumber}`,
            underscored: true,
            paranoid: true, //软删除
        },
    );

    return PostModel;
}