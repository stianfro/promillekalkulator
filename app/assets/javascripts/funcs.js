
$(document).ready(function() {
	$('.datepicker').pickadate({
	    min: new Date(2013,3,20),
	    max: new Date(2013,7,14)
	})

	$('.timepicker').pickatime()
});
