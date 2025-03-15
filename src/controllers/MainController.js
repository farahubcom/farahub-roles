const { Controller } = require('@farahub/framework/foundation');

class MainController extends Controller {

    /**
     * The controller name
     * 
     * @var string
     */
    name = 'Main';

    /**
     * The controller base path
     * 
     * @var string
     */
    basePath = '/';

    /**
     * The controller routes
     * 
     * @var array
     */
    routes = [
        //
    ]
}

module.exports = MainController;