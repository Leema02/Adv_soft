# RentItOut

Welcome to **RentItOut** – a backend API designed to support a rental marketplace where users can list and rent everyday items. This project promotes a circular economy, enabling users to rent out items they own but rarely use, such as tools, sports equipment, and party supplies, to others in their community.

## Features

### Core Features

1. **Item Listings for Rent**
   - Users can list a variety of items across categories like tools, electronics, and vehicles.
   - Organized into categories like home improvement and transportation to simplify browsing.

2. **Rental Management and Pricing**
   - Flexible rental durations and pricing options.
   - Customizable rental periods to accommodate different rental needs.

3. **Trust, Safety, and Verification**
   - Secure transactions through user verification, reviews, and ratings.
   - Security deposits and damage protection options for item security.

4. **Logistics (Delivery and Pickup)**
   - Supports both in-person pickups and delivery options.
   - Location-based features to facilitate easy and local item exchanges.

5. **Revenue Model and Insurance**
   - Revenue generation options through rental fees.
   - Optional insurance for additional protection on rented items.

### Additional Features

- **User Privacy and Data Security**: Strong privacy measures protect user data throughout the platform.
- **Role-Based Access**: Supports multiple user roles:
  - **Admin**: Manages the platform and user activity.
  - **User**: Rents items and interacts with listings.
  - **Owner**: Lists items available for rent.
  - **Expert**: Inspects items to ensure quality and safety.
- **Error Handling and Logging**: Comprehensive error handling and logging help with debugging and platform reliability.

## Tech Stack

- **Backend**: Node.js
- **Database**: MySQL, managed via Sequelize ORM
- **Authentication**: JWT (JSON Web Tokens) for secure login and role management

## Environment Variables

Ensure the following environment variables are set to run the application:

```plaintext
JWT_SECRET=ASWE-RentItOut-Project-Very-Secure
JWT_EXPIRES_IN=24h
JWT_COOKIE_EXPIRES_IN_DAYS=90
EMAIL_USERNAME=worldsweet974@gmail.com
EMAIL_PASSWORD=jrsd tqyg jehd umch
DB_HOST=localhost
DB_USER=root
DB_PASS=
DB_PORT=3306
