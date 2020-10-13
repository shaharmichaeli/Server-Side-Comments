const express = require('express');
const app = express();
const path = require('path');
const { send } = require('process');
const methodOverride = require('method-override');

const { v4: uuid } = require('uuid');
const port = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Public directory - Referencing to all css,js,html files that included in ejs files.
// path.join with __dir , gives running app.js from every dict in terminal
// - without this its look for public dict in the running folder of terminal.
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));

let datas = [];

app.get('/', (req, res) => {
	res.render('index', { title: 'Home', datas });
});

app.get('/comments/show/:id', (req, res) => {
	const { id } = req.params;
	let obj = datas.find((x) => x.id === id);
	res.render('comments/show', { comment: obj.comment, userid: obj.user });
});

app.post('/comments/newComment', (req, res) => {
	const { user, comment } = req.body;
	datas.push({ id: uuid(), user, comment });
	res.redirect('/');
});

app.delete('/comments/:id', (req, res) => {
	const { id } = req.params;
	datas = datas.filter((data) => id != data.id);
	res.redirect('/');
});

app.patch('/comments/:id', (req, res) => {
	const { id } = req.params;
	const { newComment } = req.body;
	let obj = datas.find((x) => x.id === id);
	datas[datas.indexOf(obj)].comment = newComment;
	res.redirect('/');
});

app.get('/comments/edit/:id', (req, res) => {
	const { id } = req.params;
	let obj = datas.find((x) => x.id === id);
	res.render('comments/edit', { comment: obj.comment, id: obj.id });
});

app.listen(port, function () {
	console.log(`App listening at http://localhost:${port}`);
});
