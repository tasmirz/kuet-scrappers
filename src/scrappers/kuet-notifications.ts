import { Scrapper } from '../common/scrapper.js'
import { parse } from 'node-html-parser'

export const notification_parser = (raw_data: string) => {
  const root = parse(raw_data)
  var results: any = []
  const tab = root.querySelectorAll('table tbody tr')
  for (const row of tab) {
    const cols = row.querySelectorAll('td')
    results.push({
      date: cols[0].textContent,
      title: cols[1].textContent,
      link: cols[1].querySelector('a')?.getAttribute('href'),
    })
  }
  //console.log(results)
  return results
}

export const KuetNoticeScrapper = new Scrapper(
  'https://www.kuet.ac.bd/notices/all',
  'notice_scrapper',
  60,
  notification_parser
)
