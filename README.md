# Assignment Submission Portal Backend

This is a backend system for an Assignment Submission Portal built with Node.js, Express.js, and MongoDB. It supports both user and admin roles, allowing users to upload assignments and admins to accept or reject them.

## Features

- **User and Admin Registration and Login** (with JWT authentication)
- **Assignment Upload by Users**
- **Assignment Review by Admins (Accept/Reject)**
- **JWT-based Authentication**
- **Input Validation using `express-validator`**
- **Error Handling for Invalid Inputs and Authorization**

## Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v12 or higher)
- [MongoDB](https://www.mongodb.com/try/download/community) (local or remote MongoDB instance)

## Project Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd assignment-portal
