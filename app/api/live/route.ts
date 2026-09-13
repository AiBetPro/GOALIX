import {NextResponse} from 'next/server';
import {getLive} from '../../../lib/sportmonks';

export async function GET(){
  try{
    return NextResponse.json(await getLive())
  }catch(e){
    return NextResponse.json({error:'Impossible de récupérer le live',details:String(e)},{status:502})
  }
}