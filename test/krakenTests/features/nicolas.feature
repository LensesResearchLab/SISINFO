Feature: My feature

@user1@web
Scenario: Assign roles for each user
  Given I login with "admin@admin.com" and "admin"
  When I go to Roles section
  When I search for user "Camilo Andres Escobar Velasquez"
  When I click in role assign
  When I assign coordinador role
  Then I log out
  Given I login with "ca.escobar2434@uniandes.edu.co" and "123"
  When I click on the Profesor tab
  When I click on the Coordinador tab
  Then I click on Consultar programas de clases
  Then I log out
  Given I login with "admin@admin.com" and "admin"
  When I go to Roles section
  When I search for user "Camilo Andres Escobar Velasquez"
  When I click in role assign
  When I assign coordinador role







