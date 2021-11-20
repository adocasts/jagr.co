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
  return view.render('welcome')
})

Route.get('/img/:userId/:filename', 'AssetsController.show').as('userimg');
// Route.get('/img/*', 'AssetsController.show').where('path', /.*/).as('img');

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

Route.group(() => {

  Route.group(() => {

    Route.get('/',    'PostsController.index').as('index')
    Route.get('/create',    'PostsController.create').as('create')
    Route.post('/',         'PostsController.store').as('store')
    Route.get('/:id/edit',  'PostsController.edit').as('edit')
    Route.put('/:id',       'PostsController.update').as('update')
    Route.delete('/:id',    'PostsController.destroy').as('destroy')

  }).prefix('/posts').as('posts').middleware(['role:admin'])

  Route.group(() => {

    Route.get('/', 'SettingsController.index').as('index')

  }).prefix('/settings').as('settings')

}).namespace('App/Controllers/Http/Studio').prefix('studio').as('studio').middleware(['auth'])

Route.group(() => {

  Route.post('/studio/assets', 'AssetsController.store').as('studio.assets.store')
  Route.delete('/studio/assets/:id', 'AssetsController.destroy').as('studio.assets.destroy')
  Route.post('/studio/editor/assets', 'AssetsController.store').as('studio.editor.asset')//.middleware(['admin'])

}).prefix('/api').as('api').middleware(['auth'])