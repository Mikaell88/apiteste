// Importa o módulo Express para criar a aplicação
const express = require('express');
// Cria um objeto de roteador para definir rotas específicas para a API de usuário
const router = express.Router();
// Importa o modelo de usuário, que representa a estrutura dos dados no banco de dados
const User = require('../models/user');

// Importa métodos do express-validator para validar dados de entrada
const { body, validationResult } = require('express-validator');

// Rota para criar um novo usuário - Creat new usuario
router.post('/', [
    // Valida o campo "name" para garantir que seja uma string
    body('name').isString().withMessage('Name must be a string'),
    // Valida o campo "email" para garantir que tenha um formato de e-mail válido
    body('email').isEmail().withMessage('Email must be valid'),
    // Valida o campo "cpf" para ter exatamente 11 caracteres
    body('cpf').isLength({ min: 11, max: 11 }).withMessage('CPF must have 11 characters'),
    // Valida o campo "password" para ter pelo menos 6 caracteres
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], async (req, res) => {
    // Verifica se há erros de validação
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // Retorna os erros encontrados com status 400 (requisição inválida)
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        // Cria um novo usuário com os dados enviados no corpo da requisição
        const user = new User(req.body);
        // Salva o novo usuário no banco de dados
        await user.save();
        // Envia uma resposta de sucesso com status 201 (recurso criado)
        res.status(201).send(user);
    } catch (error) {
        // Em caso de erro, retorna uma resposta com status 400 (requisição inválida)
        res.status(400).send(error);
    }
});


// Rota para obter todos os usuários - Get all users
router.get('/', async (req, res) => {
    try {
        // Busca todos os usuários no banco de dados
        const users = await User.find();
        // Retorna a lista de usuários com status 200 (sucesso)
        res.status(200).send(users);
    } catch (error) {
        // Em caso de erro, retorna uma resposta com status 500 (erro do servidor)
        res.status(500).send(error);
    }
});



// Rota para obter um usuário pelo ID
router.get('/:id', async (req, res) => {
    try {
        // Busca um usuário específico pelo ID fornecido na URL
        const user = await User.findById(req.params.id);
        if (!user) {
            // Retorna status 404 se o usuário não for encontrado
            return res.status(404).send({ message: 'User not found' });
        }
        // Retorna o usuário encontrado com status 200 (sucesso)
        res.status(200).send(user);
    } catch (error) {
        // Retorna um erro de formato de ID inválido com status 400
        res.status(400).send({ message: 'Invalid ID format' });
    }
});




// Rota para atualizar um usuário (versão com validações) - // Update a user
router.put('/:id', [
    // Valida o campo "name" se ele for fornecido, garantindo que seja uma string
    body('name').optional().isString().withMessage('Name must be a string'),
    // Valida o campo "email" se fornecido, garantindo que seja um e-mail válido
    body('email').optional().isEmail().withMessage('Email must be valid'),
    // Valida o campo "cpf" se fornecido, garantindo que tenha 11 caracteres
    body('cpf').optional().isLength({ min: 11, max: 11 }).withMessage('CPF must have 11 characters'),
    // Valida o campo "password" se fornecido, garantindo que tenha pelo menos 6 caracteres
    body('password').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], async (req, res) => {
    // Verifica se há erros de validação
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // Retorna os erros encontrados com status 400
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        // Atualiza o usuário pelo ID com as novas informações enviadas
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!user) {
            // Retorna status 404 se o usuário não for encontrado
            return res.status(404).send({ message: 'User not found' });
        }
        // Retorna o usuário atualizado com status 200
        res.send(user);
    } catch (error) {
        // Em caso de erro, retorna uma resposta com status 400
        res.status(400).send(error);
    }
});




// Rota para deletar um usuário pelo ID - // Delete a user
router.delete('/:id', async (req, res) => {
    try {
        // Deleta o usuário especificado pelo ID fornecido na URL
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            // Retorna status 404 se o usuário não for encontrado
            return res.status(404).send({ message: 'User not found' });
        }
        // Retorna uma mensagem de sucesso com status 200
        res.status(200).send({ message: 'User deleted successfully', user });
    } catch (error) {
        // Em caso de erro ao deletar, retorna status 500 (erro do servidor)
        res.status(500).send({ message: 'Error deleting user' });
    }
});

// Exporta o roteador para que possa ser usado em outras partes da aplicação
module.exports = router;
