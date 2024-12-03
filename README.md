
<img width="1440" alt="Screenshot 2024-12-02 at 11 58 54 PM" src="https://github.com/user-attachments/assets/46986d3c-8b30-429d-a6cf-d6a54f0956f0">

<img width="1440" alt="Screenshot 2024-12-02 at 11 57 02 PM" src="https://github.com/user-attachments/assets/ea85588d-fa97-4dcb-a8fa-47e51a04d6d2">

<img width="1440" alt="Screenshot 2024-12-02 at 11 57 12 PM" src="https://github.com/user-attachments/assets/1a36dab2-891b-4cf2-b865-54f11f86955b">

<img width="1439" alt="Screenshot 2024-12-02 at 11 58 11 PM" src="https://github.com/user-attachments/assets/f2f53eae-dca0-4ebb-97db-b4661831f0de">




# App README

This project consists of a **Next.js** frontend and a **Node.js** backend with PostgreSQL for database management. Below are the steps to set up and run the application.

## Prerequisites

Make sure you have the following tools installed:

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)
- [PostgreSQL](https://www.postgresql.org/)
- [Gemini API Key](https://cloud.google.com/ai)

## Setup Instructions

### 1. **Clone the Repository**

First, clone the repository to your local machine:

```bash
git clone https://github.com/yguz/MagLens.git
cd MagLens
```

### 2 **Set Up the Frontend (Next.js)**

The frontend is built using Next.js, React, TypeScript, and Tailwind CSS.

Install dependencies:
In the frontend directory, run the following command to install the required dependencies:

```bash
npm install
```

Start the frontend:
To run the frontend, use the following command:

```bash
npm run dev
```

This will start the development server for the frontend application. You can access it at http://localhost:3000.

### 3 **Set Up the Backend (Node.js)**

The backend is a Node.js app that handles file uploads, processes PDFs, and interacts with the Gemini API and PostgreSQL database.

Install dependencies:
In the backend directory, run the following command to install the required dependencies:

```bash
npm install
```

Start the backend:
To run the backend, open a new terminal window, navigate to the backend directory, and run:

```bash
npm run start
```

This will start the backend server, which will handle API requests.

### 4 **Set Up PostgreSQL Database**

Make sure PostgreSQL is running on your machine. Open a new terminal and run the following command to start a PostgreSQL session:

```bash
psql -U postgres -p 5433
```

If you're using a different port, update the connection string in the db folder configuration file accordingly.

Create the necessary tables in PostgreSQL:
Once you're inside the PostgreSQL session, run the following SQL queries to create the required tables:

```bash
sql
CREATE TABLE conversations (
id SERIAL PRIMARY KEY,
message TEXT NOT NULL,
review TEXT NOT NULL
);

CREATE TABLE files (
id SERIAL PRIMARY KEY,
file_name TEXT NOT NULL,
file_path TEXT NOT NULL,
review TEXT
);
```

### 5 **Set Up Environment Variables**

The application requires a Gemini API Key.

Create a .env file:
In the root of the project, create a .env file and add the following line:

makefile

```bash
GEMINI_API_KEY=your-gemini-api-key
Replace your-gemini-api-key with the actual API key from the Gemini API.
```

### 6 **Run the App**

Once the database is set up and the environment variables are configured, you can start both the frontend and backend as described in steps 2 and 3.

Frontend
To run the frontend, use the following command:

```bash
npm run dev
```

This will start the frontend on http://localhost:3000.

Backend
To run the backend, open a new terminal window and run:

```bash
npm run start
```

This will start the backend server, typically on http://localhost:4000.

PostgreSQL Database
Make sure your PostgreSQL server is running, and you can access the database from a terminal using:

```bash
psql -U postgres -p 5433
```

Adjust the port number as necessary if you've changed the default PostgreSQL port.

### 7 **Usage**

The frontend allows users to upload PDF files.
The backend processes the PDF, extracts text, generates a review using the Gemini API, and saves the metadata to the PostgreSQL database.
The conversations table stores user messages and the corresponding review, while the files table stores information about uploaded files and their reviews.
API Endpoints
POST /api/upload: Upload a PDF file. The backend will process the file, extract text, generate a review, and save the metadata in the database.

### 8 **Testing the App**

Once everything is set up, you can test the app by uploading a PDF file via the frontend. The backend will process the file, extract the text, call the Gemini API for review generation, and save the data in the database.

You can check the files and conversations tables in PostgreSQL to verify that the data is being stored correctly.

Troubleshooting
Database connection issues: Make sure the PostgreSQL server is running and the correct port is specified in your connection string.
Gemini API issues: Ensure the API key is correctly set in the .env file. Verify that you have the necessary access to the Gemini API.

File upload errors: Ensure that the backend is set up to handle large file uploads correctly and that the file size does not exceed limits.
Additional Notes
Ensure the port for PostgreSQL is configured correctly in both the database and backend configuration files (5433 by default).

The file upload functionality requires the backend to handle large file uploads properly. Make sure the body parser is disabled for the backend API.
The generated review from the Gemini API is saved in the database and can be retrieved later along with the uploaded file's metadata.
