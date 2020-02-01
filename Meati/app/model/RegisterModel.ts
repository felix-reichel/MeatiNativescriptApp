export class RegisterModel {
    username: string;
    password: string;
    password2: string;
    email: string;
    firstname: string;
    lastname: string;
    dateOfBirth: string;
    gender: string;
  
    constructor() {
        this.username = "",
        this.password = "",
        this.password2 = "",
        this.email = "",
        this.firstname = "",
        this.lastname = "",
        this.gender = "M"
        this.dateOfBirth = ""
    }
}