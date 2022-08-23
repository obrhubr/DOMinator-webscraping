export type ScrapeResult = {
    _id: string,
    _config: string,
    blob: any,
    createdAt: string,
    updatedAt: string
}

export type TextQueryResult = {
    name: string,
    obj_name: string
    query: any,
    scraped: string
}

export type TableQueryResult = {
    name: string,
    obj_name: string
    tablebody: any,
    searchFor: any[],
    scraped: any[]
}
 