import { ProcessState, ConfiguredPreset, Device } from './../shared/transfer-models';

export class Pin {
    constructor(
        public pinNo: number
    ) {}

    toPinDTO(): Pin {
    /* const pin = new Pin();
       pin.pinNo = this.pinNo;
       return pin; */
       return this;
    }
}

export class GrillProcess {
    public grillProcessState: ProcessState;
    public grillProcessStartDate: string;
    public grillProcessEndDate: string;
    public estimatedGrillTime: string; // guess from Api
    public device: Device;
    public preset: ConfiguredPreset = new ConfiguredPreset();
    public pin: Pin;
    public currTimeLeft?: any;

    constructor(device: Device, pin: Pin) {
        this.grillProcessState = ProcessState.STARTING;
        this.device = device;
        this.pin = pin;
    }

    toGrillProcessDTO(): GrillProcess {
        return this;
    }
}