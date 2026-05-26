const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'data', 'market-news.json');

try {
    const data = fs.readFileSync(filePath, 'utf8');
    const json = JSON.parse(data);
    const news = json.news;

    const linkCounts = {};
    const normalizedLinkCounts = {};
    const titleCounts = {};
    const duplicates = [];
    const normalizedDuplicates = [];
    const titleDuplicates = [];

    news.forEach(item => {
        // Exact link check
        if (linkCounts[item.link]) {
            linkCounts[item.link]++;
            duplicates.push(item.link);
        } else {
            linkCounts[item.link] = 1;
        }

        // Normalized link check
        try {
            const url = new URL(item.link);
            const normalized = url.origin + url.pathname;
            if (normalizedLinkCounts[normalized]) {
                normalizedLinkCounts[normalized]++;
                normalizedDuplicates.push(normalized);
            } else {
                normalizedLinkCounts[normalized] = 1;
            }
        } catch (e) { }

        // Title check
        if (titleCounts[item.title]) {
            titleCounts[item.title]++;
            titleDuplicates.push(item.title);
        } else {
            titleCounts[item.title] = 1;
        }
    });

    const uniqueDuplicates = [...new Set(duplicates)];
    const uniqueNormalizedDuplicates = [...new Set(normalizedDuplicates)];
    const uniqueTitleDuplicates = [...new Set(titleDuplicates)];

    let output = `Total items: ${news.length}\n`;
    output += `Exact Link Duplicates: ${uniqueDuplicates.length}\n`;
    output += `Normalized Link Duplicates: ${uniqueNormalizedDuplicates.length}\n`;
    output += `Title Duplicates: ${uniqueTitleDuplicates.length}\n\n`;

    if (uniqueTitleDuplicates.length > 0) {
        output += '--- Title Duplicates ---\n';
        uniqueTitleDuplicates.forEach(t => output += `${t}\n`);
        output += '\n';
    }

    if (uniqueNormalizedDuplicates.length > 0) {
        output += '--- Normalized Link Duplicates ---\n';
        uniqueNormalizedDuplicates.forEach(l => output += `${l}\n`);
    }
    fs.writeFileSync('duplicates_output.txt', output, 'utf8');
    console.log(output);

} catch (err) {
    console.error('Error:', err);
    fs.writeFileSync('duplicates_output.txt', 'Error: ' + err, 'utf8');
}
