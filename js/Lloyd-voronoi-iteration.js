class Lloyd_VoronoiIteration {
    constructor(data, epsilon, learning) {
        this.data = data;

        if (!this.data instanceof Array || this.data.length < 1 || this.data[0].length < 1 || learning < 0 || learning > 1 || epsilon <= 0)
            throw Error("You have to use a valid data set and parameters.");

        this.eps = epsilon;
        this.n = this.data.length;
        this.learnReas = learning;
        this.dimX = this.data[0].length - 1;
        this.classes = [];
        this.inicialCenters = [];
        this.centers = this.inicialCenters.slice();
        this._getClasses();

        this.m = this.classes.length;

        console.log(`epsilon: ${this.eps}, n = ${this.n}, learningReason = ${this.learnReas}, dimX = ${this.dimX}, m = ${this.m}, initialCenters = ${this.inicialCenters}`);

        this.algorithm();
    }

    algorithm() {
        for (let i = 0; i < this.n; i++) { // Iterate over each vector
            const x = this.data[i];
            let minD = {class: -1, val: Number.MAX_SAFE_INTEGER};
            for (let j = 0; j < this.m; j++) { // Iterate over each class
                let d = this._euclideanDistance(x, this.centers[j]);
                if(d < minD){
                    minD.class = j;
                    minD.val = d;
                }
            }
            // Update the minD class...  and current centers...
        }

        // check epsilon and make a new iteration...
    }

    _euclideanDistance(x, c){
        let r = 0;
        for (let k = 0; k < this.dimX; k++)
            r += Math.pow(x[k] - c[k], 2);

        return Math.sqrt(r);
    }

    _getClasses() {
        this.data.forEach(x => {
            if (this.classes.indexOf(x[this.dimX]) < 0) {
                this.classes.push(x[this.dimX]);
                this.inicialCenters.push(x);
            }
        });
    }
}