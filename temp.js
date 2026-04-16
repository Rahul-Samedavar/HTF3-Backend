import bcrypt from 'bcrypt'


const hash = async (msg) => await bcrypt.hash(msg, 10);
const verify = async(msg, hash) => await bcrypt.compare(msg, hash)

const args = process.argv.slice(2);
args.forEach(async (msg)=>{
        console.log(`hash of (${msg}) = ${await  hash(msg)}`)
})



// console.log(await verify(args[0], args[1]));