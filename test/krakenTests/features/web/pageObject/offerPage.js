class OfferPage {
    constructor(driver) {
        this.driver = driver;
    }

    async fillNombre(nombre) {
        const input = await this.driver.$('//textarea[@placeholder="Escribe el título aquí..."]');
        await input.waitForDisplayed({ timeout: 10000 });
        await input.setValue(nombre);
    }

    async fillDescripcion(descripcion) {
        const input = await this.driver.$('//textarea[@placeholder="Describe la asistencia"]');
        await input.waitForDisplayed({ timeout: 10000 });
        await input.setValue(descripcion);
    }

    async selectClasificacion() {
        const dropdownButton = await this.driver.$('button[role="combobox"]');    
        await dropdownButton.waitForDisplayed({ timeout: 10000 });
        await dropdownButton.click(); 
        await this.driver.pause(1000); 
        const primeraOpcion = await this.driver.$('//div[@role="option"]'); 
        await primeraOpcion.waitForDisplayed({ timeout: 10000 });
        await primeraOpcion.click(); 
        await this.driver.pause(1000); 
    }

    async addRequisito(requisito) {
        const input = await this.driver.$('//input[@placeholder="Escribe un requisito..."]');
        await input.waitForDisplayed({ timeout: 10000 });
        await input.setValue(requisito);

        const btn = await this.driver.$('//button[contains(.,"Agregar")]');
        await btn.waitForDisplayed({ timeout: 10000 });
        await btn.click();
        await this.driver.pause(3000)
    }

    async publishAsistencia() {
        const btnPublicar = await this.driver.$('//button[contains(.,"Publicar asistencia")]');
        await btnPublicar.waitForDisplayed({ timeout: 10000 });
        await btnPublicar.click();
        await this.driver.pause(1000); 

        const btnAceptarModal = await this.driver.$('//div[@data-slot="alert-dialog-footer"]//button[normalize-space(.)="Publicar asistencia"]'); 
        await btnAceptarModal.waitForDisplayed({ timeout: 10000 });
        await btnAceptarModal.click();
        
        await this.driver.pause(3000); // Espera a que el modal de ÉXITO aparezca

        const btnAceptarExito = await this.driver.$('//button[normalize-space(.)="Aceptar"]'); 
        await btnAceptarExito.waitForDisplayed({ timeout: 15000, interval: 500 }); 
        await btnAceptarExito.click();
        
        await this.driver.pause(1000); 
    }

    async crearOfertaCompleta(nombre, descripcion, requisito) {
        await this.fillNombre(nombre);
        await this.fillDescripcion(descripcion);
        await this.selectClasificacion();
        await this.addRequisito(requisito);
        await this.publishAsistencia();
        await this.driver.pause(3000)
    }
}

module.exports = OfferPage;
