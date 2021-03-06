// @flow
const baseX = require('base-x');

const Base58Converter = baseX('123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz');
const Base58Regexp = new RegExp('^[123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]{0,}$');

/**
 * Base58 encoding / decoding
 */
export class Base58 {

    /**
     *
     * @param buffer
     * @returns {string}
     */
    static encode(buffer): string {
        return Base58Converter.encode(buffer);
    }

    /**
     *
     * @param {string} Base58 encoded string
     * @returns {Buffer}
     */
    static decode(string: string): Uint8Array {
        return new Uint8Array(Base58Converter.decode(string));
    }

    static isValid(string: string): boolean {
        return Base58Regexp.test(string);
    }
}
