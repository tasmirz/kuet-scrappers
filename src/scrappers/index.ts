import { FastifyInstance } from 'fastify/types/instance'
import { Scrapper } from '../common/scrapper'
import { KuetBusScrapper } from './kuet-bus.scrapper'
import { KuetNoticeScrapper } from './kuet-notifications.js'
import { DeptNotificationsScrappers } from './dept-faculty.js'
const scrappers: Scrapper[] = [
  KuetBusScrapper,
  KuetNoticeScrapper,
  ...DeptNotificationsScrappers,
]

for (const scrapper of scrappers) {
  scrapper.start()
}
async function scrapper_routes(fastify: FastifyInstance) {
  for (const scrapper of scrappers) {
    fastify.route({
      method: 'GET',
      url: `/scrape/${scrapper.get_name()}`,
      handler: async (request, reply) => {
        try {
          const data = await scrapper.get()
          return data
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : String(err)
          reply
            .status(500)
            .send({ error: 'Scraping failed', details: errorMessage })
        }
      },
    })
  }
}

export default scrapper_routes
