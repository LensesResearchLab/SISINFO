Feature: My feature

@user1@web
Scenario: Report Incidents
  Given I login with "ca.escobar2434@uniandes.edu.co" and "123"
  When I click on incident page
  When I fill the incident form with the following description "La pagina esta incompleta"
  When I publish the incident
  When I log out
  Given I login with "admin@admin.com" and "admin"
  When I go to administracion incidents page
  Then I check the incident with description "La pagina esta incompleta"
