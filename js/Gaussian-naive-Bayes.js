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
        this.C_Inv = {};
        this._m();

        console.log(`GaussiannaiveBayes params: \n\tdimX = ${this.dimX}, \n\tn = ${this.n}, \n\tm = ${JSON.stringify(this.m)}, \n\tC = ${JSON.stringify(this.C)}\n`)
        this.algorithm();

        $('#testVector').show();
    }

    algorithm(){
        // Let's calculate cov matrix
        for (let x of this.data) {
            let c = x[this.dimX]; // Extract class name
            let _x = x.slice(0, this.dimX);
            let s = math.subtract(_x, this.m[c].v);
            this.C[c] = math.add(this.C[c], math.multiply(math.transpose([s]), [s]));
        }

        for(let c of Object.getOwnPropertyNames(this.m)){
            this.C[c] = math.divide(1/this.m[c].n, this.C[c]);
            this.C_Inv[c] = math.inv(this.C[c]); // Calc inverse
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

    testVector(x){
        console.log(`Testing vector: ${x}`);
        if(x.length > this.dimX)
            x = x.slice(0, this.dimX);

        let dm = [];
        let minDm = [null, Number.MAX_SAFE_INTEGER];
        for(let c of Object.getOwnPropertyNames(this.m)){
            let s = math.subtract(x, this.m[c].v);
            console.log(`dm(x, C=${c}, m) = ${(1/ (Math.pow(2 * Math.PI, this.dimX / 2) * Math.pow(math.det(this.C[c]), 1/2)  ))} * e ^ ${-1/2 * math.multiply(math.multiply(math.transpose(s), this.C_Inv[c]), s)} = ${(1/ (Math.pow(2 * Math.PI, this.dimX / 2) * Math.pow(math.det(this.C[c]), 1/2)  )) * Math.exp(-1/2 * math.multiply(math.multiply(math.transpose(s), this.C_Inv[c]), s) )}`);
            // let v = (1/ (Math.pow(2 * Math.PI, this.dimX / 2) * Math.pow(math.det(this.C[c]), 1/2)  )) * Math.exp(-1/2 * math.multiply(math.multiply(math.transpose(s), this.C_Inv[c]), s) );
            let v = math.multiply(math.multiply(math.transpose(s), this.C_Inv[c]), s);
            dm.push({ className: c, value : v});
            if(v < minDm[1])
                minDm = [c, v];
        }

        console.log(dm);
        return [dm, minDm[0]];
    }
}