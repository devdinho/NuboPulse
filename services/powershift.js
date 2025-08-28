// Serviço PowerShift: Gerenciador de sites Nginx
const fs = require('fs');
const path = require('path');

const SITES_AVAILABLE = '/etc/nginx/sites-available';

const SITES_ENABLED = '/etc/nginx/sites-enabled';

function extractDomain(content) {
    const serverNameMatch = content.match(/server_name\s+([^;\n]+)/);
    return serverNameMatch ? serverNameMatch[1].trim() : null;
}

function extractPaths(content) {
    const pathMatches = [...content.matchAll(/location\s+([^\s{]+)\s*{/g)];
    return pathMatches.map(m => m[1].trim());
}

function listSites() {
    try {
        const files = fs.readdirSync(SITES_AVAILABLE).sort();
        const result = files.map((site, idx) => {
            const sitePath = path.join(SITES_AVAILABLE, site);
            let content = '';
            let enabled = false;
            let domain = null;
            let paths = [];
            try {
                content = fs.readFileSync(sitePath, 'utf8');
                domain = extractDomain(content);
                paths = extractPaths(content);
            } catch (e) {
                content = null;
            }
            try {
                const enabledPath = path.join(SITES_ENABLED, site);
                enabled = fs.existsSync(enabledPath);
            } catch (e) {
                enabled = false;
            }
            return {
                id: idx + 1,
                name: site,
                domain,
                paths,
                content,
                enabled
            };
        });
        return result;
    } catch (err) {
        return { error: err.message };
    }
}

module.exports = {
    listSites,
    // Futuras funções: addSite, editSite, removeSite, reloadNginx
};
