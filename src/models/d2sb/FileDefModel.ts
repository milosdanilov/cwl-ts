import {Expression} from "../../mappings/d2sb/Expression";
import {FileDef} from "../../mappings/d2sb/FileDef";
import {DirentModel} from "../generic/DirentModel";
import {spreadSelectProps} from "../helpers/utils";
import {Serializable} from "../interfaces/Serializable";
import {SBDraft2ExpressionModel} from "./SBDraft2ExpressionModel";

export class SBDraft2FileDefModel extends DirentModel implements Serializable<FileDef>{
    public entryName = new SBDraft2ExpressionModel("", `${this.loc}.filename`);
    public entry     = new SBDraft2ExpressionModel("", `${this.loc}.fileContent`);

    constructor(fileDef?: FileDef, loc?: string) {
        super(loc);
        
        this.deserialize(fileDef)
    }

    customProps: any = {};

    serialize(): FileDef {
       const base = <FileDef> {};

       if (this.entryName.serialize() !== undefined) {
           base.filename = <string | Expression> this.entryName.serialize();
       }
       if (this.entry.serialize() !== undefined) {
           base.fileContent = <string | Expression> this.entry.serialize();
       }

       return Object.assign({}, base, this.customProps);
    }

    deserialize(attr: FileDef): void {
        if (attr) {
            this.entryName = new SBDraft2ExpressionModel(attr.filename, `${this.loc}.filename`);
            this.entryName.setValidationCallback(err => this.updateValidity(err));

            this.entry = new SBDraft2ExpressionModel(attr.fileContent, `${this.loc}.fileContent`);
            this.entry.setValidationCallback(err => this.updateValidity(err));
        }

        spreadSelectProps(attr, this.customProps, ["filename", "fileContent"]);
    }
}