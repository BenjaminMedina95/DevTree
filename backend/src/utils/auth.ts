import bcrypt from 'bcrypt';

export const hashPassword = async (password : string) =>{
    const salt = await bcrypt.genSalt(10); // Genera cadenas aleatorias para almacenar hasheado en bd 
    return await bcrypt.hash(password, salt); // Hashea el password con la cadena aleatoria generada
    
}

export const checkPassword = async (enterPassword : string, hash : string) =>{
    return await bcrypt.compare(enterPassword, hash); // Compara el password ingresado con el hash
   
    
}