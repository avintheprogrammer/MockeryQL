import { subclass } from '../object';

/**
 * A <code>BaseError</code> class from which custom error classes can be
 * extended.  This class exists because Babel does not properly handle the
 * extending of native JavaScript classes, including <code>Error</code>.
 * Instead, function <code>subclass</code> can be used to extend native
 * classes.
 */

/**
 * @constructor
 * Create a <code>BaseError</code>.
 * @param {string|Error} err If an instance of <code>BaseError</code> or
 * <code>Error</code>, copy the instance's properties, instead of creating
 * a new stack trace.
 */
const MODULE = function BaseError(err)
{
  /* No need to call 'super', because <code>Error.apply</code> returns a new
   * <code>Error</code> object, instead of modifying the passed reference to
   * <code>this</code>. */
  Object.defineProperty(this, 'name', { value: this.constructor.name });

  const { message, stack } = err || { };

  if (stack) {
    this.stack = stack;
  }
  else if (Error.captureStackTrace)
  {
    Error.captureStackTrace(this, this.constructor);
  }

  if (err == null)
  {
    this.message = '';
  }
  else if (err instanceof Error)
  {
    this.message = message;
  }
  else {
    this.message = String(err);
  }
};

/* WARNING: Don't use Babel to extend native JavaScript classes.  Just don't
 * do it.  Instead, use the <code>subclass</code> function. */
subclass(Error, MODULE);

/* If you need to add class methods, uncomment the following line and then
 * follow the example below.

const CLASS = MODULE.prototype;

CLASS.method = function method(arg)
{
  this.arg = arg;
};
*/

export default MODULE;
