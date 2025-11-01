# Contributing to KUET Scrappers

We welcome contributions to improve and extend KUET Scrappers!

## Getting Started

1. **Fork & Clone**

   ```bash
   git clone https://github.com/tasmirz/kuet-scrappers.git
   cd kuet-scrappers
   pnpm install
   ```

2. **Run Scrappers Locally**
   ```bash
   pnpm dev
   ```

## Adding a Scrapper

Create a new `Scrapper` instance in the `src/scrappers` folder:

```typescript
import { Scrapper } from '../common/scrapper.js'
import { parse } from 'node-html-parser'

function parser(html: string) {
  const root = parse(html)
  // Your parsing logic here
  return parsedData
}

export const MyScrapper = new Scrapper(
  'https://example.com/data',
  'my_scrapper',
  60, // scrapping interval in minutes
  parser
)
```

Required parameters:

- `fetch_url` - URL to scrape
- `scrapper_name` - Unique identifier for the scrapper
- `scrapping_interval` - Update frequency in minutes (optional, default: 60)
- `parse_data` - Function to process HTML or JSON response

## Adding Routes

Routes are auto-generated from scrapper names. Simply:

1. Create your scrapper in `src/scrappers/`
2. Import and add it to the `scrappers` array in `src/scrappers/index.ts`

```typescript
import { MyScrapper } from './my-scrapper.js'

const scrappers: Scrapper[] = [
  KuetBusScrapper,
  KuetNoticeScrapper,
  MyScrapper, // Add your scrapper here
]
```

Your API endpoint will be available at `/scrape/my_scrapper`

## Coding Guidelines

- Use TypeScript with proper typing
- Ensure scrappers handle errors gracefully
- Respect rate limits to avoid excessive requests to KUET servers
- Follow the existing code style (Prettier configuration provided)
- Test your scrapper locally before submitting

## Pull Requests

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/my-scrapper`)
3. Commit your changes (`git commit -m 'Add my scrapper'`)
4. Push to the branch (`git push origin feature/my-scrapper`)
5. Open a Pull Request

Please:

- Include tests if possible
- Describe the problem your contribution solves
- Update README.md if adding new API endpoints

## Contact / Issues

Open an issue for bugs or feature requests before contributing.
