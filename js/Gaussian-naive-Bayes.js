class GaussiannaiveBayes {
    /**
     * 
     * @param {*} data Each row of the dataset contains a X vector
     */
    constructor(data) {
        this.data = data;
        if (!this.data instanceof Array || this.data.length < 1 || this.data[0].length < 1)
            throw Error("You have to use a valid data set and parameters.");

        this.dimX = data[0].length - 1;
        this.n = this.data.length;
        // Calc m vectors
        this.m = {};
        this.C = {};
        this._m();

        console.log(`dimX = ${this.dimX}, n = ${this.n}, m = ${JSON.stringify(this.m)}, C = ${JSON.stringify(this.C)}`)
        this.algorithm();
        console.log(this.C)
    }

    algorithm(){
        // Let's calculate cov matrix
        for (let x of this.data) {
            let c = x[this.dimX];
            let s = math.subtract(x, this.m[c].v);
            this.C[c] = math.add(this.C[c], math.multiply(s, math.transpose(s)));
        }
        
        for(let c of Object.getOwnPropertyNames(this.m)){
            this.C[c] = math.divide(1/this.m[c].n, this.C[c]);
        }
    }

    _registerClass(className){
        this.C[className] = math.zeros(this.dimX, this.dimX);
        this.m[className] = { v: Array.apply(null, Array(this.dimX)).map(v => 0), n: 0 }
    }

    _m() {
        for (let x of this.data) {
            if (!this.m[x[this.dimX]])
                this._registerClass(x[this.dimX]);
            let m = this.m[x[this.dimX]];
            m.n++;
            for (let i = 0; i < this.dimX; i++)
                m.v[i] += parseFloat(x[i]);
        };

        for(let c of Object.getOwnPropertyNames(this.m)){
            for (let i = 0; i < this.dimX; i++) {
                this.m[c].v[i] /= this.m[c].n;
            }
        }
    }


}