/**
 * Config source: TODO
 *
 * Feel free to let us know via PR, if you find something broken in this config
 * file.
 */

 import { HoneypotConfig } from '@ioc:Jagr/Honeypot'

/*
|--------------------------------------------------------------------------
| Honeypot
|--------------------------------------------------------------------------
|
| Bots run through forms filling out each visible field. This honeypot
| traps those bots and prevents their request from being fulfilled.
| Bots tend to check for simple hidden fields like type=hidden, classes
| like "hidden", and the inline-style display: none. This plugin will
| instead use CSS clamping to hide the customizable list of fields you
| define below. Just be sure your fields below won't collide with any
| actual form fields your application will need.
*/
export const honeypotConfig: HoneypotConfig = {
  /*
  |--------------------------------------------------------------------------
  | Fields
  |--------------------------------------------------------------------------
  |
  | List of fields that will be added to your form when using the
  | honeypot component.
  |
  */
  fields: ['ohbother', 'ohhoney', 'ohpiglet', 'ohtigger', 'ohpoo'],

  /*
  |--------------------------------------------------------------------------
  | Display flash message on failure
  |--------------------------------------------------------------------------
  |
  | When true, a flash message will be added to the session when the
  | honeypot fails due to the hidden fields being filled out.
  |
  */
  flashOnFailure: true,

  /*
  |--------------------------------------------------------------------------
  | Flash message displayed on failure
  |--------------------------------------------------------------------------
  */
  flashMessage: 'Our system flagged you as a bot',

  /*
  |--------------------------------------------------------------------------
  | Key used for flash message on failure
  |--------------------------------------------------------------------------
  */
  flashKey: 'error',

  /*
  |--------------------------------------------------------------------------
  | Redirect the user on failure
  |--------------------------------------------------------------------------
  |
  | When true, the user will be redirect to your defined redirectTo path.
  | When false, or when redirectTo is null or empty, the user will be
  | returned back to the previous page.
  |
  */
  redirectOnFailure: false,
  redirectTo: null
}
