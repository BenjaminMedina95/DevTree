import { Router } from 'express';
import {body} from 'express-validator';
import { createAccount, getUser, login, updateProfile, uploadImage } from './handlers';
import { handleInputError } from './middleware/validation';
import { authenticate } from './middleware/auth';

const router = Router();

//AUTENTICACION Y REGISTRO
router.post('/auth/register', 
    body('handle')
        .notEmpty()
        .withMessage('El handle es requerido'),
    body('name')
        .notEmpty()
        .withMessage('El nombre es requerido'),
    body('email')
        .isEmail()
        .withMessage('Email no valido'),
    body('password')
        .isLength({min: 8})
        .withMessage('El password es muy corto, mínimo 8 caracteres'),

    handleInputError,
    createAccount)


router.post('/auth/login',

    body('email')
        .isEmail()
        .withMessage('Email no valido'),
    body('password')
        .notEmpty()
        .withMessage('El password es requerido'),

    handleInputError,
    login
    )

router.get('/user', authenticate, getUser)
router.patch('/user', 
    body('handle')
        .notEmpty()
        .withMessage('El handle es requerido'),
    body('description')
        .notEmpty()
        .withMessage('La descripcion es requerida'),
    handleInputError,
    authenticate, 
    updateProfile
)

router.post ('/user/image', authenticate, uploadImage)

export default router