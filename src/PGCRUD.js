const express = require('express');
const Sequelize = require('sequelize');
const app = express();
app.use(express.json());

const dbUrl = 'postgres://webadmin:ZYLktn88294@node86021-env-nexonkitsune.proen.app.ruk-com.cloud:11620/Books'

const sequelize = new Sequelize(dbUrl);


// ===== MODEL =====
const Book = sequelize.define('Books', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    author: {
        type: Sequelize.STRING,
        allowNull: false
    }
}, {
    freezeTableName: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

// ===== ROUTES =====

app.get('/', (req, res) => {
    res.send('Hello World! Book!!');
});

// GET ALL
app.get('/books', async (req, res) => {
    try {
        const books = await Book.findAll();
        res.json(books);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET BY ID
app.get('/books/:id', async (req, res) => {
    try {
        const book = await Book.findByPk(req.params.id);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.json(book);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// CREATE
app.post('/books', async (req, res) => {
    try {
        const { title, author } = req.body;

        if (!title || !author) {
            return res.status(400).json({
                error: 'title and author are required'
            });
        }

        const book = await Book.create({ title, author });
        res.status(201).json(book);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// UPDATE
app.put('/books/:id', async (req, res) => {
    try {
        const book = await Book.findByPk(req.params.id);

        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        await book.update(req.body);
        res.json(book);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE
app.delete('/books/:id', async (req, res) => {
    try {
        const book = await Book.findByPk(req.params.id);

        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        await book.destroy();
        res.json({ message: 'Deleted successfully' });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ===== START SERVER =====
sequelize.sync({ force: true })   // ลบ table เก่าแล้วสร้างใหม่
    .then(() => {
        console.log('Database synced');
        app.listen(3000, () =>
            console.log('Listening on port 3000...')
        );
    })
    .catch(err => {
        console.error('DB Error:', err);
    });