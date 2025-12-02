Feature: My feature

@user1@web
Scenario: Crear asistencia graduada y verificarla
  Given I login with "ca.escobar2434@uniandes.edu.co" and "123"
  When I click on Asistencias graduadas
  When I click on Crear oferta
  When I fill the offer with name "Asistencia de DB", description "Descripción detallada" and requirement "Conocimiento básico de SQL"







