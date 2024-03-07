# University Appointment Manager

The University Appointment Manager is a backend application designed to facilitate appointment scheduling between students and the dean of a university. It provides a secure authentication system for both students and the dean and allows for the booking and management of appointment slots.

## Features

- **Authentication**: Students and the dean can securely log in using their university ID and password to access the system. Upon successful authentication, a unique token is generated for subsequent API interactions.

- **Appointment Scheduling**: Students can view a list of available appointment slots with the dean and book a slot that fits their schedule. Each slot is one hour long and is available only on Thursdays and Fridays at 10 AM every week.

- **Session Management**: The dean can log in and view a list of pending sessions, including details of the student and the booked slot. The dean can also see which slots are available and which have been booked.


## Usage

1. **Student Authentication**: Students should log in using their university ID and password to access the system and book appointment slots.

2. **View Available Slots**: After logging in, students can view a list of available slots with the dean and choose a suitable one to book.

3. **Book Appointment**: Students can book a slot by selecting the desired time and confirming the booking.

4. **Dean Authentication**: The dean should log in using their university ID and password to access the system and manage appointment sessions.

5. **View Pending Sessions**: After logging in, the dean can view a list of pending sessions, including details of the student and the booked slot.

6. **Manage Sessions**: The dean can approve or reject pending sessions and view the status of each appointment.

## Technologies Used

- Node.js
- Express.js
- PostgreSQL
- Supabase
- JWT (JSON Web Tokens) for authentication

