Feature: My feature

@user1@web
Scenario: Crear proyectos de grado
  Given I login with "admin@admin.com" and "admin"
  When I go to Proyectos de Grado section
  When I go to Crear Tema de Proyecto section
  When I create a new Proyecto de Grado called "Nuevo Proyecto 1" with description "Esto es un proyecto de prueba"
  When I log out
  Given I login with "n.camargop@uniandes.edu.co" and "123"
  When I go to Proyectos de Grado section student
  Then I check the admin proyects and check if exist the project "Nuevo Proyecto 1"
  When I log out
  Given I login with "admin@admin.com" and "admin"
  When I go to Proyectos de Grado section
  When I go to Crear Tema de Proyecto section
  When I create a new Proyecto de Grado called "Nuevo Proyecto 2" with description "Esto es un proyecto de prueba 2"
  When I log out
  Given I login with "n.camargop@uniandes.edu.co" and "123"
  When I go to Proyectos de Grado section student
  Then I check the admin proyects and check if exist the project "Nuevo Proyecto 2"




  

