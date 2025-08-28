// Rota PowerShift: Gerenciador de sites Nginx
const express = require('express');
const router = express.Router();
const powershift = require('../services/powershift');

router.get('/sites', (req, res) => {
    const result = powershift.listSites();
    res.json(result);
});

// Futuras rotas: POST /sites, PUT /sites/:site, DELETE /sites/:site, POST /reload

module.exports = router;
