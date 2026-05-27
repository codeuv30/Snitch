import config from "./src/config/config.js";
import app from "./src/app.js";
import connectDB from "./src/config/database.js";

const PORT = config.PORT;

const startServer = async () => {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log(`Server listening on port ${PORT}`);
            console.log(`Environment: ${config.NODE_ENV}`);
        });

    } catch (error) {
        console.error("Failed to start server:", error.message);
        process.exit(1);
    }
};

startServer();