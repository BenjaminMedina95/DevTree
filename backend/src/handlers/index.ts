
import type {Request, RequestHandler, Response} from 'express';
import slug from 'slug'
import User from "../models/User";
import formidable from "formidable"
import {v4 as uuid} from "uuid"
import { checkPassword, hashPassword } from '../utils/auth';
import { validationResult } from 'express-validator';
import { generateJWT } from '../utils/jwt';
import cloudinary from '../config/cloudinary';

export const  createAccount =  async (req: Request, res: Response) => {
     
    const {email, password} = req.body;

    //Validacion de usuario duplicado
    const UserExists = await User.findOne({email}); //Filtra los registros que coincidan con el email ingresado
    if(UserExists){
        const error = new Error('El Usuario ya esta registrado')
         res.status(409).json({error:error.message})    
         return
    }
    
    //Comprobacion de hanlde
    const handle = slug (req.body.handle, '')
    const handleExists = await User.findOne({handle}); //Filtra los registros que coincidan con el email ingresado
    if(handleExists){
        const error = new Error('Nombre de usuario no disponible')
         res.status(409).json({error:error.message})    
         return
    }
    
    //Usamos e insertamos a la base de datos
    const user = new User(req.body);
    user.password= await hashPassword(password);  
    user.handle = handle
    

    await user.save() //crea un nuevo usuario
    res.status(201).send ('Registro creado exitosamente')
    return  
   
}

export const login = async (req: Request, res: Response) => {
    
    //Manejar errores

     let errors = validationResult(req);
    
     if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return 
     }

     const {email, password} = req.body;

      //Revisar si el usuario esta registrado
    const user = await User.findOne({email}); //Filtra los registros que coincidan con el email ingresado
    if(!user){
        const error = new Error('El Usuario no existe')
         res.status(404).json({error:error.message})    
         return
    }

    //Comprobar el password

    const isPasswordCorrect= await checkPassword(password,user.password)
    if(!isPasswordCorrect){
        const error = new Error('Password Incorrecto')
         res.status(401).json({error:error.message})    
         return
    }

    const token = generateJWT({id: user._id})

    res.send(token)
    
}

export const getUser= async (req: Request, res: Response) => {
   
    res.json(req.user)  
    
}

export const updateProfile = async (req: Request, res: Response) => {

    try {
        const {description, links} = req.body
        const handle = slug (req.body.handle, '')
        const handleExists = await User.findOne({handle}); //Filtra los registros que coincidan con el email ingresado
        if(handleExists &&  handleExists.email !== req.user.email){
            const error = new Error('Nombre de usuario no disponible')
             res.status(409).json({error:error.message})    
             return
        }

        //Actualizar el usuario
        req.user.description = description
        req.user.handle = handle
        req.user.links = links
        await req.user.save()
        res.send('Perfil Actualizado Correctamente')
        
    } catch (e) {
        const error = new Error ('Hubo un error')
         res.status(500).json({error: error.message})
        
    }

}
//Subir imagen 

export const uploadImage = async (req: Request, res: Response) => {
    const form = formidable({multiples:false})

    try {
        form.parse(req,(error, fields, files) =>{
            console.log();

            cloudinary.uploader.upload(files.file[0].filepath,{public_id: uuid()},async function(error,result){

                if(error){
                    const error = new Error ('Hubo un error al subir la imagen')
                    res.status(500).json({error: error.message})
                }
                if(result){
                    req.user.image = result.secure_url
                    await req.user.save()
                    res.json({image: result.secure_url})
                }    
            })      
    }) 
        
    } catch (e) {
        const error = new Error ('Hubo un error')
         res.status(500).json({error: error.message})
    }
}

export const getUserByHandle = async (req: Request, res: Response) => {

    try {
        const {handle} = req.params
        const user = await User.findOne({handle}).select('-_id -__v -email -password')

        if(!user){
            const error = new Error('El usuario no existe')
            res.status(404).json({error:error.message})
            return
       }
        
        res.json(user)
        
        
    } catch (e) { 
        const error = new Error ('Hubo un error')
         res.status(500).json({error: error.message})
    }

}

export const SearchByHandle = async (req: Request, res: Response) => {

    try {
        const {handle} = req.body
        const userExists = await User.findOne({handle})
        if (userExists){
            const error = new Error(`${handle} ya está registrado`)
             res.status(409).json({error:error.message})
             return
        }
        res.send(`${handle} Está disponible`)
        
    } catch (e) { 
        const error = new Error ('Hubo un error')
         res.status(500).json({error: error.message})
    }


}

    