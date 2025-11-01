import { Scrapper } from '../common/scrapper'
import { parse } from 'node-html-parser'
import { email_decoder } from '../utils/email-decoder'
const depts = [
  'cse',
  'eee',
  'ece',
  'ce',
  'me',
  'iem',
  'bme',
  'mse',
  'che',
  'urp',
  'becm',
  'arch',
  'math',
  'phy',
  'chem',
  'hum',
  'ese',
  'le',
  'te',
  'mte',
]

function faculty_parser(html: string) {
  const root = parse(html)
  const facultyList: any = []
  const facultyElements = root.querySelectorAll('div.col-md-6')
  for (const element of facultyElements) {
    const name = element.querySelector('.title')?.textContent
    const designation = element.querySelector('span')?.textContent

    const email = email_decoder(
      element.querySelector('.mx-1 span')?.getAttribute('data-cfemail')
    )
    const link = element.querySelector('a')?.getAttribute('href')
    facultyList.push({ name, designation, email, link })
  }
  return facultyList
}

export const DeptNotificationsScrappers: Scrapper[] = depts.map(
  (dept) =>
    new Scrapper(
      `https://www.kuet.ac.bd/${dept}/faculty`,
      `${dept}/faculty`,
      60,
      faculty_parser
    )
)
