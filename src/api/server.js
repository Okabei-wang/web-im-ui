let serverHost = 'http://127.0.0.1:3000';

console.log(process.env.NODE_ENV)
if (process.env.NODE_ENV === 'production') {
  serverHost = 'http://101.43.169.241:3000'
}

export { serverHost }