import { ExpectedError, UnexpectedError } from "src/utils/app.errors";

export class DefaultAccessNotDefined extends UnexpectedError {}

export class LoginNotExists extends ExpectedError { constructor(){super("Login de accesso não encontrado.")} }
export class WrongPassword extends ExpectedError { constructor(){super("Senha de accesso incorreta.")} }