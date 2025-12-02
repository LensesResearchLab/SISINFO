class RolesPage {
    constructor(driver) {
        this.driver = driver;
    }

    get btnConsultarRoles() {return this.driver.$('[aria-label="Ir a Consultar usuarios y roles"]');}
    get btnAsignarRoles() { return this.driver.$('button=Asignar roles'); }
    get inputSearchUser() { return this.driver.$('[placeholder="Buscar..."]'); }
    get profesorRole() { return this.driver.$('//div[@role="menuitemcheckbox" and contains(., "Profesor")]'); }
    get checkProfesorRole(){return this.driver.$('span=Profesor');}
    get coordinadorRole() { return this.driver.$('//div[@role="menuitemcheckbox" and contains(., "Coordinador")]'); }
    get checkCoordinadorRole(){return this.driver.$('span=Coordinador');}
    

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
    
}

module.exports = RolesPage;