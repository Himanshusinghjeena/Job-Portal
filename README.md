
# Job Portal RESTful API

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js CI](https://github.com/your-username/job-portal-api/actions/workflows/node.js.yml/badge.svg)](https://github.com/your-username/job-portal-api/actions/workflows/node.js.yml)
[![Coverage Status](https://coveralls.io/repos/github/your-username/job-portal-api/badge.svg?branch=main)](https://coveralls.io/github/your-username/job-portal-api?branch=main)

## Introduction

This is a RESTful API built with Node.js and Express for managing job applications, companies, jobs, and user accounts. It provides a comprehensive set of endpoints for creating, reading, updating, and deleting resources related to job postings and applications.

## API Endpoints

### Applications

#### Create a new application

> POST /applications

*   **Description:** Creates a new job application.
*   **Request Body:**

    *   **Success (201 Created):**

json
        {
            "success": true,
            "data": {
                "_id": "application_id",
                "jobId": "job_id",
                "userId": "user_id",
                "resumeUrl": "url_to_resume",
                "coverLetter": "optional_cover_letter",
                "status": "pending"
            }
        }
        json
        {
            "success": true,
            "count": 2,
            "data": [
                {
                    "_id": "application_id_1",
                    "jobId": "job_id_1",
                    "userId": "user_id_1",
                    "resumeUrl": "url_to_resume_1",
                    "status": "pending"
                },
                {
                    "_id": "application_id_2",
                    "jobId": "job_id_2",
                    "userId": "user_id_2",
                    "resumeUrl": "url_to_resume_2",
                    "status": "accepted"
                }
            ]
        }
            *   **Success (200 OK):**

json
        {
            "success": true,
            "data": {
                "_id": "application_id",
                "jobId": "job_id",
                "userId": "user_id",
                "resumeUrl": "url_to_resume",
                "status": "pending"
            }
        }
        json
    {
        "status": "accepted"
    }
    *   **Description:** Deletes a job application.
*   **Parameters:**
    *   `id` (string, required): The ID of the application to delete.
*   **Response:**

    *   **Success (200 OK):**

json
        {
            "success": true,
            "data": {}
        }
        *   **Description:** Creates a new company.
*   **Request Body:**

json
        {
            "success": true,
            "data": {
                "_id": "company_id",
                "name": "Company Name",
                "description": "Company Description",
                "industry": "Industry",
                "website": "https://www.example.com"
            }
        }
        json
        {
            "success": true,
            "count": 2,
            "data": [
                {
                    "_id": "company_id_1",
                    "name": "Company Name 1",
                    "description": "Company Description 1",
                    "industry": "Industry 1",
                    "website": "https://www.example1.com"
                },
                {
                    "_id": "company_id_2",
                    "name": "Company Name 2",
                    "description": "Company Description 2",
                    "industry": "Industry 2",
                    "website": "https://www.example2.com"
                }
            ]
        }
        *   **Description:** Retrieves a specific company by its ID.
*   **Parameters:**
    *   `id` (string, required): The ID of the company.
*   **Response:**

    *   **Success (200 OK):**

json
        {
            "success": true,
            "data": {
                "_id": "company_id",
                "name": "Company Name",
                "description": "Company Description",
                "industry": "Industry",
                "website": "https://www.example.com"
            }
        }
        json
    {
        "description": "Updated Company Description"
    }
    *   **Description:** Deletes a company.
*   **Parameters:**
    *   `id` (string, required): The ID of the company to delete.
*   **Response:**

    *   **Success (200 OK):**

json
        {
            "success": true,
            "data": {}
        }
        > POST /jobs

*   **Description:** Creates a new job posting.
*   **Request Body:**

json
        {
            "success": true,
            "data": {
                "_id": "job_id",
                "title": "Job Title",
                "description": "Job Description",
                "companyId": "company_id",
                "location": "Location",
                "salary": 80000
            }
        }
        *   **Description:** Retrieves all job postings.
*   **Response:**

    *   **Success (200 OK):**

> GET /jobs/:id

*   **Description:** Retrieves a specific job posting by its ID.
*   **Parameters:**
    *   `id` (string, required): The ID of the job.
*   **Response:**

    *   **Success (200 OK):**

json
        {
            "success": true,
            "data": {
                "_id": "job_id",
                "title": "Job Title",
                "description": "Job Description",
                "companyId": "company_id",
                "location": "Location",
                "salary": 80000
            }
        }
        #### Update a job

> PUT /jobs/:id

*   **Description:** Updates an existing job posting.
*   **Parameters:**
    *   `id` (string, required): The ID of the job to update.
*   **Request Body:**

json
        {
            "success": true,
            "data": {
                "_id": "job_id",
                "title": "Job Title",
                "description": "Job Description",
                "companyId": "company_id",
                "location": "Location",
                "salary": 95000
            }
        }
        *   **Description:** Deletes a job posting.
*   **Parameters:**
    *   `id` (string, required): The ID of the job to delete.
*   **Response:**

    *   **Success (200 OK):**

> POST /users/register

*   **Description:** Registers a new user account.
*   **Request Body:**

json
    {
        "username": "new_user",
        "email": "new_user@example.com",
        "password": "password123"
    }
    json
        {
            "success": false,
            "error": "Validation error or user already exists"
        }
        json
        {
            "success": false,
            "error": "Invalid credentials"
        }
        *   **Description:** Retrieves the current user's profile. Requires authentication.
*   **Headers:**
    *   `Authorization`: `Bearer JWT_token`
*   **Response:**

    *   **Success (200 OK):**

> PUT /users/:id

json
    {
        "username": "updated_user"
    }
    json
        {
            "success": false,
            "error": "User not found"
        }
        *   **Description:** Deletes a user. Requires authentication.
*   **Parameters:**
    *   `id` (string, required): The ID of the user to delete.
*   **Headers:**
    *   `Authorization`: `Bearer JWT_token`
*   **Response:**

    *   **Success (200 OK):**

The API uses JSON Web Tokens (JWT) for authentication.  The `/users/register` endpoint creates a new user, and the `/users/login` endpoint returns a JWT upon successful authentication. This token must be included in the `Authorization` header of subsequent requests to protected routes (e.g., `GET /users/me`) as a Bearer token.


Authorization: Bearer <JWT_token>
*   400 Bad Request: Invalid request data.
*   401 Unauthorized: Authentication required or invalid credentials.
*   404 Not Found: Resource not found.
*   500 Internal Server Error: An unexpected error occurred on the server.

Example:

*   **Application:** Represents a job application.
    *   `jobId`: ID of the job.
    *   `userId`: ID of the user.
    *   `resumeUrl`: URL of the resume.
    *   `coverLetter`: (Optional) Cover letter text.
    *   `status`: Status of the application (e.g., pending, accepted, rejected).
*   **Company:** Represents a company.
    *   `name`: Name of the company.
    *   `description`: Description of the company.
    *   `industry`: Industry of the company.
    *   `website`: Company website URL.
*   **Job:** Represents a job posting.
    *   `title`: Title of the job.
    *   `description`: Description of the job.
    *   `companyId`: ID of the company.
    *   `location`: Location of the job.
    *   `salary`: Salary for the job.
*   **User:** Represents a user account.
    *   `username`: Username of the user.
    *   `email`: Email address of the user.
    *   `password`: Password of the user (hashed).

## Dependencies

> List all dependencies used in the project. Example:

*   Express: Web framework for Node.js
*   Mongoose: MongoDB object modeling tool
*   jsonwebtoken: JSON Web Token implementation
*   bcrypt: Password hashing
*   dotenv: Load environment variables from .env file
*   morgan: HTTP request logger

## Installation

> Provide detailed installation instructions. Example:

1.  Clone the repository:

bash
    git clone https://github.com/your-username/job-portal-api.git
    cd job-portal-api
        *   Create a `.env` file in the root directory.
    *   Add the following environment variables:

        bash
    npm start
    bash
curl http://localhost:3000/jobs
> Explain how others can contribute to the project. Example:

We welcome contributions!  Please follow these steps:

1.  Fork the repository.
2.  Create a new branch for your feature or bug fix.
3.  Make your changes and commit them with clear, concise messages.
4.  Submit a pull request.

## License

> Specify the license under which the project is released. Example:

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
