export interface HttpResponse {
    statusCode: number
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- HttpResponse body can be any type of payload
    body: any
}

export interface HttpRequest {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- HttpRequest body can contain any unstructured JSON input
    body?: any
}
