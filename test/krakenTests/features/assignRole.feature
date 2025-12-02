Feature: My feature

@user1@web
Scenario: Assign roles for each user
  Given I login with "admin@admin.com" and "admin"
  When I go to Roles section
  When I search for user "Natalia Franco Tamara"
  When I click in role assign
  When I assign profesor role
  Then I check profesor role assigned
  When I click in role assign
  Then I remove profesor role
  When I clear search input
  When I search for user "Juan Pablo Fernandez Ramirez"
  When I click in role assign
  When I assign profesor role
  Then I check profesor role assigned
  When I click in role assign
  Then I remove profesor role
  When I clear search input
  When I search for user "Camilo Andres Escobar Velasquez"
  When I click in role assign
  When I assign coordinador role
  Then I check coordinador role assigned
  When I click in role assign
  Then I remove coordinador role
  When I clear search input
  When I search for user "Mario Linares Vasquez"
  When I click in role assign
  When I assign coordinador role
  Then I check coordinador role assigned
  When I click in role assign
  Then I remove coordinador role