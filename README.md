# Warehouse Management System – Technical Overview

## 1. User Management (Single Page)

* The user creation page contains the following fields: **role, username, and password**.
* The **role** is assigned by the backend as a default value during user creation.
* When a user is saved, all details are stored securely in the database.
* The backend response returns user information **without the password** for security reasons.

## 2. Login Module

* The login page includes only two fields: **username** and **password**.
* On login, the frontend calls a backend API to validate the user credentials against the database.
* If the credentials are valid:

  * The backend returns a response with a **session invalidation key**, ensuring that a user can be logged in from **only one session at a time** using the same username.
  * User details (excluding the password) are stored in **localStorage** so they can be accessed across other components.
* For security:

  * The backend uses **DTOs (Data Transfer Objects)** to restrict requests and responses to only required fields (username, password, role).
  * All passwords are **encrypted** before being stored in the database.

## 3. Dashboard Page

* The dashboard includes:

  * A button to **add new products**.
  * Summary boxes displaying:

    * Total stock value
    * Low stock items
    * Out-of-stock items
* A table displays all warehouse product data with the following columns:

  * **SKU, Name, Quantity, Actions**
* The **Actions** column includes:

  * **View** button to see product details in a separate component (`dashboard-detail`).
  * **Delete** button, which is **visible and accessible only to admin users** to prevent accidental or unauthorized data loss.

## 4. Route Protection (Angular Auth Guard)

* An **Auth Guard** is implemented in Angular.
* If a user tries to access protected routes (such as product or dashboard pages) without being logged in, they are automatically redirected to the **login page**.

## 5. API Security (Auth Interceptor)

* An **HTTP Auth Interceptor** is used in Angular for all API calls.
* If the backend returns a **session invalid** response:

  * An alert message is shown to the user.
  * The user is prevented from using APIs and UI actions until they log in again.

## 6. Product Detail Page (Dashboard Detail)

* The `dashboard-detail` component supports **creating and updating** product data.
* Fields included:

  * SKU
  * Product Name
  * Category
  * Price
  * Quantity
* The page includes two buttons:

  * **Save** – to create or update product details
  * **Cancel** – to discard changes and return to the dashboard

## 7. Backend APIs Used

* **GET** – Retrieve user and product data
* **POST** – Create users and products
* **DELETE** – Remove products (admin only)

## 8. Backend Security Configuration

* The backend uses **Spring Security** with `SecurityFilterChain` to handle authentication and authorization requests from the frontend.

## 9. Global Exception Handling (Detailed Explanation)

* The backend uses a **Global Exception Handler** to manage errors in a centralized and consistent way.
* Instead of handling errors separately in each controller, this approach ensures that all runtime errors are processed in **one common place**.

### Why Global Exception Handling is Used

* Improves **code cleanliness** by avoiding repeated try-catch blocks in controllers.
* Provides **consistent error responses** to the frontend.
* Helps the frontend easily display meaningful error messages to users.
* Improves **debugging and maintenance**.

### How It Works

* When any `RuntimeException` occurs in the backend (for example: invalid login, product not found, unauthorized delete request):

  * The exception is automatically caught by the Global Exception Handler.
  * A proper HTTP response is returned to the frontend with an error message.

### Code Used

```java
@ExceptionHandler(RuntimeException.class)
public ResponseEntity<String> handleRuntimeError(RuntimeException ex) {
    return ResponseEntity.badRequest().body(ex.getMessage());
}
```

### Explanation of the Code

* `@ExceptionHandler(RuntimeException.class)`:

  * Catches all RuntimeExceptions across the application.
* `handleRuntimeError(RuntimeException ex)`:

  * Receives the exception details.
* `ResponseEntity.badRequest()`:

  * Returns HTTP 400 Bad Request.
* `ex.getMessage()`:

  * Sends a readable error message to the Angular UI.

### Example Scenarios

* Wrong username or password.

* Session invalid or expired.

* Unauthorized admin-only delete attempt.

* This mechanism ensures **secure, user-friendly, and controlled error handling** across the entire application.

## 10. Data Visualization & Analytics

* The dashboard includes a real-time analytics layer for better decision-making.
* **Interactive Category Chart**:

  * Implemented using **Chart.js** to visualize inventory distribution by category.
* **Summary Analytics Cards**:

  * **Total Inventory Value**: Calculated using `Price × Quantity`.
  * **Low Stock Count**: Items with quantity below 5.
  * **Out-of-Stock Count**: Items with zero quantity.
* **Conditional Styling**:

  * Low-stock quantities are highlighted in **bold red text** in the product table.

## 11. Tech Stack Details

* **Frontend**: Angular 17/18, TypeScript, Bootstrap 5, Chart.js.
* **Backend**: Java 17, Spring Boot 3, Spring Data JPA, Spring Security.
* **Database**: MySQL 8.0.
* **Build Tools**: Maven (Backend), npm (Frontend).

## 12. Local Setup Instructions

### Prerequisites

* JDK 17 or higher
* Node.js v18 or higher
* MySQL Server

### Backend Setup

* Configure database credentials in `src/main/resources/application.properties`.
* Run `mvn spring-boot:run`.
* Backend runs on `http://localhost:8080`.

### Frontend Setup

* Navigate to the frontend directory.
* Run `npm install`.
* Run `ng serve`.
* Access the app at `http://localhost:4200`.
* `handleRuntimeError(RuntimeException ex)`:

  * This method receives the actual exception object.
* `ResponseEntity.badRequest()`:

  * Sends an HTTP **400 Bad Request** status to the frontend.
* `ex.getMessage()`:

  * Returns a clear and readable error message, which is shown in the Angular UI.

### Example Scenarios

* Wrong username or password → returns a login error message.

* Session invalid or expired → frontend interceptor shows an alert and blocks actions.

* Admin-only delete attempted by a normal user → returns an authorization error.

* This mechanism ensures **secure, user-friendly, and controlled error handling** across the entire application.
