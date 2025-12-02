class LoginPage {
    constructor(driver) {
        this.driver = driver;
    }

    get inputUsername() { return this.driver.$('#email'); }
    get inputPassword() { return this.driver.$('#password'); }
    get btnLogin() { return this.driver.$('button=Iniciar Sesión'); }

    async open() {
        await this.driver.url('http://localhost:3000/auth');
    }

    async login(username, password) {
        await (await this.inputUsername).setValue(username);
        await (await this.inputPassword).setValue(password);
        await (await this.btnLogin).click();
    }
    async pauseForLogin(miliseconds){
        await this.driver.pause(miliseconds);
    }
}

module.exports = LoginPage;