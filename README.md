  ---------------------------- Charity Fundraising Assistant-----------------------

**Functional Requirements**
1. User Registration and Login
-I will implement a user registration system where users can create an account with their email and password.
-For authentication, I will use JWT, so every logged-in user will receive a token that will be required for accessing secured pages or APIs.


2. User Roles
-The system will have three roles: Admin, Fundraiser, and Donor.
-Each role will have different access permissions.


3. Fundraising Post Creation
-Fundraisers will be able to create fundraising posts containing details like title, description, target amount, and images.
-When a fundraiser submits a post, it will go to the Admin for approval.


4. Admin Approval and Management
-Admin will be able to view all submitted fundraising posts.
-Admin can approve, reject, or remove any fundraising campaign.
-Admin can also manage users, block accounts, and monitor overall system activity.


5. Viewing Fundraising Campaigns
-Approved fundraising posts will be visible to all users.
-Donors can browse and filter campaigns based on category or fundraising status.


6. Donation and Payment
-Donors will be able to donate to any approved campaign.
-I will integrate an online payment system (such as SSLCommerz/Stripe/PayPal).
-After a successful payment, the system will store the donation record and generate a transaction ID or receipt.


7. Real-Time Chat System
-There will be a messaging feature where donors and fundraisers can chat with each other related to a specific campaign.
-The chat history will be stored in the database for future reference.


8. Notifications
-The system will send notifications for:
-Campaign approval or rejection
-Successful donations
-New chat messages
-Password reset requests


9. Security Features
-Passwords will be hashed before storing.
-JWT will be verified for every protected API.
-User access will be controlled strictly based on roles.




**Non-Functional Requirements**
1. Performance
-The system should load pages and respond to requests within a reasonable time (around 1–2 seconds).
-It should be able to handle multiple users at the same time without slowing down.


2. Scalability
-I will design the system in a modular way so it can grow with more users, more chat messages, and more fundraising posts in the future.


3. Security
-All data transfers will use HTTPS.
-JWT signing algorithms will be strong and secure.
-Input validation will be added to avoid security attacks like SQL injection and XSS.


4. Usability
-The interface will be simple and easy to use for all types of users.
-The design will be mobile-friendly so users can access it from any device.


5. Reliability and Availability
-The system should remain available most of the time (targeting around 99% uptime).
-Regular backups will be taken to prevent data loss.


6. Maintainability
-I will write the project using a clean folder structure separating authentication, fundraising management, admin panel, payments, and chat modules.
-Logging will be added for important actions such as admin approvals, user logins, and payments.


7. Real-Time Communication
-The chat system will be built using WebSockets/SignalR or another real-time technology.
-Messages will be delivered almost instantly (within a second).

