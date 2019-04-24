$(document).ready(function () {
	var KMeansInstance;
	var GaussiannaiveBayesInstance;

	/* $('#inputGroupFileAddon02').click(function () {
		new CSVReader($('#inputGroupFile02'), results => {
			// console.log(results);
			KMeansInstance = new KMeans(results.data, $('#k-means-param-b').val(), $('#k-means-param-e').val(), $('#k-means-param-c').val());
		});
	});

	$('#inputGroupFileAddon03').click(function () {
		$('#testResults').empty();
		new CSVReader($('#inputGroupFile03'), results => {
			let testResult = KMeansInstance.testVector(results.data.pop());

			$('#testResult').text(`Class ${testResult[1]}`);
			
			testResult[0].forEach((v, i) => {
				$('#testResults').append(`<tr><td>Class ${i}</td><td>${v}</td></tr>`);
			});
		});
	});
	*/

	$('#inputGroupFileAddon02').click(function () {
		new CSVReader($('#inputGroupFile02'), results => {
			// console.log(results);
			GaussiannaiveBayes = new GaussiannaiveBayes(results.data);
		});
	});
});