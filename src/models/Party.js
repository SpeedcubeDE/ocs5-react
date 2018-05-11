
export default class Party {
    constructor() {
        this.id = 0;
        this.name = "";
        this.cubeType = "";
        this.rounds = 0;
        this.currentRound = 0;
        this.inParty = false;
        this.canEdit = false;
        this.started = false;
        this.closed = false;
    }
}
