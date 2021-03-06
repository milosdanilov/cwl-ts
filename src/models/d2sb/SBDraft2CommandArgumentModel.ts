import {CommandLineBinding} from "../../mappings/d2sb/CommandLineBinding";
import {CommandArgumentModel} from "../generic/CommandArgumentModel";
import {Serializable} from "../interfaces/Serializable";
import {SBDraft2CommandLineBindingModel} from "./SBDraft2CommandLineBindingModel";
import {EventHub} from "../helpers/EventHub";
import {ErrorCode} from "../helpers/validation/ErrorCode";

export class SBDraft2CommandArgumentModel extends CommandArgumentModel implements Serializable<
    string
    | CommandLineBinding> {

    hasExprPrimitive = false;
    hasShellQuote = false;
    primitive: string;

    public updateBinding(binding: CommandLineBinding) {
        this.hasBinding = true;
        this.primitive  = undefined;

        this.binding.prefix = binding.prefix;
        this.binding.position = binding.position;
        this.binding.separate = binding.separate;
        this.binding.itemSeparator = binding.itemSeparator;
    }

    updatePrimitive(str: string) {
        this.hasBinding = false;
        this.binding    = undefined;
        this.primitive  = str;
    }

    toggleBinding(state: boolean): void {
        if (state) {
            this.binding = new SBDraft2CommandLineBindingModel({}, this.loc, this.eventHub);
            this.binding.setValidationCallback(ev => this.updateValidity(ev));
            this.primitive = undefined;
        } else {
            this.primitive = "";
            this.binding.clearIssue(ErrorCode.ALL);
            this.binding = undefined;
        }

        this.hasBinding = state;
    }

    get arg(): string | CommandLineBinding | SBDraft2CommandLineBindingModel {
        return this.primitive || this.binding;
    }

    set arg(value: string | CommandLineBinding | SBDraft2CommandLineBindingModel) {
        this.deserialize(value);
    }

    protected binding: SBDraft2CommandLineBindingModel;

    constructor(arg?: string | CommandLineBinding, loc?: string, eventHub?: EventHub) {
        super(loc, eventHub);
        this.deserialize(arg || {});
    }

    toString(): string {
        if (this.primitive) return this.primitive;

        if (this.binding) {
            return this.binding.valueFrom.toString();
        }

        return "";
    }

    serialize(): string | CommandLineBinding {
        if (this.primitive) {
            return this.primitive;
        } else if (this.binding) {
            return this.binding.serialize();
        }
    }

    deserialize(attr: string | CommandLineBinding | SBDraft2CommandLineBindingModel): void {
        if (typeof attr === "string") {
            this.hasBinding = false;
            this.primitive  = attr;
        } else if (attr instanceof SBDraft2CommandLineBindingModel) {
            this.hasBinding = true;
            this.binding    = new SBDraft2CommandLineBindingModel(attr.serialize(), this.loc, this.eventHub);
            this.binding.setValidationCallback(err => this.updateValidity(err));
        } else {
            this.hasBinding = true;
            this.binding    = new SBDraft2CommandLineBindingModel(<CommandLineBinding> attr, this.loc, this.eventHub);
            this.binding.setValidationCallback(err => this.updateValidity(err));
        }
    }
}