export default function createToken (length = 9) {

    let res = "";

    for(let i = 0; i < length; i ++) {
        res += Math.floor(Math.random() * 10);
    }

    return res;

}