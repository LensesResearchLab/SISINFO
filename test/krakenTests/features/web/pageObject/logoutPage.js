class LogOutPage {
    constructor(driver) {
        this.driver = driver;
    }


    async openProfileMenu() {
        // Selecciona el div que contiene el nombre y correo del usuario
        const profileMenu = await this.driver.$('div.grid.flex-1.text-left.text-sm.leading-tight');
        
        await profileMenu.waitForDisplayed({ timeout: 10000 });
        await profileMenu.scrollIntoView();
        await profileMenu.click();
    }

    async clickLogout() {
        // Selecciona el enlace "Cerrar sesión" dentro del dropdown
        const logoutLink = await this.driver.$('//a[normalize-space()="Cerrar sesión"]');
        await logoutLink.waitForDisplayed({ timeout: 10000 });
        await logoutLink.scrollIntoView();
        await logoutLink.click();
}

    async clickCoordinadorTab() {
    const coordinadorButton = await this.driver.$('//button[normalize-space()="Coordinador"]');
    await coordinadorButton.waitForDisplayed({ timeout: 10000 });
    await coordinadorButton.scrollIntoView();
    await coordinadorButton.click();
    await this.driver.pause(5000)
}

    async clickProfesorTab() {
    const coordinadorButton = await this.driver.$('//button[normalize-space()="Profesor"]');
    await coordinadorButton.waitForDisplayed({ timeout: 10000 });
    await coordinadorButton.scrollIntoView();
    await coordinadorButton.click();
    await this.driver.pause(5000)
}

    async clickConsultarProgramas() {
        const card = await this.driver.$('h3=Consultar programas de clases');
        await card.waitForDisplayed({ timeout: 5000 });
        await card.click();
        await this.driver.pause(5000)
    }



}

module.exports = LogOutPage;
