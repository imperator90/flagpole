import { ProtoValue, iValue } from './value';
import { AssertionContext, Value } from '.';

export const ExtJsComponentTypes = {
    actionsheet: "Ext.ActionSheet",
    audio: "Ext.Audio",
    button: "Ext.Button",
    image: "Ext.Img",
    label: "Ext.Label",
    loadmask: "Ext.LoadMask",
    panel: "Ext.Panel",
    segmentedbutton: "Ext.SegmentedButton",
    sheet: "Ext.Sheet",
    spacer: "Ext.Spacer",
    titlebar: "Ext.TitleBar",
    toolbar: "Ext.Toolbar",
    video: "Ext.Video",
    carousel: "Ext.carousel.Carousel",
    navigationview: "Ext.navigation.View",
    datepicker: "Ext.picker.Date",
    picker: "Ext.picker.Picker",
    slider: "Ext.slider.Slider",
    thumb: "Ext.slider.Thumb",
    tabpanel: "Ext.tab.Panel",
    viewport: "Ext.viewport.Default",
    dataview: "Ext.dataview.DataView",
    list: "Ext.dataview.List",
    nestedlist: "Ext.dataview.NestedList",
    checkboxfield: "Ext.field.Checkbox",
    datepickerfield: "Ext.field.DatePicker",
    emailfield: "Ext.field.Email",
    hiddenfield: "Ext.field.Hidden",
    numberfield: "Ext.field.Number",
    passwordfield: "Ext.field.Password",
    radiofield: "Ext.field.Radio",
    searchfield: "Ext.field.Search",
    selectfield: "Ext.field.Select",
    sliderfield: "Ext.field.Slider",
    spinnerfield: "Ext.field.Spinner",
    textfield: "Ext.field.Text",
    textareafield: "Ext.field.TextArea",
    togglefield: "Ext.field.Toggle",
    treelist: "Ext.list.Tree",
    urlfield: "Ext.field.Url",
    fieldset: "Ext.form.FieldSet",
    formpanel: "Ext.form.Panel"
}

export class ExtJsComponent extends ProtoValue implements iValue {

    protected _path: string;

    public get path(): string {
        return this._path;
    }

    public get name(): string {
        return this._name || this._path || 'ExtJs Component';
    }

    protected get _component(): string {
        return `window.${this._input}`;
    }

    public static async create(referencePath: string, context: AssertionContext, path: string) {
        const element = new ExtJsComponent(referencePath, context, path, path);
        const componentType: string | null = (await element.getType()).$;
        if (componentType !== null) {
            element._name = `<${componentType}> Component @ ${path}`;
        }
        return element;
    }

    private constructor(input: any, context: AssertionContext, name?: string | null, path?: string) {
        super(input, context, (name || 'ExtJs Component'));
        this._path = path || '';
    }
   
    public async getType(): Promise<Value> {
        return this._wrapAsValue(
            await this._eval(`${this._component}.xtype`),
            `Type of ${this.name}`
        );
    }

    public async getId(): Promise<Value> {
        return this._wrapAsValue(
            await this._eval(`${this._component}.getId()`),
            `Id of ${this.name}`
        );
    }

    public async getWidth(): Promise<Value> {
        return this._wrapAsValue(
            await this._eval(`${this._component}.getSize().width`),
            `Width of ${this.name}`
        );
    }

    public async getHeight(): Promise<Value> {
        return this._wrapAsValue(
            await this._eval(`${this._component}.getSize().height`),
            `Width of ${this.name}`
        );
    }

    public async getSize(): Promise<Value> {
        return this._wrapAsValue(
            await this._eval(`${this._component}.getSize()`),
            `Size of ${this.name}`
        );
    }

    public async getText(): Promise<Value> {
        return this._wrapAsValue(
            await this._eval(`${this._component}.getText()`),
            `Text of ${this.name}`
        );
    }

    public async getValue(): Promise<Value> {
        return this._wrapAsValue(
            await this._eval(`${this._component}.getValue()`),
            `Value of ${this.name}`
        );
    }

    public async setValue(value: string): Promise<Value> {
        return this._wrapAsValue(
            await this._eval(`${this._component}.setValue(${JSON.stringify(value)})`),
            `Set value of ${this.name}`
        );
    }

    public async setData(value: string): Promise<Value> {
        return this._wrapAsValue(
            await this._eval(`${this._component}.setData(${JSON.stringify(value)})`),
            `Set data of ${this.name}`
        );
    }

    public async getData(): Promise<Value> {
        return this._wrapAsValue(
            await this._eval(`${this._component}.getData()`),
            `Data of ${this.name}`
        );
    }

    public async disable(): Promise<Value> {
        return this._wrapAsValue(
            await this._eval(`${this._component}.disable()`),
            `Disable ${this.name}`
        );
    }

    public async enable(): Promise<Value> {
        return this._wrapAsValue(
            await this._eval(`${this._component}.enable()`),
            `Enable ${this.name}`
        );
    }

    public async hide(): Promise<Value> {
        return this._wrapAsValue(
            await this._eval(`${this._component}.Hide()`),
            `Hide ${this.name}`
        );
    }

    public async show(): Promise<Value> {
        return this._wrapAsValue(
            await this._eval(`${this._component}.show()`),
            `Show ${this.name}`
        );
    }

    public async focus(): Promise<Value> {
        return this._wrapAsValue(
            await this._eval(`${this._component}.focus()`),
            `Focus on ${this.name}`
        );
    }

    public async isHidden(): Promise<Value> {
        return this._wrapAsValue(
            await this._eval(`${this._component}.isHidden() || false`),
            `Is ${this.name} hidden?`
        );
    }

    public async isVisible(): Promise<Value> {
        return this._wrapAsValue(
            await this._eval(`${this._component}.isVisible() || false`),
            `Is ${this.name} visible?`
        );
    }

    public async isEnabled(): Promise<Value> {
        return this._wrapAsValue(
            await this._eval(`${this._component}.isEnabled() || false`),
            `Is ${this.name} enabled?`
        );
    }

    public async isDisabled(): Promise<Value> {
        return this._wrapAsValue(
            await this._eval(`${this._component}.isDisabled() || false`),
            `Is ${this.name} hidden?`
        );
    }

    public async getProperty(propertyName: string): Promise<Value> {
        return this._wrapAsValue(
            await this._eval(`${this._component}.${propertyName}`),
            `${this.name}.${propertyName}`
        );
    }

    public async call(method: string, ...args: any[]): Promise<Value> {
        args.forEach((arg, i) => {
            args[i] = JSON.stringify(arg);
        });
        return this._wrapAsValue(
            await this._eval(`${this._component}.${method}(${args.join(',')})`),
            `${this.name}.${method}(${String(args)})`
        );
    }

    public async fireEvent(eventName: string): Promise<Value> {
        return this._wrapAsValue(
            await this._eval(`${this._component}.fireEvent("${eventName}")`),
            `Fired ${eventName} on ${this.name}`
        );
    }

    public async click(): Promise<any> {
        return await this._eval(`${this._component}.element.dom.click()`);
    }

    protected async _eval(js: string): Promise<any> {
        if (this._context.page !== null) {
            return await this._context.page.evaluate(js);
        }
        throw new Error('Page was null.');   
    }


}