import Fastify from 'fastify'
import scrapper_routes from './scrappers/index.js'
import rateLimit from '@fastify/rate-limit'
async function main() {
  const fastify = Fastify({ logger: true })
  await fastify.register(rateLimit, {
    max: 100,
    timeWindow: '1 hour',
    cache: 10000,
    allowList: ['127.0.0.1'],
    redis: undefined,
    keyGenerator: (request) => request.ip,
  })

  await scrapper_routes(fastify)
  fastify.listen({ host: '0.0.0.0', port: 3000 }, (err, address) => {
    if (err) throw err
    console.log(`Server running at ${address}`)
  })
}
main()
