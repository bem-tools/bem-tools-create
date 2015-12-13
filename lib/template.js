var fs = require('fs'),
    path = require('path'),
    tilde = require('os-homedir')();

function defaultTemplate() {
    return '';
}

module.exports = function getTemplate(tech, options) {
    var templateFolder = options.templateFolder || path.join(tilde, '.bem', 'templates'),
        techId = (options.techsTemplates && options.techsTemplates[tech]) || tech,
        templatePath = options.templates && options.templates[techId],
        possiblePaths = [templateFolder, path.join(__dirname, 'templates')];

    if (!templatePath) {
        for (var i = 0; i < possiblePaths.length; i++) {
            var possibleTemplatePath = path.join(possiblePaths[i], tech + '.js');

            if (fs.existsSync(possibleTemplatePath)) {
                templatePath = possibleTemplatePath;
                break;
            }
        }
    }

    return templatePath ? require(templatePath) : defaultTemplate;
};
