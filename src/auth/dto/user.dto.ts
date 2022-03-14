export class UserDto {
    readonly email: string;
    readonly username: string;
    readonly password: string;
    readonly name: string;
    readonly lastName: string;
}

export class UserLoginDto {
    readonly username: string;
    readonly password: string;
}
