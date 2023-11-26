export class UserDTO {
  userId!: number;
  name: string;
  surname: string;
  mail: string;
  password: string;

  constructor(name: string, surname: string, mail: string, password: string) {
    this.name = name;
    this.surname = surname;
    this.mail = mail;
    this.password = password;
  }
}
