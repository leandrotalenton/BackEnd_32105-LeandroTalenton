export class GetMeDTO {
    constructor({username, email, age, phone, pic}) {
        this.nombre = username;
        this.email = email;
        this.edad = age;
        this.tel = phone;
        this.pic = pic;
    }
}
