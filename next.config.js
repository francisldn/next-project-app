/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverComponentExternalPackages: ['bcrypt'],
    }
}

module.exports = nextConfig
