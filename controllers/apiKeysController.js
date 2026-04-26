async function getKeys(req, res) {
    try {
        const tiny_mce_api_key = process.env.TINY_MCE_API_KEY;

        res.json({
            tiny_mce_api_key,
        });
    } catch (err) {
        console.error("Error in getKeys:", err.message, err.stack);
        return res.status(500).json({
            error: "Server failed for getKeys.",
        });
    }
}

export const apiKeysController = {
    getKeys,
}