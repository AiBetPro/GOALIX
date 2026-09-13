const BASE='https://api.sportmonks.com/v3/football';

function token(){
  return process.env.SPORTMONKS_TOKEN||''
}

export async function getLive(){
  const t=token();
  if(!t) return {configured:false,data:[]};
  const r=await fetch(`${BASE}/livescores/inplay?include=participants;scores;events;state;periods`,{
    headers:{Authorization:t},
    cache:'no-store'
  });
  if(!r.ok) throw new Error(`Sportmonks ${r.status}`);
  return {configured:true,data:(await r.json()).data||};
}

export async function getInplayOdds(fixtureId?:string){
  const t=token();
  if(!t) return {configured:false,data:[]};
  const path=fixtureId?`/odds/inplay/fixtures/${fixtureId}`:'/odds/inplay';
  const r=await fetch(`${BASE}${path}`,{
    headers:{Authorization:t},
    cache:'no-store'
  });
  if(!r.ok) throw new Error(`Sportmonks ${r.status}`);
  return {configured:true,data:(await r.json()).data||};
}