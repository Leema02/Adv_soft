# RentItOut  ℹ️

Welcome to **RentItOut** – a backend API designed to support a rental marketplace where users can list and rent everyday items. This project promotes a circular economy, enabling users to rent out items they own but rarely use, such as tools, sports equipment, and party supplies, to others in their community.

## Features

### Core Features ✨

1. **Item Listings for Rent**
   - Users can list a variety of items across categories like tools, electronics.
   - by default the users list items by their location
   - Users can list items by filtering them on their prices and sort them by loyality of their owners.

2. **Rental Management and Pricing**
   - Flexible rental durations and pricing options.
   - Customizable rental periods to accommodate different rental needs.

3. **Trust, Safety, and Verification**
   - Security deposits and damage protection options for item security.
   - Users can make reviews after any rent they do 
   - every owner will have a rate which taken from reviews of users, so the system is more reliable.

4. **Logistics (Delivery and Pickup)**
   - Supports both in-person pickups and delivery options.
   - Location-based features to facilitate easy and local item exchanges.

5. **Revenue Model**
   - Revenue generation using commision taken by every rent.
   - can generate income reports for day , month , year

   


### Additional Features ⭐

- **User Privacy and Data Security**: Strong privacy measures protect user data throughout the platform by encrypting their password usign argon.
- **Role-Based Access**: Supports multiple user roles:
  - **Admin**: Manages the platform and user activity.
  - **User**: Rents items and interacts with listings.
  - **Owner**: Item management and can open inspections if there is an dispute between owner and user after rent
  - **Expert**: Inspects items to ensure quality and safety.
- **Error Handling**: Comprehensive error handling by applying middlewares for every api request to our endpoints

## External API 📝

1. **Foursquare API**

Purpose: To provide location-based services, such as fetching nearby pickup locations for users based on their current coordinates.
Usage: The Foursquare API is utilized to enhance the user experience by enabling users to search for nearby places, such as pickup points or service centers, within a specified radius. This integration ensures that users receive real-time information and recommendations for locations close to their specified latitude and longitude.

2. **Nodemailer**

Purpose: To handle automated email communication within the application.
Usage: Nodemailer is used to send notification emails to users and admins. This includes sending confirmation emails for deliveries, pickup requests, and rental transactions. The use of Nodemailer helps maintain seamless and timely communication, ensuring users receive important updates directly to their inboxes.

## Tools And Libraries 🛠️
 - Node.Js 
 - Express.Js 
 - MySql 
 - Sequelize
 - JWT 
 - Argon 
 - Express Validator
 - WebStorm and VsCode
 - Axios
 - Github

## Api Documentation 📄
You can see our api documenation (wiki) using postman [here](https://documenter.getpostman.com/view/39143337/2sAY518Kpm#3c3d74e7-0ba3-4731-a9d0-bfd76a9f660f)

## Getting Started 🚀

Follow these steps to set up the project on your local machine:

1. Clone the Repository
   ```bash
   git clone https://github.com/MaiSalameh/RentItOut.git
   cd RentItOut```

2. Ensure the following environment variables are set to run the application:

```plaintext
JWT_SECRET=
JWT_EXPIRES_IN=
JWT_COOKIE_EXPIRES_IN_DAYS=
EMAIL_USERNAME=
EMAIL_PASSWORD=
DB_HOST=
DB_USER=
DB_PASS=
DB_PORT=
```
3. Install Dependencies
    ```bash
    npm install
    ```
4. Build Database
    ```bash
    node db_assiocations/assiocations
    ```
5. Run the Application
    ```bash
    nodemon app
    ```
## For More Detalis
if you want to read more specfic detalis about the project you can jump to our [wiki](https://github.com/MaiSalameh/RentItOut/wiki)
