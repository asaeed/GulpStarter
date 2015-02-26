
console.log('begin app.js');

var swig = require('gulp-swig/node_modules/swig');

// example of loading template in runtime
$.get('partials/tile.html', function(template) {
	var tile = swig.render(template, { locals: { name: 'Bob Loblaw' }});
	console.log(tile);
	$('#runtime-template').html(tile);
});


