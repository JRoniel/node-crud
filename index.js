const express = require('express')
const app = express()
 
const mongoose = require('mongoose')
const Person = require('./models/Person')

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas
// Rota para criar uma nova pessoa
app.post('/person', async (req, res) => {
    const { name, salary, approved } = req.body;

    if(!name || !salary || approved === undefined){
        return res.status(422).json({error: 'Campos obrigatórios faltando!'})
    }

    try {
        const savePerson = await Person.create({
            name,
            salary,
            approved
        });

        console.debug('[DEBUG] Pessoa inserida: ', savePerson);

        res.status(201).json({ message: 'Pessoa inserida com sucesso!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//Rota para retornar todas as pessoas
app.get('/person', async (req, res) => {
    try {
        const people = await Person.find({}, '_id name salary approved')

        res.status(200).json(people)
    } catch (error) {
        res.status(500).json({ erro: error})
    }
})

//Rota para buscar uma pessoa pelo ID
app.get('/person/:id', async (req, res) => {
    const id = req.params.id

    try {
        const person = await Person.findOne({ _id: id }, 'name salary approved')

        if (!person) {
            res.status(422).json({ message: 'Usuário não encontrado! '})
            return
        }

        res.status(200).json(person)
    } catch (error) {
        res.status(500).json({ erro: error})
    }
})

//Rota para atualizar uma pessoa
app.patch('/person/:id', async (req, res) => {
    const id = req.params.id
  
    const { name, salary, approved } = req.body
  
    const person = {
      name,
      salary,
      approved,
    }
  
    try {
      const updatedPerson = await Person.updateOne({ _id: id }, person)
  
      if (updatedPerson.matchedCount === 0) {
        res.status(422).json({ message: 'Usuário não encontrado!' })
        return
      }
  
      res.status(200).json(person)
    } catch (error) {
      res.status(500).json({ erro: error })
    }
})

//Rota para deletar uma pessoa
app.delete('/person/:id', async (req, res) => {
    const id = req.params.id

    const person = await Person.findOne({ _id: id })

    if (!person) {
        res.status(422).json({ message: 'Usuário não encontrado!' })
        return
    }

    try {
        await Person.deleteOne({ _id: id })

        res.status(200).json({ message: 'Usuário removido com sucesso!' })
    } catch (error) {
        res.status(500).json({ erro: error})
    }
})

app.get('/', (req, res) => {
    res.json({ message: 'Oi Express! '})
    console.debug('[DEBUG] Requisição recebida com sucesso!')
})

mongoose
    .connect(
        'mongodb://localhost:27017/myFirstDatabase',
    )
    .then(() => {
        console.log('[INFO] Conectou ao banco!')
        app.listen(3000, () => {
            console.log('[INFO] Servidor rodando na porta 3000');
        });
    })
.catch((err) => console.log(err))