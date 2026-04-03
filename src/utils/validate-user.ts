import { AppError } from "../errors/AppError";

export function validateUser(userId: string, compareId: string){
    if (userId !== compareId){
        throw new AppError("Acesso negado", 403)
    }
}