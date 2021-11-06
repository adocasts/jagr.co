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

Route.get('/signup',  'AuthController.signupShow').as('auth.signup.show')
Route.post('/signup', 'AuthController.signup').as('auth.signup')
Route.get('/signin',  'AuthController.signinShow').as('auth.signin.show')
Route.post('/signin', 'AuthController.signin').as('auth.signin')
Route.get('/signout', 'AuthController.signout').as('auth.signout')

Route.group(() => {

  Route.group(() => {

    Route.get('/:page?',    'PostsController.index').as('index').where('page', Route.matchers.number())
    Route.get('/create',    'PostsController.create').as('create')
    Route.post('/',         'PostsController.store').as('store')
    Route.get('/:id/edit',  'PostsController.edit').as('edit')
    Route.put('/:id',       'PostsController.update').as('update')
    Route.delete('/:id',    'PostsController.destroy').as('destroy')

  }).prefix('/posts').as('posts')

}).namespace('App/Controllers/Http/Studio').prefix('studio').as('studio')