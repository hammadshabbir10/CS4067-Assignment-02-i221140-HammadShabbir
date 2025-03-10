document.addEventListener("DOMContentLoaded", function () {
    const services = [
        {
            name: "User Service",
            description: "Manages user authentication & profiles.",
            techStack: "FastAPI / Express.js",
            database: "PostgreSQL",
            communication: "REST API (Sync)",
            apis: ["GET /users", "GET /users/{id}", "POST /users", "POST /login"],
        },
        {
            name: "Event Service",
            description: "Handles event listings and details.",
            techStack: "Spring Boot / Node.js",
            database: "MongoDB",
            communication: "REST API (Sync)",
            apis: ["GET /events", "GET /events/{id}", "GET /events/{id}/availability"],
        },
        {
            name: "Booking Service",
            description: "Handles ticket bookings, payments, and status updates.",
            techStack: "Flask / Express.js",
            database: "PostgreSQL",
            communication: "REST API (Sync), RabbitMQ (Async)",
            apis: ["POST /bookings", "GET /bookings/{id}", "POST /payments"],
        },
        {
            name: "Notification Service",
            description: "Sends email notifications for bookings.",
            techStack: "Flask / Express.js",
            database: "MongoDB",
            communication: "RabbitMQ (Async)",
            apis: ["Consumes booking events", "Sends email confirmations"],
        },
    ];

    const container = document.getElementById("microservices");

    services.forEach(service => {
        const card = document.createElement("div");
        card.classList.add("card");

        card.innerHTML = `
            <h2>${service.name}</h2>
            <p>${service.description}</p>
            <p><strong>Tech Stack:</strong> ${service.techStack}</p>
            <p><strong>Database:</strong> ${service.database}</p>
            <p><strong>Communication:</strong> ${service.communication}</p>
            <div>
                <h3>APIs:</h3>
                <ul>
                    ${service.apis.map(api => `<li>${api}</li>`).join("")}
                </ul>
            </div>
        `;

        container.appendChild(card);
    });
});
