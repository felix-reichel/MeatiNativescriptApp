import * as dialogsModule from "ui/dialogs";
import { AuthenticationResponse, SuccessState, ErrorNumber } from "../shared/transfer-models";

export function alert(message: string) {
    return dialogsModule.alert({
        // title: "Meati",
        okButtonText: "OK",
        message: message
    });
}

export function alertAuthenticationResponse(response: AuthenticationResponse) {
    switch (response.state) {
        case SuccessState.SUCCESS:
            return dialogsModule.alert({
                title: "Erfolgreich",
                okButtonText: "OK",
                message: response.token
            });
        case SuccessState.FAILURE:
            return dialogsModule.alert({
                title: "FAST ...",
                okButtonText: "OK",
                message: response.token
            });
    }
}

/*
    LoadingScreenHelper: https://github.com/NathanWalker/nativescript-loading-indicator
*/
export class LoadingScreenHelper {

    public static defaultOptions = {
        message: 'Connecting...',
        progress: 0.65,
        android: {
            indeterminate: true,
            cancelable: true,
            cancelListener: function (dialog) { console.log("Loading cancelled") },
            max: 100,
            progressNumberFormat: "%1d/%2d",
            progressPercentFormat: 0.53,
            progressStyle: 1,
            secondaryProgress: 1
        },
        ios: {
            details: "Meatemp is launching!",
            margin: 10,
            dimBackground: true,
            color: "#4B9ED6", // color of indicator and labels
            // background box around indicator
            // hideBezel will override this if true
            backgroundColor: "yellow",
            userInteractionEnabled: false, // default true. Set false so that the touches will fall through it.
            hideBezel: true, // default false, can hide the surrounding bezel
        }
    };
    public static minimizedOptions = {
        message: 'Verbinde...',
    };
}