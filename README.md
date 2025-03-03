# CS4067-Assgt-EventBooking-i221140-HammadShabbir-repo

*Overview*

The Event Booking System is a microservices-based platform designed to facilitate seamless event discovery, ticket booking, and management. This system is structured into multiple services, each handling a specific responsibility to ensure scalability, reliability, and maintainability. Users can browse various events, book tickets, receive notifications, and manage their bookings efficiently.

*System Architecture*

The system is built using a microservices architecture, ensuring flexibility and easy scalability. Each microservice is responsible for a distinct function and communicates with others via REST APIs and asynchronous messaging using RabbitMQ. The system comprises the following microservices:
Key Microservices


*1. User Service*

•	Manages user authentication and profiles.
•	Ensures secure login and registration mechanisms.
•	Uses FastAPI or Express.js for backend implementation.
•	Stores user data in PostgreSQL.
•	Communicates synchronously via REST API.
•	Provides APIs for:
o	Fetching all users
o	Fetching a specific user by ID
o	Creating a new user
o	Handling user login


*2. Event Service*

•	Handles event listings and their details.
•	Ensures availability status of events is accessible.
•	Uses Spring Boot or Node.js as the backend framework.
•	Stores event-related data in MongoDB.
•	Communicates synchronously via REST API.
•	Provides APIs for:
o	Fetching all events
o	Fetching a specific event by ID
o	Checking the availability of an event


*3. Booking Service*

•	Manages ticket bookings, payments, and status updates.
•	Ensures smooth integration with payment gateways.
•	Uses Flask or Express.js for backend development.
•	Stores booking details in PostgreSQL.
•	Communicates via REST API for synchronous operations and RabbitMQ for asynchronous messaging.
•	Provides APIs for:
o	Creating new bookings 
o	Fetching booking details
o	Processing payments


*4. Notification Service*

•	Sends email notifications for booking confirmations and updates.
•	Uses Flask or Express.js for backend processing.
•	Stores logs and notifications in MongoDB.
•	Communicates asynchronously via RabbitMQ.
•	Triggers email notifications based on booking events.


![Image](https://github.com/user-attachments/assets/1b17285f-4dda-4e87-b79b-a6caeac94d5c)


![Image](https://github.com/user-attachments/assets/72fb2eed-21bd-4425-9da1-8692596cfb20)


![Image](https://github.com/user-attachments/assets/db54b6e0-8986-4f20-94b0-03f7890549ed)


![Image](https://github.com/user-attachments/assets/6e2b0817-eea7-48ed-a7d9-d53016d8e665)


![Image](https://github.com/user-attachments/assets/7832e98c-01f7-4f1c-875f-6862b2e6439c)


![Image](https://github.com/user-attachments/assets/ef2c4762-60e7-4772-9b27-d856d1dd05cc)


![Image](https://github.com/user-attachments/assets/fcdbc965-1abf-468b-b7ca-155c0b5b137c)
