export class UnexpectedTypeOnCryptoPriceError extends Error {
    private static readonly message = 'Parsed crypto price is not a number';

    constructor(private readonly cryptoPrice: any) {
        super(UnexpectedTypeOnCryptoPriceError.message);
        this.stack = new Error().stack;
    }
}
