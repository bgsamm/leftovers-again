/**
 * Summon Talonflames to cast 'Roost' over and over.
 *
 * npm run develop -- --bot=anythinggoes/tester/rooster.js
 */


import AI from 'ai';
import team from 'lib/team';
import {MOVE, SWITCH} from 'decisions';

export default class Predetermined extends AI {
  constructor() {
    super();
    this.meta = {
      accepts: 'anythinggoes',
      format: 'anythinggoes',
      // note that this will use the same random team for the duration of the
      // session! team is only set at initialization.
      team: this.getTeam()
    };

    this.ctr = -1;
  }

  getTeam() {
    return team.random();
  }

  onRequest(state) {
    if (state.forceSwitch || state.teamPreview) {
      // our pokemon died :(
      // choose a random one
      const possibleMons = state.self.reserve.filter( (mon) => {
        if (mon.condition === '0 fnt') return false;
        if (mon.active) return false;
        return true;
      });
      const myMon = this.pickOne(possibleMons);
      return new SWITCH(myMon);
    }
    // pick a random move
    try {
      const possibleMoves = state.self.active.moves.filter( move => !move.disabled );
      const myMove = this.pickOne(possibleMoves);
      return new MOVE(myMove);
    } catch(e) {
      console.log('broke when checking possible moves:', e);
      console.dir(state);
      return null;
    }
  }

  pickOne(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }
}

export default Predetermined;