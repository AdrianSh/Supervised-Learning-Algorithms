$(document).ready(function () {
	var KMeansInstance;
	$('#inputGroupFileAddon02').click(function () {
		new CSVReader($('#inputGroupFile02'), results => {
			// console.log(results);
			KMeansInstance = new KMeans(results.data, $('#k-means-param-b').val(), $('#k-means-param-e').val(), $('#k-means-param-c').val());
		});
	});

	$('#inputGroupFileAddon03').click(function () {
		new CSVReader($('#inputGroupFile03'), results => {
			console.log(KMeansInstance.testVector(results.data.pop()));
		});
	});
});