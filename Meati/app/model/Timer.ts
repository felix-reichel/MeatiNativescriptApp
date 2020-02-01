export class TimerSubject {
    constructor(
        public subject: string = "",
        public seconds: number = 0
    ) {}
}


export class Timer {
    public subjects: TimerSubject[] = [];

    public decrease(): void {
        this.subjects.forEach(s => s.seconds--);
    }

    /*
    * slow approach
    */
    public decreaseReturnSubjects(): TimerSubject[] {
        let finished: TimerSubject[] = [];

        this.subjects.forEach( (s) => { 
            s.seconds--;
            if (s.seconds == 0) {
                finished.push(s);
                this.subjects.slice(this.subjects.indexOf(s));
            }
        });

        return finished;
    }

    public deleteSubject(s: TimerSubject) {
        this.subjects.slice(this.subjects.indexOf(s));
    }

    public editSubject(newSubject: TimerSubject, oldSubject: TimerSubject) {
        let index: number = this.subjects.indexOf(oldSubject);
        this.subjects[index] = newSubject;
    }

}