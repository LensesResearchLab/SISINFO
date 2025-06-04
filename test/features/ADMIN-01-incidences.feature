Feature: See all incidences as administrator

  Scenario: Navigate to "View Incidents" under the Administrator section and see all incidences
    Given I am logged in as an "administrator"
    And the "Administracion" menu is expanded
    When I click on the "Ver incidencias" option
    Then I should be redirected to the incidents page
    And the incidents page should be visible