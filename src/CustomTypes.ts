interface StoredDataItem {
    id: string,
    agent: string,
    name: string
}

interface FileDetails {
    type?: string,
    name?: string,
    sendType?: string,
    Totalsize?: number
}

interface FileDetailsWithData {
    type: string,
    name: string,
    blob: Blob
}