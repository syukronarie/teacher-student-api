# Teacher Student API

## Overview

API to manage teachers and students registration, suspension, and notifications.
Built using NodeJS with Express and MySQL, the API follows best practices including modular architecture, input validation, logging, and unit testing.

---

## Table of Contents

- [Background](#background)
- [Features](#features)
- [User Stories](#user-stories)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
- [Running Locally](#running-locally)
- [API Endpoints](#api-endpoints)
- [Testing](#testing)
- [Deployment](#deployment)
- [Project Structure](#project-structure)
- [Error Handling](#error-handling)
- [Contributing](#contributing)
- [Contact](#contact)

---

## Background

Teachers need a system to perform administrative functions for their students. Teachers and students are identified by their email addresses. This API supports those core functionalities as outlined in the user stories below.

---

## Features

- Input validation via Zod
- Auto-generated Swagger docs
- Rate limiting & security headers
- Structured logging with correlation IDs
- Clean layered architecture

## User Stories

1.  **Register Students to Teacher**  
    Teachers can register one or more students. Students can be registered to multiple teachers.
2.  **Retrieve Common Students**  
    Get students common to one or more teachers.
3.  **Suspend Student**  
    Suspend a specific student to prevent them from receiving notifications.
4.  **Retrieve Students for Notifications**  
    Retrieve students eligible to receive notifications based on registration and @mentions, excluding suspended students.

---

## Technology Stack

- **Backend:** Node.js with Express
- **Database:** MySQL, accessed via mysql2 (Promise-based API)
- **Validation:** Zod + zod-to-openapi (for Swagger docs)
- **Logging:** Winston with correlation IDs
- **Testing:** Jest (unit tests)
- **Other:** Rate limiting, centralized error handling, modular layers

---

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- MySQL server running locally or remotely
- npm or yarn package manager

---

## Running Locally

1. **Clone the repository**

```bash
git clone https://github.com/syukronarie/teacher-student-api.git cd teacher-student-api
```

2. **Install dependencies**

```bash
cd teacher-student-api
npm install
```

3. **Set up environment variables**

Create a `.env` file in the root directory with the following variables:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=teacher_student_db
PORT=3000
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100
```

4. **Initialize the database**

Setup MySQL database and run the schema SQL script.
Run the SQL scripts or use the migration tool to create the required tables.

5. **Start the server**

```bash
npm start
```

The server will be running at [http://localhost:3000](http://localhost:3000)

🧭 **API Docs:** Once running, navigate to [http://localhost:3000/api-docs](http://localhost:3000/api-docs) to view Swagger documentation.

---

## API Endpoints

| Endpoint                        | Method | Description                                                 | Request Body/Params                               | Response Code  | Notes                                       |
| ------------------------------- | ------ | ----------------------------------------------------------- | ------------------------------------------------- |----------------| ------------------------------------------- |
| `/api/register`                 | POST   | Register students to a teacher                              | JSON: `{ teacher: string, students: string[] }`   | 204 No Content | Registers multiple students to one teacher  |
| `/api/commonstudents`           | GET    | Retrieve common students registered to specified teacher(s) | Query Param: `teacher` (multiple allowed)         | 200 OK         | Returns list of common students             |
| `/api/suspend`                  | POST   | Suspend a specified student                                 | JSON: `{ student: string }`                       | 204 No Content | Suspends the given student                  |
| `/api/retrievefornotifications` | POST   | Retrieve students eligible to receive a notification        | JSON: `{ teacher: string, notification: string }` | 200 OK         | Includes registered and @mentioned students |

---

## Testing

Unit tests are implemented with Jest.

Run tests with:

```bash
npm test
```

Test coverage reports can be generated with:

```bash
npm run test:coverage
```

---

## Deployment

**API Base URL:** _To be determined or configured upon deployment._

---

## Project Structure

```bash
/src
  /config
    db.js           # Database connection
    logger.js       # Winston logger setup
  /dtos
    register.dto.js # Zod validation schemas
    suspend.dto.js
    notification.dto.js
  /middlewares
    errorHandler.js
    rateLimiter.js
    correlationId.js
  /repositories
    teacher.repository.js
    student.repository.js
    registration.repository.js
  /services
    teacher.service.js
  /controllers
    teacher.controller.js
  /routes
    teacher.routes.js
  swagger.js        # Swagger/OpenAPI documentation setup
  app.js            # Express app configuration
  server.js         # Server bootstrap
/tests
  teacher.service.test.js  # Unit tests
.env                 # Environment variables
README.md            # This file
```

---

## Error Handling

All error responses follow the format:

```json
{ "message": "Meaningful error message" }
```

Appropriate HTTP status codes are used for different error scenarios, such as:

- `400 Bad Request` for validation errors
- `404 Not Found` for resources not found
- `500 Internal Server Error` for unexpected failures

---

## Contributing

Feel free to fork this repository, submit issues, or open pull requests for improvements.

---

## Contact

For questions or clarifications, please contact:  
**Email:** syukronarie@gmail.com

---

Thank you for reviewing this assessment. I look forward to your feedback!

---
