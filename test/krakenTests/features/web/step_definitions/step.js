const { Given,When,Then} = require('@cucumber/cucumber');
const LoginPage = require('../pageObject/loginPage');
const RolesPage = require('../pageObject/rolesPage');
const ProyectosPage = require('../pageObject/proyectosGradoPage');
const LogOutPage = require('../pageObject/logoutPage');
const TeacherPage = require('../pageObject/teacherPage');
const OfferPage = require('../pageObject/offerPage');
const IncidentPage = require('../pageObject/incidentPage');


//Login steps
Given('I login with {string} and {string}', async function (username, password) {
    const loginPage = new LoginPage(this.driver);
    await loginPage.open();
    await loginPage.login(username, password);
    await loginPage.pauseForLogin(2000);
});

//Roles steps
When ('I go to Roles section', async function () { 
    const rolesPage = new RolesPage(this.driver);
    await rolesPage.goToRoles();
}); 

When ('I search for user {string}', async function (username) { 
    const rolesPage = new RolesPage(this.driver);
    await rolesPage.searchUser(username);
});

When ('I click in role assign', async function () { 
    const rolesPage = new RolesPage(this.driver);
    await rolesPage.goToAsignarRoles();
});

When ('I assign profesor role', async function () { 
    const rolesPage = new RolesPage(this.driver);
    await rolesPage.assignProfesorRole();
});

Then ('I check profesor role assigned', async function () { 
    const rolesPage = new RolesPage(this.driver);
    await rolesPage.checkProfesorRoleAssigned();
});

Then ('I remove profesor role', async function () { 
    const rolesPage = new RolesPage(this.driver);
    await rolesPage.assignProfesorRole();
});


When ('I assign coordinador role', async function () { 
    const rolesPage = new RolesPage(this.driver);
    await rolesPage.assignCoordinadorRole();
});

Then ('I check coordinador role assigned', async function () { 
    const rolesPage = new RolesPage(this.driver);
    await rolesPage.checkCoordinadorRoleAssigned();
});

Then ('I remove coordinador role', async function () { 
    const rolesPage = new RolesPage(this.driver);
    await rolesPage.assignCoordinadorRole();
});


When ('I clear search input', async function () { 
    const rolesPage = new RolesPage(this.driver);
    await rolesPage.clearSearch();
});

//Proyectos steps

When ('I go to Proyectos de Grado section student', async function () { 
    const proyectosPage = new ProyectosPage(this.driver);
    await proyectosPage.goToProyectosDeGrado();
    await proyectosPage.goToConsultarProyectos();
});


When ('I go to Proyectos de Grado section', async function () { 
    const proyectosPage = new ProyectosPage(this.driver);
    await proyectosPage.goToProyectosDeGrado();
    await proyectosPage.goToPublicarConsultarProyectos();
});

When ('I go to Crear Tema de Proyecto section', async function () { 
    const proyectosPage = new ProyectosPage(this.driver);
    await proyectosPage.goToCrearTemaProyecto();
}   );


//LogOut Page

When('I log out', async function () {
    const logoutPage = new LogOutPage(this.driver);
    await logoutPage.openProfileMenu();
    await logoutPage.clickLogout();
});


When('I click on the Coordinador tab', async function () {
    const logoutPage = new LogOutPage(this.driver);
    await logoutPage.clickCoordinadorTab();
});


When('I click on the Profesor tab', async function () {
    const logoutPage = new LogOutPage(this.driver);
    await logoutPage.clickProfesorTab();
});


Then('I click on Consultar programas de clases', async function () {
    const logoutPage = new LogOutPage(this.driver);
    await logoutPage.clickConsultarProgramas();
});

When ('I create a new Proyecto de Grado called {string} with description {string}', async function (titulo, descripcion) { 
    const proyectosPage = new ProyectosPage(this.driver);
    await proyectosPage.crearProyecto(titulo, descripcion);
}   );


Then ('I check the admin proyects and check if exist the project {string}', async function (name) { 
    const proyectosPage = new ProyectosPage(this.driver);
    await proyectosPage.adminProyects(name);
}   );

When('I click on Asistencias graduadas', async function () {
    const teacherPage = new TeacherPage(this.driver);
    await teacherPage.clickAsistenciasGraduadas();
});

When('I click on Crear oferta', async function () {
    const teacherPage = new TeacherPage(this.driver);
    await teacherPage.clickCrearOferta();
});

When(
  'I fill the offer with name {string}, description {string} and requirement {string}',
  async function (nombre, descripcion, requisito) {
    const offerPage = new OfferPage(this.driver);
    await offerPage.crearOfertaCompleta(nombre, descripcion, requisito);
  }
);

//Incident Page steps


When('I click on incident page', async function () {
    const incidentPage = new IncidentPage(this.driver);
    await incidentPage.goToIncidentPage();
});


When('I fill the incident form with the following description {string}', async function (description) {
    const incidentPage = new IncidentPage(this.driver);
    await incidentPage.fillIncident(description);
});
When('I publish the incident', async function () {
    const incidentPage = new IncidentPage(this.driver);
    await incidentPage.publishIncident();
});

When('I go to administracion incidents page', async function () {
    const incidentPage = new IncidentPage(this.driver);
    await incidentPage.goToAdministracionIncidents();
});

Then('I check the incident with description {string}', async function (description) {
    const incidentPage = new IncidentPage(this.driver);
    await incidentPage.verifyTheIncidentCreated(description);
});