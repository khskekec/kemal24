const fs = require('fs');
const path = require('path');

export default router => {
    const basename = path.basename(__filename);
    const routes = fs.readdirSync(__dirname)
        .filter(file => {
            return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
        });

    routes.forEach(routeFile => {
        let defineCall = require(path.join(__dirname, routeFile));
        if (typeof defineCall === 'object') {
            // ES6 module compatibility
            defineCall = defineCall.default;
        }

        defineCall(router)
    });
}