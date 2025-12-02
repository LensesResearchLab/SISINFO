class TeacherPage {
    constructor(driver) {
        this.driver = driver;
    }

    async clickAsistenciasGraduadas() {
        const menu = await this.driver.$('//span[normalize-space()="Asistencias graduadas"]');
        await menu.waitForDisplayed({ timeout: 10000 });
        await menu.click();
        await this.driver.pause(1000); // Espera a que se despliegue el submenú
    }

    async clickCrearOferta() {
        const crearOferta = await this.driver.$('//a[normalize-space()="Crear oferta"]');
        await crearOferta.click();
        
        await this.driver.pause(1000);
    }
}

module.exports = TeacherPage;
