let app;
let loadError = null;

try {
    app = require('../server/server.js');
} catch (err) {
    loadError = err;
}

module.exports = (req, res) => {
    if (loadError) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json({
            error: "Express App Load Error",
            message: loadError.message,
            stack: loadError.stack
        });
    }
    
    try {
        return app(req, res);
    } catch (runError) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json({
            error: "Express App Execution Error",
            message: runError.message,
            stack: runError.stack
        });
    }
};
