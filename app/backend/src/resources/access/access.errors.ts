import { ExpectedError, UnexpectedError } from "src/utils/app.errors";

export class DefaultAccessNotDefined extends UnexpectedError {}

export class LoginNotExists extends ExpectedError { constructor(){super("Login de acesso não encontrado.")} }
export class WrongPassword extends ExpectedError { constructor(){super("Senha de acesso incorreta.")} }