import { Injectable } from "@angular/core";
import { Observable as RxObservable } from "rxjs/Observable";
import { HttpClient } from "@angular/common/http";
import "rxjs/add/operator/map";

@Injectable()
export class AppDemoService {
    private apiUrl = "https://jsonplaceholder.typicode.com/posts/1";

    constructor(private http: HttpClient) { }

    public getData(): RxObservable<any> {
        return this.http.get(this.apiUrl).map(res => res);
    }
}