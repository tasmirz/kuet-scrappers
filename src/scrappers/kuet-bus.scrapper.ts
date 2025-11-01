import { Scrapper } from '../common/scrapper.js'
import { parse } from 'node-html-parser'

function bus_parser(raw_data: string) {
  const root = parse(raw_data)
  const schedules: any[] = ['morning', 'noon', 'afternoon', 'night', 'saturday']
  var results: any = {}
  for (const schedule of schedules) {
    results[schedule] = []
    const tab = root.querySelectorAll(`#${schedule} table tbody tr`)
    for (const row of tab) {
      const cols = row.querySelectorAll('td')
      results[schedule].push({
        type: cols[0].textContent,
        start_time: cols[1].textContent,
        end_time: cols[2].textContent.split(',')[1],
        returns_from: cols[2].textContent.split(',')[0],
        remarks: cols[3].textContent,
      })
    }
  }
  return results
}

export const KuetBusScrapper = new Scrapper(
  'https://www.kuet.ac.bd/transport',
  'bus_scrapper',
  60,
  bus_parser
)
