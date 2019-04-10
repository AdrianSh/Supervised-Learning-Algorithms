class CSVReader {
    constructor(elem, completeFun){
        this.e = elem;
        this.e.parse({
            config: {
                // base config to use for each file
                complete: completeFun
            },
            before: function (file, inputElem) {
                // executed before parsing each file begins;
                // what you return here controls the flow
                console.log(`Before parsing CSV: ${file.name}`);
            },
            error: function (err, file, inputElem, reason) {
                // executed if an error occurs while loading the file,
                // or if before callback aborted for some reason
                console.log('Error when parsing CSV:');
                console.log(err);
                console.log(file);
                console.log(inputElem);
                console.log(reason);
            },
            complete: function () {
                // executed after all files are complete
                console.log('Complete...');
            }
        })
    }

}