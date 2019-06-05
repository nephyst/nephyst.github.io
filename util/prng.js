
//Creates a pseudo-random value generator.
export default class Random {
    constructor(seed) {
        switch (typeof seed) {
            case 'string':
                seed = hashCode(seed);
                break;
            case 'number':
                //actually, this is fine.
                break;
            default:
                throw 'Seed must be string or number but was ${typeof seed}';
        }
        this._seed = seed % 2147483647;
        if (this._seed <= 0) {
            this._seed += 2147483646;
        }
    }
    // Returns a pseudo-random value between 1 and 2^32 - 2.
    next() {
        return this._seed = this._seed * 16807 % 2147483647;
    }
    // Returns a pseudo-random floating point number in range [0, 1).
    nextFloat() {
        return (this.next() - 1) / 2147483646; //2^32 - 2
    }
    //Inclusive min, exclusive max
    nextInt(min, max) {
        return Math.floor(this.nextFloat() * (max - min)) + min;
    }
}

function hashCode(s) {
    var hash = 0, i, chr;
    if (s.length === 0) return hash;
    for (i = 0; i < s.length; i++) {
        chr = s.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
};