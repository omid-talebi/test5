

/** @type {import('next').NextConfig} */

import withPWA from 'next-pwa';

const nextConfig = {
  reactStrictMode: true,
};

export default withPWA ({
      dest : "public" , 
    register : true , 
    skipWaiting : true , 
    disable: process.env.NODE_ENV === 'development',
})

///////////////////////////////////////////////////////
// const withPWA = require('next-pwa')({
//   dest: 'public'
// })


// module.exports =withPWA({
//     reactStrictMode: true,
//     dest : "public" , 
//     register : true , 
//     skipWating : true , 
//     disable: process.env.NODE_ENV === 'development'
// })

// const nextConfig = {
//   reactStrictMode: true,
// };

// export default nextConfig;
