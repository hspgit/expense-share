# Expense Share Frontend:

### Technologies Used:

- React
- Apollo GraphQL Client
- Chakra UI
- Recharts
- React Icons

#### Deployed at: https://client-expense-share.ue.r.appspot.com/

#### Server Deployed at: https://server-expense-share.ue.r.appspot.com/ (only accepts graphql requests)

### Requirements Fulfilled

- User interface with data by at least 2 CRUD operations (create, read, update, delete) for at least
  one database table
    - User can **create** expenses, **read** expenses and **delete** expenses.
    - User can create friend requests and update the request (accept/reject).
- At least 3 different UI routes (appearing to the user as different pages)
    - The application has three different routes:
        - `/expenses` - to view all expenses.
        - `/friends` - to view all friends and friend requests.
        - `/stats` - to view the summary statistics of the user.
- At least one Bootstrap UI component is not featured in the demo application
    - I have used Chakra UI (https://v2.chakra-ui.com/docs/components).
    - I have used many components from Chakra UI, such as `Button`, `Input`, `Modal`, `Avatar`,
      `Stat`, etc.
    - `Modal` is used to get user confirmation before deleting an expense and also used to enter
      user email address when adding friends.
    - `Toast` is used to show success or error messages to the user.
- Different layout and design from the demo application; it should not look like an obvious clone
    - The application has a different layout and design from the demo application.
- At least one of the following:
    - 3rd party library for React (not including React DnD, unless its use is completely different
      from the use in the demo project)
        - I have used:
            1. react-icons (https://react-icons.github.io/react-icons/)
            2. Recharts (https://recharts.org/en-US)
            3. chakra UI components (https://v2.chakra-ui.com/docs/components).
    - GraphQL interface to the database
        - I have used graphql for all api calls and mongoDB queries, using
          Apollo (https://www.apollographql.com/docs)
    - Significant use of Redux for all state handling (instead of useState)
        - NOT USED.

## Iteration 3

### Features
- The _Add expense_ form is now placed inside a modal which can be opened by clicking the
  "Add Expense" button.
- _Add Expense_ button is always visible on the expense page (fixed bottom right) along with a onHover
  animation.
- User can only share expenses if they have at least one friend added.
- Added client side filters to the expenses by category (one of six available) and share type
  (personal or shared).
- The Expense card now has a delete button to delete the expense. The delete button is only
  visible to the user who created the expense.
- Added a new `/stats` page to display user statistics. Stats include:
    - Total expenses in this month (with an indicator to depict change from last month)
    - Total shared expenses in this month (with an indicator to depict change from last month)
    - Friends added in this month (with an indicator to show active friends)
    - Bar chart showing all the expenses the user is involved in, grouped by category.

### Images

- Welcome screen for logged-out users
  ![Iteration 3 Welcome Screen](images/iter3-welcome-screen.png)

- Expenses page default view
  ![Iteration 3 Expenses Default](images/iter3-expenses-default.png)

- Expenses filtered by category/type
  ![Iteration 3 Filtered Expenses](images/iter3-filtered-expenses.png)

- No results when filters have no matches
  ![Iteration 3 Filtered No Expenses](images/iter3-filtered-no-expenses.png)

- Friends page listing and requests
  ![Iteration 3 Friends Page](images/iter3-friends-page.png)

- Sharing disabled when no friends added
  ![Iteration 3 Disabled Sharing](images/iter3-disabled-sharing.png)

- Statistics page with charts and KPIs
  ![Iteration 3 Stats Page](images/iter3-stats-page.png)

<hr style="height:4px; background-color:#e61212; border:none;" />

## Iteration 2

### Features

- Add URL routing to navigate between different pages expenses(`/expenses`), friends(`/friends`).
- Supports adding expenses with multiple users as participants.
- Now the expense page filters expenses by the user's Google ID if they are a participant in the
  expense.
- The Expense list is more intuitive and clearly displays the expense summary.

### Images

- new-home-with-shared-expenses
  ![Expenses Page](images/new-home-with-shared-expenses.png)

- new shared expense form
  ![New Shared Expense Form](images/new-shared-expense-form.png)

- new friends page
  ![Friends Page](images/iter2-friends-page-route.png)

<hr style="height:4px; background-color:#e61212; border:none;" />

## Iteration 1

### Features

- This is the frontend service for the Expense Share application, which provides a user interface
  for managing expenses and friends and interacting with the backend.
- It is built using React and Apollo Client to communicate with a GraphQL backend.
- Uses Chakra UI for styling and layout.

### Installation & Usage

1. Clone the repository and navigate to the `client` directory:
2. Set these environment variables in a `.env` file:
    - VITE_GRAPHQL_APP_BASE_URL=http://localhost:4000
    - VITE_GOOGLE_CLIENT_ID=your-google-client-id

3. Run the following commands to install dependencies and start the application:
   ```bash
    npm install
    npm run dev
    ```
4. React application will be available at `http://localhost:3000`.

### Images

![Login/Welcome Screen](images/logged-out.png)
*Welcome screen shown to users who are not logged in*

![Empty Expenses](images/expenses-empty.png)
*Expenses page when no expenses have been recorded*

![Expenses with Data](images/expenses-filled.png)
*Expenses page populated with expense records and data*

![Empty Friends List](images/friends-empty.png)
*Friends page when no friends have been added yet*

![Add Friend Popup](images/add-friend-popup.png)
*Modal popup for adding new friends to your network*

![Outgoing Friend Request](images/outgoing-request.png)
*Display of sent friend requests awaiting approval*

![Incoming Friend Request](images/incoming-request.png)
*Notification for pending incoming friend requests*

![Friend Successfully Added](images/added-friend.png)
*Confirmation screen after successfully adding a friend*
