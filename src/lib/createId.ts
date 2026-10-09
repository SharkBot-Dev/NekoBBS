export default function createId() {
    var S="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    var N=20
    const res = Array.from(crypto.getRandomValues(new Uint8Array(N))).map((n)=>S[n%S.length]).join('')

    const date = new Date();
    return `${date.getDay()}${date.getHours()}${date.getMinutes()}${date.getSeconds()}${res}`
}

// console.log(createId())