
export enum UserState {
    ACTIVATED,
    PENDING,
    REJECTED,
    DEACTIVATED,
    DELETED
}

export enum ProcessState {
    STARTING,
    RUNNING,
    FINISHED
}

export enum ErrorNumber {
    NO_ERROR,
    EMAIL_OR_USERNAME_ALREADY_IN_USE,
    INVALID_DATA,
    TOKEN_FAILURE,
    ACCOUNT_NOT_ACTIVATED,
    INVALID_CREDENTIALS,
    NOT_AUTHORIZED
}

export enum BbqItemDoneness {
    RARE,
    MEDIUM_RARE,
    MEDIUM,
    WELL_DONE,
    CUSTOM_TEMP,
    NONE
}

export enum BbqCategory {
    BEEF,
    PORK,
    CHICKEN,
    FISH,
    TURKEY,
    OTHER
}

export enum TemperatureMode{
    CELSIUS,
    FAHRENHEIT
}

export enum SuccessState{
    SUCCESS,
    FAILURE
}

export class Device {
    bluetoothUUID: string;
    deviceName: string;
}

export class BbqItem {
    itemName: string;
    category: BbqCategory;
    rareTemperature: TemperatureRange;
    mediumRareTemperature: TemperatureRange;
    mediumTemperature: TemperatureRange;
    mediumDoneTemperature: TemperatureRange;
    doneTemperature: TemperatureRange;
}

export class StaticPreset {
    presetName: string;
    // user: User;
    itemOnBbq: BbqItem; 
    grillTime: string;
}

export class ConfiguredPreset {
    preset: StaticPreset;
    doneness: BbqItemDoneness;
    temperature: number;
}

export class Pin {
    pinNo: number; // ?? used for icons and GrillProcess Entity
}

export class GrillProcess {
    grillProcessState: ProcessState; // Grill Service?
    grillProcessStartDate: string;  // store timestamp on create ...
    grillProcessEndDate: string; // calc?
    estimatedGrillTime: string; // guess from Api
    device: Device; 
    preset: ConfiguredPreset; // set on create
    pin: Pin;
}

export class GrillSession {
    sessionState: ProcessState;
    sessionStartDate: string;
    sessionEndDate: string; 
    grillProcesses: GrillProcess[];
}

export class UserSettings {
    usersettingsid: number;
    sendNotifications: boolean;
    autoConnectWithKnownDevices: boolean;
    alarmOnHardware: boolean;
    secondsBeforeNotification: number;
    // temperatureMode: TemperatureMode;

    constructor() {
        this.usersettingsid = 0;
        this.sendNotifications = true;
        this.autoConnectWithKnownDevices = true;
        this.alarmOnHardware = true;
        this.secondsBeforeNotification = 45;
        // this.temperatureMode = TemperatureMode.CELSIUS;
    }
}

export class User {
    userid: number;
    username: string;
    email: string;
    firstname: string;
    lastname: string;
    password: string;
    avatarURL: string;
    gender: string;
    dateOfBirth: string;
    userSettings: UserSettings;
    sessions: GrillSession[];

    constructor() {
        this.userid = 0;
        this.username = '';
        this.email = '';
        this.password = '';
        this.avatarURL = '';
        this.firstname = '';
        this.lastname = '';
        this.gender = 'M';
        this.dateOfBirth = null;
        this.userSettings = new UserSettings();
        this.sessions = new Array<GrillSession>();
    }
}

export class LoginCredential {
    username: string;
    password: string;

    constructor() {
        this.username = '';
        this.username = '';
    }
}

export class EmailCredential {
    email: string;
}

export class UsernameCredential {
    username: string;
}

export class GeneralResponse {
    error: ErrorNumber;
}

export class LoginResponse extends GeneralResponse {
    token: string;
    state: SuccessState;
}

export class AuthenticationResponse extends GeneralResponse {
    token: string;
    state: SuccessState;
}

export class TemperatureRange {
    id: number;
    start: number;
    end: number;
}
