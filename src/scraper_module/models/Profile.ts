export class Profile {
  constructor(
    public email: string,
    public emailUrl: string,
    public password: string,
    public firstName: string,
    public lastName: string,
    public dateOfBirth: Date,
    public gender: string,
    public bio: string,
    public state: string,
  ) {}
}
