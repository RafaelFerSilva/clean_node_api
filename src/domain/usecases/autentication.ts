export interface Autentication {
    auth: (email: string, password: string) => Promise<string | null>
}
