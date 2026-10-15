#!/usr/bin/env node
// Regenerates README.md for awesome-ai-tools-by-buffnerf from tools.json + compare.json.
// Usage: node scripts/build_readme.js [dataDir] [outFile]
const fs = require('fs'), path = require('path');
const dir = process.argv[2] || path.join(__dirname, '..');
const out = process.argv[3] || path.join(process.cwd(), 'README.md');
const d = JSON.parse(fs.readFileSync(path.join(dir, 'tools.json'), 'utf8'));
let cmp = []; try { cmp = JSON.parse(fs.readFileSync(path.join(dir, 'compare.json'), 'utf8')); } catch (e) {}
const SITE = 'https://buffnerf-ai.vercel.app';
const anchor = s => s.toLowerCase().replace(/[^\w\- ]/g, '').replace(/ /g, '-');
const P = { free: 'Free', freemium: 'Free plan + paid', paid: 'Paid', 'open-source': 'Open source' };
const L = [];
L.push('# Awesome AI Tools: which AI tool to use for which job [![Awesome](https://awesome.re/badge.svg)](https://awesome.re)', '');
L.push(`> A ranked, hand-checked list of AI tools grouped by the job you need done. Maintained by [BuffNerf AI](${SITE}), where you can browse the same list with filters, comparisons and daily new releases.`, '');
L.push('⭐ marks the best pick in each category. Links go to official sites only, no affiliate links.', '');
L.push('## Contents', '');
for (const c of d.categories) L.push(`- [${c.icon} ${c.name}](#${anchor(c.icon + ' ' + c.name)})`);
if (cmp.length) L.push('- [Head-to-head comparisons](#head-to-head-comparisons)');
if ((d.releases || []).length) L.push('- [Recent releases](#recent-releases)');
L.push('- [Newsletter](#newsletter)', '- [Sponsor this list](#sponsor-this-list)', '- [Contributing](#contributing)', '- [License](#license)', '');
for (const c of d.categories) {
  const tools = d.tools.filter(t => t.category === c.id).sort((a, b) => a.rank - b.rank);
  if (!tools.length) continue;
  L.push(`## ${c.icon} ${c.name}`, '');
  for (const t of tools) L.push(`${t.rank}. [${t.name}](${t.url})${t.best_pick ? ' ⭐ **Best pick**' : ''}: ${t.use_for}. *${P[t.pricing] || t.pricing}.*`);
  const rel = cmp.filter(x => x.cat === c.id);
  L.push('', `→ Full ranking: [${c.name} on BuffNerf AI](${SITE}/${c.id}/)` + (rel.length ? ' · Compare: ' + rel.map(x => `[${x.a} vs ${x.b}](${SITE}/compare/${x.slug}/)`).join(' · ') : ''), '');
}
if (cmp.length) {
  L.push('## Head-to-head comparisons', '', 'Pricing and features taken from official pages, with the date each was checked.', '');
  for (const x of cmp) L.push(`- [${x.a} vs ${x.b}](${SITE}/compare/${x.slug}/)${x.checked ? ` (checked ${x.checked})` : ''}`);
  L.push('', `All comparisons: ${SITE}/compare/`, '');
}
if ((d.releases || []).length) {
  L.push('## Recent releases', '');
  for (const r of [...d.releases].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 15))
    L.push(`- **${r.date}**: ${r.title}: ${r.summary}. ([source](${r.source}))`);
  L.push('', `More: [${SITE}/new/](${SITE}/new/) · [RSS](${SITE}/rss.xml)`, '');
}
L.push('## Newsletter', '', 'Get the best new AI tools each week: [subscribe to BuffNerf AI](https://buffnerfai.beehiiv.com/subscribe).', '');
L.push('## Sponsor this list', '', `Want your AI tool in front of people choosing tools? [Sponsor BuffNerf AI](${SITE}/sponsor/). Sponsored placements are always labelled and never change rankings.`, '');
L.push('## Contributing', '', 'Suggestions welcome. Open an issue or pull request with the tool name, official URL, what it is best for and its pricing. Only real, working tools with official links are accepted; no affiliate or referral links. This README is generated from `tools.json` by `scripts/build_readme.js`, so edit the data, not the README.', '');
L.push('## License', '', '[![CC0](https://licensebuttons.net/p/zero/1.0/88x31.png)](https://creativecommons.org/publicdomain/zero/1.0/)', '', 'To the extent possible under law, BuffNerf AI has waived all copyright and related rights to this list. See [LICENSE](LICENSE).', '');
fs.writeFileSync(out, L.join('\n'));
console.log('Wrote', out, d.tools.length, 'tools');
