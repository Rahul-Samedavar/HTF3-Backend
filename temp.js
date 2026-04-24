import bcrypt from 'bcrypt'
import { getTeamCode } from './src/utils/coder.js'

const hash = async (msg) => await bcrypt.hash(msg, 10);
const verify = async(msg, hash) => await bcrypt.compare(msg, hash)

// const args = process.argv.slice(2);
// args.forEach(async (msg)=>{
//         console.log(`hash of (${msg}) = ${await  hash(msg)}`)
// })



// console.log(await verify(args[0], args[1]));

const args = process.argv.slice(2);
args.forEach(async (id)=>{
        console.log(`team code of (${id}) = ${await  getTeamCode(parseInt(id))}`)
})
