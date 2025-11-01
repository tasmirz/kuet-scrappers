import https from 'https'
import crypto from 'crypto'

export class Scrapper {
  private fetch_url: string
  private scrapper_name: string
  private is_active: boolean = true
  private is_scrapping: boolean = false
  private last_scrapped_at: Date | null = null
  private cached_data: string | null = null
  private cached_data_hash: string | null = null
  private formatted_data: any = null
  private parse_data: (data: string) => any
  private scrapping_interval: number = 60 // in minutes
  private interval_handle: NodeJS.Timeout | null = null

  constructor(
    fetch_url: string,
    scrapper_name: string,
    scrapping_interval: number = 60,
    parse_data: (data: string) => void = () => {}
  ) {
    this.fetch_url = fetch_url
    this.scrapper_name = scrapper_name
    this.scrapping_interval = scrapping_interval
    this.parse_data = parse_data
  }

  public start() {
    if (this.is_active) {
      this.interval_handle = setInterval(
        () => this.scrap(),
        this.scrapping_interval * 1000 * 60
      )
      // Initial scrap
      this.scrap()
    }
  }

  public get_name() {
    return this.scrapper_name
  }

  private fetch_data() {
    
    return new Promise((resolve, reject) => {
      https
        .get(this.fetch_url, (res: import('http').IncomingMessage) => {
          let data = ''

          res.on('data', (chunk: Buffer | string) => {
            // chunk could be Buffer depending on node config
            data += chunk.toString()
          })
          res.on('end', () => {
            const hashedData = crypto
              .createHash('sha256')
              .update(data)
              .digest('hex')
            resolve({ data, hash: hashedData })
          })
        })
        .on('error', (err: Error) => {
          reject(err)
        })
    })
  }

  private async scrap() {
    if (this.is_scrapping) return
    if (!this.is_active) return
    this.is_scrapping = true
    try {
      const result: any = await this.fetch_data()
      const new_data: string = result.data
      const new_hash: string = result.hash

      if (this.cached_data_hash !== new_hash) {
        this.cached_data = new_data
        this.cached_data_hash = new_hash
        this.last_scrapped_at = new Date()
        this.formatted_data = this.parse_data(new_data)
      }
    } catch (error) {
      console.error(`Error during scrapping in ${this.scrapper_name}:`, error)
    } finally {
      this.is_scrapping = false
    }
  }

  //Returns the cached data if available, otherwise fetches new data.
  public async get() {
    if (!this.is_scrapping) return this.formatted_data
    // wait for scrapping to finish
    while (this.is_scrapping) {
      await new Promise((resolve) => setTimeout(resolve, 100))
    }
    return this.formatted_data
  }

  // Updates url, interval, active status, etc.
  public set_config({
    fetch_url,
    scrapping_interval,
    is_active,
  }: {
    fetch_url?: string
    scrapping_interval?: number
    is_active?: boolean
  }) {
    if (fetch_url) this.fetch_url = fetch_url
    if (scrapping_interval) this.scrapping_interval = scrapping_interval
    if (is_active !== undefined) this.is_active = is_active
    // Reset interval
    if (this.interval_handle) {
      clearInterval(this.interval_handle)
    }
    if (this.is_active) {
      this.interval_handle = setInterval(
        () => this.scrap(),
        this.scrapping_interval * 1000 * 60
      )
    }
  }

  public force_update() {
    this.scrap()
  }
}
