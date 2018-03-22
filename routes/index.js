var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.locals.router = 'index';
  res.render('index.html', {title: 'Express'});
});

router.get('/index.html', function (req, res, next) {
  res.locals.router = 'index';
  res.render('index.html', {title: 'Express'});
});

router.get('/about.html', function (req, res, next) {
  res.locals.router = 'about';
  res.render('about.html', {title: 'Express'});
});
router.get('/contact.html', function (req, res, next) {
  res.locals.router = 'contact';
  res.render('contact.html', {title: 'Express'});
});
router.get('/derivative.html', function (req, res, next) {
  res.locals.router = 'derivative';
  res.render('derivative.html', {title: 'Express'});
});
router.get('/product-details.html', function (req, res, next) {
  res.locals.router = 'derivative';
  res.render('product-details.html', {title: 'Express'});
});
router.get('/director.html', function (req, res, next) {
  res.locals.router = 'director';
  res.render('director.html', {title: 'Express'});
});
router.get('/news.html', function (req, res, next) {
  res.locals.router = 'news';
  res.render('news.html', {title: 'Express'});
});
router.get('/article.html', function (req, res, next) {
  res.locals.router = 'news';
  res.render('article.html', {title: 'Express'});
});
router.get('/photo.html', function (req, res, next) {
  res.locals.router = 'about';
  res.render('photo.html', {title: 'Express'});
});
router.get('/works.html', function (req, res, next) {
  res.locals.router = 'works';
  res.render('works.html', {title: 'Express'});
});
router.get('/research.html', function (req, res, next) {
  res.locals.router = 'research';
  res.render('research.html', {title: 'Express'});
});
router.get('/chubanzhuzuo.html', function (req, res, next) {
  res.locals.router = 'research';
  res.render('chubanzhuzuo.html', {title: 'Express'});
});
router.get('/course.html', function (req, res, next) {
  res.locals.router = 'research';
  res.render('course.html', {title: 'Express'});
});
router.get('/books.html', function (req, res, next) {
  res.locals.router = 'research';
  res.render('books.html', {title: 'Express'});
});
module.exports = router;
