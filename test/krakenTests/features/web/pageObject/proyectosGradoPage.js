class RolesPage {
    constructor(driver) {
        this.driver = driver;
    }

    get titleProyectoGrado(){ return this.driver.$('input[name="title"]');}
    get detailDescriptionProyectoGrado(){return this.driver.$('textarea[placeholder="Describe los objetivos, metodología y alcance del proyecto..."]') }
    get categoryOptions(){ return this.driver.$('//button[@role="combobox"][.//span[contains(text(), "Selecciona una categoría")]]');}
    get typeOfCategories(){return this.driver.$('div[data-radix-popper-content-wrapper]'); }
    get tagOptions(){ return this.driver.$('//button[@role="combobox" and .//span[contains(text(),"Agregar etiqueta")]]'); }
    get typeOfTags(){ return this.driver.$('.//div[normalize-space()="Inteligencia artificial"]'); }
    get publishProyect(){return this.driver.$('//button[normalize-space()="Publicar Proyecto"]'); }
    get confirmPublishProyect() {return this.driver.$('//div[@data-slot="alert-dialog-content" and @data-state="open"]//button[normalize-space()="Publicar Proyecto"]');}
    get btnAceptar() {return this.driver.$('//button[normalize-space()="Aceptar"]');}
    get btnAdminAccordion() {return this.driver.$('//button[@data-slot="accordion-trigger" and .//span[contains(normalize-space(.),"admin@admin.com")]]');}

    



    get btnPanelProyectoGrado() {
  return this.driver.$('//button[.//span[contains(translate(text(),"ABCDEFGHIJKLMNOPQRSTUVWXYZÁÉÍÓÚ","abcdefghijklmnopqrstuvwxyzáéíóú"),"proyecto de grado")]]');
}
    get btnConsultarPublicarProyectos() {return this.driver.$('a=Publicar y consultar proyectos de pregrado');}
    get btnConsultarProyectos() {return this.driver.$('a=Consultar temas');}
    get btnCrearTemaProyecto() {return this.driver.$('button=Crear tema');}

    async login(username, password) {
        await (await this.inputUsername).setValue(username);
        await (await this.inputPassword).setValue(password);
        await (await this.btnLogin).click();
    }
    async goToRoles(){
        await (await this.btnConsultarRoles).click();

    }
    async goToAsignarRoles(){
        await (await this.btnAsignarRoles).click();
        await this.driver.pause(2000);
    }

    async searchUser(username){
        await (await this.inputSearchUser).setValue(username);
        await this.driver.pause(2000);
    }

    async assignProfesorRole(){
        await (await this.profesorRole).click();
        await this.driver.pause(2000);
    }


    async assignCoordinadorRole(){
        await (await this.coordinadorRole).click();
        await this.driver.pause(2000);
    }

    //Check if exist if not exist is impossible to click
    async checkProfesorRoleAssigned() {
    const badge = await this.checkProfesorRole;
    await badge.click();
}


async checkCoordinadorRoleAssigned() {
    const badge = await this.checkCoordinadorRole;
    await badge.click();
}
    async clearSearch(){
        await (await this.inputSearchUser).clearValue();
        await this.driver.pause(2000);
    }

    async goToProyectosDeGrado(){
        await (await this.btnPanelProyectoGrado).click();
        await this.driver.pause(2000);
    }
    
    async goToPublicarConsultarProyectos(){
        await (await this.btnConsultarPublicarProyectos).click();
        await this.driver.pause(2000);
    }

    async goToCrearTemaProyecto(){
        await (await this.btnCrearTemaProyecto).click();
        await this.driver.pause(2000);
    }

    async goToConsultarProyectos(){
        await (await this.btnConsultarProyectos).click();
        await this.driver.pause(2000);
    }

    async crearProyecto(titulo, descripcion) {
        await (await this.titleProyectoGrado).setValue(titulo);
        await this.driver.pause(2000);
        await (await this.categoryOptions).click();  
        await this.driver.pause(2000);
        await (await this.typeOfCategories).click();
        await (await this.tagOptions).click();
        await this.driver.pause(2000);
        await (await this.typeOfTags).click();
        await this.driver.pause(2000);
        await (await this.detailDescriptionProyectoGrado).setValue(descripcion);
        await this.driver.pause(2000);
        await (await this.publishProyect).click();
        await this.driver.pause(2000);
        await (await this.confirmPublishProyect).click();
        await this.driver.pause(2000);
        await (await this.btnAceptar).click();
        await this.driver.pause(2000);

    }

    async adminProyects(name){
        await (await this.btnAdminAccordion).click();
        await this.driver.pause(5000);
        const selector = `//table//td[contains(normalize-space(.),"${name}")]`;
        const existe = await (await this.driver.$(selector)).isExisting();

    }

    
}

module.exports = RolesPage;