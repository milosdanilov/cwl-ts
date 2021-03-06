import {OutputBinding} from "./OutputBinding";
import {Expression} from "./Expression";


/**
 * Describes how to generate an output parameter based on the files produced
 * by a CommandLineTool.
 *
 * The output parameter is generated by applying these operations in
 * the following order:
 *
 *   - glob
 *   - loadContents
 *   - outputEval
 *
 */

export interface CommandOutputBinding extends OutputBinding {


    /**
     * Find files relative to the output directory, using POSIX glob(3)
     * pathname matching.  If provided an array, find files that match any
     * pattern in the array.  If provided an expression, the expression must
     * return a string or an array of strings, which will then be evaluated as
     * one or more glob patterns.  Must only match and return files which
     * actually exist.
     *
     */
    glob?: string | Expression | Array<string>;


    /**
     * For each file matched in `glob`, read up to
     * the first 64 KiB of text from the file and place it in the `contents`
     * field of the file object for manipulation by `outputEval`.
     *
     */
    loadContents?: boolean;


    /**
     * Evaluate an expression to generate the output value.  If `glob` was
     * specified, the value of `self` must be an array containing file objects
     * that were matched.  If no files were matched, `self' must be a zero
     * length array; if a single file was matched, the value of `self` is an
     * array of a single element.  Additionally, if `loadContents` is `true`,
     * the File objects must include up to the first 64 KiB of file contents
     * in the `contents` field.
     *
     */
    outputEval?: string | Expression;

}