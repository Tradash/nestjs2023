import { createHmac } from "node:crypto"

export const createHashWithSalt = (data: string, salt: string) => {
    const hash = createHmac("sha512", salt)
    hash.update(data)
    return hash.digest('hex')
}