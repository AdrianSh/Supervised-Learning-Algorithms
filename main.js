$(document).ready(function () {
	var KMeansInstance;
	var GaussiannaiveBayesInstance;
	var LloydInstance;

	$('#inputGroupFileAddon02').click(function () {
		new CSVReader($('#inputGroupFile02'), results => {
			// console.log(results);
			KMeansInstance = new KMeans(results.data, $('#k-means-param-b').val(), $('#k-means-param-e').val(), $('#k-means-param-c').val());
			GaussiannaiveBayesInstance = new GaussiannaiveBayes(results.data);
			LloydInstance = new Lloyd_VoronoiIteration(results.data, $('#lloyd-param-e').val(), $('#lloyd-param-learning').val());
		});
	});

	$('#inputGroupFileAddon03').click(function () {
		$('#testResults').empty();
		var testResult = {};
		new CSVReader($('#inputGroupFile03'), results => {
			let x = results.data.pop();
			testResult["Fuzzy C-Means Clustering"] = KMeansInstance.testVector(x);
			testResult["Gaussian naive Bayes"] = GaussiannaiveBayesInstance.testVector(x);
			testResult["Lloyd's algorithm"] = LloydInstance.testVector(x);
			// $('#testResult').text(`Class ${testResult[1]}`);
			
			for(let alg of Object.getOwnPropertyNames(testResult)){
				switch (alg) {
					case "Fuzzy C-Means Clustering":
						$('#testResults').append(`<tr class="result"><td colspan="3">Class member: Class ${testResult[alg][1]}</td></tr>`);
						testResult[alg][0].forEach((v, i) => {
							$('#testResults').append(`<tr><td>${alg}</td><td>Class ${i}</td><td>${v}</td></tr>`);
						});
						break;
					default:
						$('#testResults').append(`<tr class="result"><td colspan="3">Class member: ${testResult[alg][1]}</td></tr>`);
						testResult[alg][0].forEach((v) => {
							$('#testResults').append(`<tr><td>${alg}</td><td>${v.className}</td><td>${v.value}</td></tr>`);
						});
						break;
				}
			}
		});
	});
});