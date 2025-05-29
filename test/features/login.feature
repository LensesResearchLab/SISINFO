Feature: User Login

  Scenario: Successful login with valid credentials
    Given the user navigates to the login page
    When the user enters "admin@admin.com" into the "email" field
    And the user enters "admin" into the "password" field
    And the user clicks the "Iniciar Sesión" button
    Then the user should be redirected to the main page
