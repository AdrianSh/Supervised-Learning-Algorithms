$(document).ready(function () {
	$('#inputGroupFileAddon02').click(function () {
		new CSVReader($('input[type=file]'), results => {
			// console.log(results);
			new KMeans(results.data, $('#k-means-param-b').val(), $('#k-means-param-e').val());
		});
	});
});