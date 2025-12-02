class IncidentPage {
    constructor(driver) {
        this.driver = driver;
    }

    get btnIncidentLeftPanel() { return this.driver.$('a[aria-label="Ir a Reporte de incidencias"]'); }
    get incidentsTypeDropdown() { return this.driver.$("//button[@role='combobox' and .//span[normalize-space()='Seleccione el tipo']]");; }
    get incidentTypeOption() { return this.driver.$('.//div[normalize-space()="Error en el sistema"]'); }
    get incidentDescription() {return this.driver.$('//textarea[@data-slot="textarea" and @placeholder="Describa el problema que presentó..." and @wrap="soft"]'); }
    get publishButton() { return this.driver.$('//button[@data-slot="button" and normalize-space()="Publicar"]'); }
    get confirmPublishButton() { return this.driver.$('//button[@type="button" and normalize-space()="Confirmar"]'); }
    get acceptPublishButton() { return this.driver.$('//button[normalize-space()="Aceptar"]'); }
    get administracionPageButton() { return this.driver.$('//button[@data-slot="collapsible-trigger" and @data-sidebar="menu-button" and normalize-space()="Administracion"]'); }
    get seeIndidentsButton() { return this.driver.$('//a[@data-slot="sidebar-menu-sub-button" and @data-sidebar="menu-sub-button" and @href="/inicio//administrador/incidencia" and .//span[normalize-space()="Ver incidencias"]]'); }

    async goToIncidentPage() {
        await (await this.btnIncidentLeftPanel).click();
        await this.driver.pause(2000);
    }

    async fillIncident(description) {
        await (await this.incidentsTypeDropdown).click();
        await this.driver.pause(1000);
        await (await this.incidentTypeOption).click();
        await this.driver.pause(1000);
        await (await this.incidentDescription).setValue(description);
        await this.driver.pause(1000);
    }

    async publishIncident() {
        await (await this.publishButton).click();
        await this.driver.pause(1000);
        await (await this.confirmPublishButton).click();
        await this.driver.pause(2000);
        await (await this.acceptPublishButton).click();
        await this.driver.pause(2000);
    }

    async goToAdministracionIncidents() {
        await (await this.administracionPageButton).click();
        await this.driver.pause(1000);
        await (await this.seeIndidentsButton).click();
        await this.driver.pause(2000);
    }

    async verifyTheIncidentCreated(description) {
        const elements = await this.driver.$(`//td[@data-slot="table-cell" and contains(normalize-space(.), "${description}")]`);
        console.log(elements);
    }


}

module.exports = IncidentPage;