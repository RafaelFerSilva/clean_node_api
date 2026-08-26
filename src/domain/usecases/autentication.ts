export interface AutenticationModel {
    accessToken: string
}

export interface AutenticationParams {
    email: string
    password: string
}

export interface Autentication {
    auth: (autenticationParams: AutenticationParams) => Promise<AutenticationModel | null>
}
