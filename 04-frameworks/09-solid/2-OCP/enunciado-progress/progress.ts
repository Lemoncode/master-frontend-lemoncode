export class Progress {

    constructor(private file) {}

    getAsPercent(): number {
        return this.file.sent * 100 / this.file.length;
    }
}
