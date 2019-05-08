class Lloyd_VoronoiIteration {
    constructor(data, epsilon, learning, maxIterations) {
        this.data = data;
        this.learnReas = parseFloat(learning);
        this.eps = parseFloat(epsilon);

        if (!this.data instanceof Array || this.data.length < 1 || this.data[0].length < 1 || this.learnReas < 0 || this.learnReas > 1 || this.eps <= 0)
            throw Error("You have to use a valid data set and parameters.");

        this.n = this.data.length;
        this.dimX = this.data[0].length - 1;
        this.classes = [];
        this.inicialCenters = [];
        this._getClasses();
        this.centers = this.inicialCenters.slice();

        // For internal processing...
        this.prevCenters = this.centers.slice();
        this.iterations = 0;
        this.maxIterations = maxIterations;
        this.epsProgress = Math.min(0.0079, this.eps);

        this.m = this.classes.length;

        console.log(`epsilon: ${this.eps}, n = ${this.n}, learningReason = ${this.learnReas}, dimX = ${this.dimX}, m = ${this.m}, initialCenters = ${this.inicialCenters}, classes = ${this.classes}`);

        this.algorithm();

        console.log(`Final centers: \n${JSON.stringify(this.centers)} \nAfter ${this.iterations} iterations`);

        $('#testVector').show();
    }

    algorithm() {
        this.iterations++;

        for (let i = 0; i < this.n; i++) { // Iterate over each vector
            const x = this.data[i];
            // console.log(`Current vector: ${x} \n Current centers: ${JSON.stringify(this.centers)}`);
            let minD = { class: -1, val: Number.MAX_SAFE_INTEGER };
            for (let j = 0; j < this.m; j++) { // Iterate over each class
                let d = this._euclideanDistance(x, this.centers[j]);
                if (d < minD.val) {
                    minD.class = j;
                    minD.val = d;
                }
            }
            // Save a copy of the centers
            this.prevCenters = this.centers.slice();

            // Update the minD class...  and current centers...
            this.centers[minD.class] = this._opVectors(this.centers[minD.class], this._opVectors(this.learnReas, this._opVectors(x, this.centers[minD.class], "-"), "*"));
        }


        for (let i = 0; this.iterations <= this.maxIterations && i < this.m; i++) { // Check epsilon => new iteration...
            if (this._euclideanDistance(this.centers[i], this.inicialCenters[i]) > this.eps) {
                let progress = this._euclideanDistance(this.prevCenters[i], this.centers[i]);
                if (progress > this.epsProgress) { // Check progress...
                    this.algorithm();
                } else {
                    let j = i;
                    while (j < this.prevCenters.length && progress <= this.epsProgress)
                        progress = this._checkProgress(j++);

                    if (progress > this.epsProgress) {
                        console.log(`Progress > ${this.epsProgress}   :  ${progress}`);
                        this.algorithm();
                    } else {
                        console.log(`There is not progress if we continue iterating... ${progress}`);
                    }
                }
                break;
            }
        }
    }

    _checkProgress(i = 0) {
        return this._euclideanDistance(this.prevCenters[i], this.centers[i]);
    }

    _euclideanDistance(x, c) {
        let r = 0;
        for (let k = 0; k < this.dimX; k++)
            r += Math.pow(x[k] - c[k], 2);

        return Math.sqrt(r);
    }

    _opVectors(X, Y, operation = "+") {
        // console.log(`Operate ${operation} using: ${JSON.stringify(X)}, ${JSON.stringify(Y)} `);
        let Z = [];
        switch (operation) {
            case "-":
                for (let i = 0; i < this.dimX; i++) { Z[i] = parseFloat(X[i]) - parseFloat(Y[i]); }
                break;
            case "*": // Multiply a number to a vector
                for (let i = 0; i < this.dimX; i++) { Z[i] = parseFloat(X) * parseFloat(Y[i]); }
                break;
            default:
                for (let i = 0; i < this.dimX; i++) { Z[i] = parseFloat(X[i]) + parseFloat(Y[i]); }
                break;
        }
        return Z;
    }

    _getClasses() {
        this.data.forEach(x => {
            if (this.classes.indexOf(x[this.dimX]) < 0) {
                this.classes.push(x[this.dimX]);
                this.inicialCenters.push(x);
            }
        });
    }

    testVector(x) {
        console.log(`Testing vector: ${x}`);

        let minDs = [];
        let minD = { class: -1, val: Number.MAX_VALUE };
        for (let i = 0; i < this.m; i++) {
            let d = this._euclideanDistance(x, this.centers[i]);
            minDs.push({className: this.classes[i], value: d});
            if (d < minD.val) {
                minD.class = i;
                minD.val = d;
            };
        }

        return [minDs, this.classes[minD.class]];
    }
}