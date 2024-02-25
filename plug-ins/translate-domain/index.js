export default class TranslateDomain {
    clamp = true;
    sourceRange = [0, 1];
    targetRange = [0, 1];
    constructor(sourceRange, targetRange, options = {}) {
        this.sourceRange = sourceRange;
        this.targetRange = targetRange;
        if (options.hasOwnProperty('clamp')) this.clamp = options.clamp;
    }
    clamper(num, min, max) {
        return Math.min(Math.max(num, min), max);
    }
    inverter(num, min, max) {
        if (this.clamp) num = this.clamper(num, this.sourceRange[0], this.sourceRange[1])
        // calculate distance traveled
        const rangeLength = max - min;
        const distance = Math.abs(rangeLength - num);
        // add distance to min
        const invertedValue = max - distance;
        // console.log(`${this.sourceRange[0]}-${this.sourceRange[1]}` ,{rangeLength, distance, invertedValue});
        return invertedValue;
    }
    translate(num) {
        if (this.clamp) num = this.clamper(num, this.sourceRange[0], this.sourceRange[1])
        // get the ratio of the value relative to the range
        const valueRatio = (num - this.sourceRange[0]) / (this.sourceRange[1] - this.sourceRange[0]);
        // map this ratio to the domain
        const scaledValue = this.targetRange[0] + valueRatio * (this.targetRange[1] - this.targetRange[0]);
        return scaledValue;
    }
    invert(num) {
        const invertedValue = this.inverter(num, this.sourceRange[0], this.sourceRange[1]);
        const translatedValue = this.translate(invertedValue);
        return translatedValue;
    }

}
