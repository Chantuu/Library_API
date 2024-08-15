
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Library API",
            version: "1.0.0",
            description: "Simple API intended for demonstrating programming expertise in JavaScript."
        },
        servers: [{ url: `http://localhost:${process.env.PORT}` }]
    },
    apis: ['./routes/*.js']
}

module.exports = options;
