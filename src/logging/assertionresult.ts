import { Flagpole } from '..';
import { iLogItem, LogItem, LogItemType } from './logitem';
import { iConsoleLine, PassLine, OptionalFailLine, FailLine, DetailLine } from './consoleline';

export abstract class AssertionResult extends LogItem implements iLogItem {

    public readonly type: LogItemType = LogItemType.Result;
    public abstract className: string;

    public abstract toConsole(): iConsoleLine[]

    protected _rawDetails: any;    

}

export class AssertionPass extends AssertionResult implements iLogItem {

    public readonly className: string = 'pass';

    public get passed(): boolean {
        return true;
    }

    constructor(message: string) {
        super(message);
    }

    public toConsole(): iConsoleLine[] {
        return [new PassLine(this.message)];
    }

}

export class AssertionFail extends AssertionResult implements iLogItem {

    public readonly className: string = 'fail';

    public get failed(): boolean {
        return true;
    }

    constructor(message: string, errorDetails: any) {
        super(message);
        this._rawDetails = errorDetails;
    }

    public get isDetails(): boolean {
        return !!this._rawDetails;
    }

    public get detailsMessage(): string {
        // Get rid of blanks
        if (Flagpole.isNullOrUndefined(this._rawDetails)) {
            return '';
        }
        // Okay give me something
        const type: string = Flagpole.toType(this._rawDetails);
        const details = this._rawDetails;
        if (type == 'array') {
            const arr = details as Array<any>;
            if (arr.every((item) => { return typeof item == 'string'; })) {
                return this._rawDetails;
            }
        }
        else if (details && details.message) {
            return details.message;
        }
        return String(details);
    }

    public toConsole(): iConsoleLine[] {
        return [
            new FailLine(this.message),
            new DetailLine(this.detailsMessage)
        ];
    }

}

export class AssertionFailOptional extends AssertionFail implements iLogItem {

    public readonly className: string = 'failOptional';

    public get isOptional(): boolean {
        return true;
    }

    public toConsole(): iConsoleLine[] {
        return [new OptionalFailLine(this.message)];
    }

}