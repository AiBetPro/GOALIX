export type Selection={
  matchId:string;
  label:string;
  market:string;
  odd:number
};

export type Bet={
  id:string;
  createdAt:string;
  stake:number;
  totalOdds:number;
  potentialWin:number;
  status:'PENDING'|'WON'|'LOST';
  selections:Selection[]
};

let balance=10000;
const bets:Bet[]=[];

export function getWallet(){
  return {balance,currency:'XOF'};
}

export function listBets(){
  return [...bets].reverse();
}

export function placeBet(input:{
  stake:number;
  selections:Selection[];
  expectedOdds:number
}){
  if(!Number.isFinite(input.stake)||input.stake<=0) throw new Error('Mise invalide');
  if(input.stake>balance) throw new Error('Solde insuffisant');
  if(!input.selections.length) throw new Error('Coupon vide');
  
  const total=input.selections.reduce((p,s)=>p*s.odd,1);
  if(Math.abs(total-input.expectedOdds)>0.001) throw new Error('Les cotes ont changé. Actualisez le coupon.');
  
  balance-=input.stake;
  const bet:Bet={
    id:'B'+Date.now(),
    createdAt:new Date().toISOString(),
    stake:Number(input.stake.toFixed(2)),
    totalOdds:Number(total.toFixed(2)),
    potentialWin:Number((input.stake*total).toFixed(2)),
    status:'PENDING',
    selections:input.selections
  };
  
  bets.push(bet);
  return {bet,wallet:getWallet()};
}