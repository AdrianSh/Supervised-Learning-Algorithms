class KMeans {
    /**
     * 
     * @param {*} data Each row of the dataset contains a X vector
     */
    constructor(data, b, epsilon, c){
        this.data = data;

        if(!this.data instanceof Array || this.data.length < 1 || this.data[0].length < 1 || b < 2 || epsilon <= 0)
            throw Error("You have to use a valid data set and parameters.");
        
        // Parameters
        this.b = b;
        this.e = epsilon;
        this.n = data.length;
        // this.c = data[0].length - 1; // Num classes (note: -1 because the last column contains the class)
        this.c = c;
        this.dimX = data[0].length - 1;

        /*
        this.classNames = [];

        this.data.forEach(v => {
            // Add the className, as it's on the last column
            if(this.classNames.indexOf(v[this.dimX]) < 0)
            this.classNames.push(v[this.dimX]);
        });

        console.log(this.classNames);
        */

        this.centers = [];
        for (let i = 0; i < this.c; i++) this.centers.push(data[this._getRndInteger(0, this.n)]);
        this.initCenters = this.centers.slice();
        console.log(`n = ${this.n}, b = ${this.b}, ε = ${this.e}, c = ${this.c}, \nInitial centers = ${JSON.stringify(this.initCenters)}`);
        
        // Temporal buffers
        this.d = {};
        this.dinv = {};

        this.t = 0;

        this.algorithm();
    }

    algorithm(){
        console.log(`\n#########################################\n\tIteration ${++this.t}`);
        this.calcDistances();
        console.log('Euclidean distances calculated...');
        let U = [];

        for (let j = 0; j < this.n; j++) {
            let Pxj = [];
            for (let i = 0; i < this.c; i++)
                Pxj[i] = this.dinv[`${i}x${j}`] / this.dinv[`x${j}`];
            U.push(Pxj);
        }
        
        console.log('Degree of belonging matrix calculated...');
        
        let oldCenters = this.centers.slice();
        for (let i = 0; i < this.c; i++) {
            this.centers[i] = this.calcVector(U, i);
        }

        console.log('Learned vectors calculated...');
        console.log(this.centers);


        // Has it finished?
        for (let i = 0; i < this.c; i++) {
            if(this._euclideanDistance(oldCenters[i], this.centers[i]) >= this.e){
                console.log(`Not yet... it could learn something else...`);
                this.algorithm();
                return;
            }
        }

        $('#testVector').show();
    }

    calcVector(U, i){
        let v = [];
        let sumP_b = 0;

        for (let k = 0; k < this.dimX; k++)
            v[k] = 0;

        for (let j = 0; j < this.n; j++) {
            let X = this.data[j];
            let p_b = Math.pow(U[j][i], this.b);
            sumP_b += p_b;
            for (let k = 0; k < this.dimX; k++)
                v[k] += p_b * X[k];
        }

        for (let k = 0; k < this.dimX; k++)
            v[k] /= sumP_b;

        return v;
    }

    /**
     * Euclidean distance
     * @param {*} i E [0, c)
     * @param {*} j E [0, n)
     */
    euclideanDistance(i, j){
        let r = 0;
        let X = this.data[j]; // .slice(0, this.dimX);
        let V = this.centers[i]; // .slice(0, this.dimX);
        for (let k = 0; k < this.dimX; k++)
            r += Math.pow(X[k] - V[k], 2);

        // console.log(`i=${i} j=${j} X=[${X}] V=[${V}] \n ||X-V||^2 = ${r}`);
        return r;
    }

    _euclideanDistance(v1, v2){
        let r = 0;
        for (let k = 0; k < this.dimX; k++)
            r += Math.pow(v1[k] - v2[k], 2);

        return Math.sqrt(r);
    }

    calcDistances(){
        let bInv = 1/(this.b - 1);
        for (let j = 0; j < this.n; j++) {
            this.dinv[`x${j}`] = 0;
            for (let i = 0; i < this.c; i++) {
                let d = this.euclideanDistance(i,j);
                this.d[`${i}x${j}`] = d;
                this.dinv[`${i}x${j}`] = d != 0 ? Math.pow(1/d, bInv) : 0;
                this.dinv[`x${j}`] += this.dinv[`${i}x${j}`];
            }
        }
    }

    _getRndInteger(min, max) {
        return Math.floor(Math.random() * (max - min + 1) ) + min;
    }

    testVector(v){
        console.log(`Testing: ${v}`);
        let d = [];
        for (let i = 0; i < this.c; i++)
            d[i] = this._euclideanDistance(v, this.centers[i]);
        
        return [d, d.indexOf(Math.min(...d))];
    }
}