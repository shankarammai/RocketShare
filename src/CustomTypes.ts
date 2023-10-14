interface StoredDataItem {
    id:string,
    agent:string,
    name:string
}

interface FileDetails {
    type?:string,
    agent?:string,
    sendType?:string
}

interface FileWithData {
    type?: string,
    name?: string,
    blob?: Blob
}