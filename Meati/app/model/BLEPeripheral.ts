import { EventEmitter, Output } from "@angular/core";
import { ObservableArray } from "tns-core-modules/data/observable-array/observable-array";

export class PinData {
    constructor(
    public timestamp: number,
    public timestampString: string,
    public value: number
    ) {}
}

export class BLEPeripheral {
    public type: string;
    public UUID: string;
    public name: string;
    public RSSI: number;
    public state: string;
    public advertisement: string;
    public manufacturerId?: number;
    public manufacturerData?: ArrayBuffer
    public services?: any;

    @Output() public onNotifyValue?: EventEmitter<{}> = new EventEmitter();

    public tempDataPin1?: ObservableArray<PinData> = new ObservableArray<PinData>(); // if undefined °C -> store -1
    public tempDataPin2?: ObservableArray<PinData> = new ObservableArray<PinData>(); 
    public tempDataPin3?: ObservableArray<PinData> = new ObservableArray<PinData>(); 
    public tempDataPin4?: ObservableArray<PinData> = new ObservableArray<PinData>(); 

    constructor(type: string, UUID: string, name: string, RSSI: number, state: string, advertisement: string, manufacturerId?: number, manufacturerData?: ArrayBuffer, services?: any) {
        this.type = type;
        this.UUID = UUID;
        this.name = name;
        this.RSSI = RSSI;
        this.state = state;
        this.advertisement = advertisement;
        this.manufacturerId = manufacturerId;
        this.manufacturerData = manufacturerData;
        this.services = services;
    }
}