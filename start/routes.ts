/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer''
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async ({ view }) => {
  return view.render('index')
})

Route.get('/img/:userId/:filename', 'AssetsController.show').as('userimg');
// Route.get('/img/*', 'AssetsController.show').where('path', /.*/).as('img');

// AUTH
Route.get('/signup',  'AuthController.signupShow').as('auth.signup.show')
Route.post('/signup', 'AuthController.signup').as('auth.signup')
Route.get('/signin',  'AuthController.signinShow').as('auth.signin.show')
Route.post('/signin', 'AuthController.signin').as('auth.signin')
Route.get('/signout', 'AuthController.signout').as('auth.signout')

Route.get('/:provider/redirect', 'AuthSocialController.redirect').as('auth.social.redirect');
Route.get('/:provider/callback', 'AuthSocialController.callback').as('auth.social.callback');

Route.get('/forgot-password',       'PasswordResetController.forgotPassword').as('auth.password.forgot');
Route.get('/forgot-password/sent',  'PasswordResetController.forgotPasswordSent').as('auth.password.forgot.sent');
Route.post('/forgot-password',      'PasswordResetController.forgotPasswordSend').as('auth.password.forgot.send')//.middleware(['honeypot']);
Route.get('/reset-password/:email', 'PasswordResetController.resetPassword').as('auth.password.reset');
Route.post('/reset-password',       'PasswordResetController.resetPasswordStore').as('auth.password.reset.store');

// PUBLIC
Route.get('/series',                      'SeriesController.index').as('series.index')
Route.get('/series/:slug',                'SeriesController.show').as('series.show')
Route.get('/series/:slug/lesson/:index',  'SeriesController.lesson').as('series.lesson')

Route.get('/lessons', 'LessonsController.index').as('lessons.index')

Route.get('/posts', 'PostsController.index').as('posts.index')

Route.get('/topics', 'TopicsController.index').as('topics.index')

Route.post('/comments',       'CommentsController.store').as('comments.store')
Route.put('/comments/:id',    'CommentsController.update').as('comments.update')
Route.delete('/comments/:id', 'CommentsController.destroy').as('comments.destroy')

// STUDIO
Route.group(() => {

  Route.group(() => {

    Route.get('/',          'PostsController.index').as('index')
    Route.get('/create',    'PostsController.create').as('create')
    Route.post('/',         'PostsController.store').as('store')
    Route.get('/:id/edit',  'PostsController.edit').as('edit')
    Route.put('/:id',       'PostsController.update').as('update')
    Route.delete('/:id',    'PostsController.destroy').as('destroy')

  }).prefix('/posts').as('posts')

  Route.group(() => {

    Route.get('/',          'CollectionsController.index').as('index')
    Route.get('/create',    'CollectionsController.create').as('create')
    Route.post('/',         'CollectionsController.store').as('store')
    Route.get('/:id/edit',  'CollectionsController.edit').as('edit')
    Route.put('/:id',       'CollectionsController.update').as('update')
    Route.delete('/:id',    'CollectionsController.destroy').as('destroy')

  }).prefix('/collections').as('collections')

  Route.group(() => {

    Route.get('/',          'TaxonomiesController.index').as('index')
    Route.get('/create',    'TaxonomiesController.create').as('create')
    Route.post('/',         'TaxonomiesController.store').as('store')
    Route.get('/:id/edit',  'TaxonomiesController.edit').as('edit')
    Route.put('/:id',       'TaxonomiesController.update').as('update')
    Route.delete('/:id',    'TaxonomiesController.destroy').as('destroy')

  }).prefix('/taxonomies').as('taxonomies')

  Route.group(() => {

    Route.get('/', 'SettingsController.index').as('index')

  }).prefix('/settings').as('settings')

}).namespace('App/Controllers/Http/Studio').prefix('studio').as('studio').middleware(['auth'])

// API
Route.group(() => {

  Route.post('/studio/assets', 'AssetsController.store').as('studio.assets.store')
  Route.delete('/studio/assets/:id', 'AssetsController.destroy').as('studio.assets.destroy')
  Route.post('/studio/editor/assets', 'AssetsController.store').as('studio.editor.asset')//.middleware(['admin'])

  Route.group(() => {

    Route.get('/posts/search', 'PostsController.search').as('posts.search')

    Route.post('/collections/stub', 'CollectionsController.stub').as('collections.stub')

  }).prefix('/studio').as('studio').namespace('App/Controllers/Http/Studio')

}).prefix('/api').as('api').middleware(['auth'])
