import {
    assertUnreachable,
    CatalogItemIcon,
    CatalogType,
    type CatalogField,
    type CatalogTable as CatalogTableType,
} from '@lightdash/common';
import { Knex } from 'knex';

export type DbCatalog = {
    catalog_search_uuid: string;
    cached_explore_uuid: string;
    project_uuid: string;
    name: string;
    label: string | null;
    description: string | null;
    type: CatalogType;
    search_vector: string;
    embedding_vector?: string;
    field_type?: string;
    required_attributes: Record<string, string | string[]> | null;
    chart_usage: number | null;
    icon: CatalogItemIcon | null;
    table_name: string;
    spotlight_show: boolean;
};

export type DbCatalogIn = Pick<
    DbCatalog,
    | 'cached_explore_uuid'
    | 'project_uuid'
    | 'name'
    | 'label'
    | 'description'
    | 'type'
    | 'field_type'
    | 'required_attributes'
    | 'chart_usage'
    | 'table_name'
    | 'spotlight_show'
>;
export type DbCatalogRemove = Pick<DbCatalog, 'project_uuid' | 'name'>;
export type DbCatalogUpdate =
    | Pick<DbCatalog, 'embedding_vector'>
    | Pick<DbCatalog, 'chart_usage'>
    | Pick<DbCatalog, 'icon'>
    | Pick<DbCatalog, 'table_name'>;
export type CatalogTable = Knex.CompositeTableType<
    DbCatalog,
    DbCatalogIn,
    DbCatalogUpdate
>;

/**
 * Utility to get a property name from either CatalogField or CatalogTableType to its corresponding
 * database column name in DbCatalog (the `catalog` table).
 *
 * Note: We use 'keyof CatalogField | keyof CatalogTableType' instead of 'keyof CatalogItem'
 * because when TypeScript calculates 'keyof' on a union type (CatalogItem), it only includes
 * the common keys shared between all members of the union. By using the union of 'keyof's,
 * we get all possible properties from both types.
 *
 * @param property - The property name from either CatalogField or CatalogTableType
 * @returns The corresponding column name in DbCatalog
 * @throws Error if the property has no corresponding database column
 */
export function getDbCatalogColumnFromCatalogProperty(
    property: keyof CatalogField | keyof CatalogTableType,
): keyof DbCatalog {
    switch (property) {
        case 'name':
            return 'name';
        case 'label':
            return 'label';
        case 'description':
            return 'description';
        case 'type':
            return 'type';
        case 'chartUsage':
            return 'chart_usage';
        case 'requiredAttributes':
            return 'required_attributes';
        case 'catalogSearchUuid':
            return 'catalog_search_uuid';
        case 'icon':
            return 'icon';
        case 'tableLabel':
            return 'table_name';
        case 'categories':
        case 'tags':
        case 'fieldType':
        case 'tableName':
        case 'basicType':
        case 'tableGroupLabel':
        case 'groupLabel':
        case 'errors':
        case 'joinedTables':
            throw new Error(
                'Property has no corresponding column in the catalog table',
            );
        default:
            return assertUnreachable(
                property,
                `Invalid catalog property ${property}`,
            );
    }
}

export const CatalogTableName = 'catalog_search';

export type DbCatalogTag = {
    catalog_search_uuid: string;
    tag_uuid: string;
    created_at: Date;
    created_by_user_uuid: string | null;
    is_from_yaml: boolean;
};

export type DbCatalogTagIn = Omit<DbCatalogTag, 'created_at'>;

export type CatalogTagsTable = Knex.CompositeTableType<
    DbCatalogTag,
    DbCatalogTagIn
>;

export type DbCatalogTagsMigrateIn = DbCatalogTag;

export type DbCatalogItemsMigrateIn = Pick<
    DbCatalog,
    'catalog_search_uuid' | 'icon'
>;

export const CatalogTagsTableName = 'catalog_search_tags';

export type DbMetricsTreeEdge = {
    source_metric_catalog_search_uuid: string;
    target_metric_catalog_search_uuid: string;
    created_at: Date;
    created_by_user_uuid: string | null;
};

export type DbMetricsTreeEdgeIn = Pick<
    DbMetricsTreeEdge,
    | 'source_metric_catalog_search_uuid'
    | 'target_metric_catalog_search_uuid'
    | 'created_by_user_uuid'
>;

export type DbMetricsTreeEdgeDelete = Pick<
    DbMetricsTreeEdge,
    'source_metric_catalog_search_uuid' | 'target_metric_catalog_search_uuid'
>;

export type MetricsTreeEdgesTable = Knex.CompositeTableType<
    DbMetricsTreeEdge,
    DbMetricsTreeEdgeIn
>;

export const MetricsTreeEdgesTableName = 'metrics_tree_edges';
