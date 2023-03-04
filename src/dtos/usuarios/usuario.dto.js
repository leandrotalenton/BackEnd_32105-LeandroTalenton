export class GetMeDTO {
  constructor({ username, email, age, phone, pic, address }) {
    this.nombre = username;
    this.email = email;
    this.edad = age;
    this.tel = phone;
    this.pic = pic;
    this.direccion = address;
  }
}
