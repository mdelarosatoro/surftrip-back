export class SurfcampDto {
    readonly email: string;
    readonly username: string;
    readonly password: string;
    readonly name: string;
    readonly description: string;
    readonly lastName: string;
    readonly location: string;
    readonly skillLevels: [string];
}

export class SurfcampLoginDto {
    readonly username: string;
    readonly password: string;
}
