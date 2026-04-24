# Word Helper Word Data

Word Helper does not invent word results.

During `npm run build`, the site generator reads the local system dictionary at `/usr/share/dict/words` when it is available, filters it to lowercase alphabetic English-looking entries, and combines it with curated seed words used by the tools and examples.

The macOS `/usr/share/dict/words` list is commonly derived from public dictionary sources, but the exact redistribution terms can vary by system image. Before a production deployment that redistributes the generated word data, review and replace this source with a clearly licensed word list if needed.

The curated seed list is included so examples such as `listen`, `stone`, `light`, `time`, `day`, common prefix families, and common suffix families work reliably in local development.
