import {excludedTitle,epicProductURL} from './offers.mjs';
export function egdataRows(data,page=0,now=Date.now()){
  if(!Array.isArray(data?.offers)||!Number.isFinite(data.total))throw Error('Catálogo complementar indisponível');
  const rows=[];
  for(const o of data.offers){
    if(o.offerType!=='BASE_GAME'||o.prePurchase===true||typeof o.title!=='string'||!o.title.trim()||excludedTitle(o.title)||typeof o.id!=='string'||!/^[a-f0-9]{32}$/i.test(o.id))continue;
    if(Number.isFinite(Date.parse(o.releaseDate))&&Date.parse(o.releaseDate)>now)continue;
    const url=epicProductURL(o);if(!url)continue;
    const p=o.price?.price,t=Date.parse(o.price?.updatedAt);
    const valid=o.price?.country==='BR'&&p?.currencyCode==='BRL'&&Number.isFinite(t)&&t<=now+60000&&now-t<=72*3600000&&Number.isInteger(p.discountPrice)&&p.discountPrice>0&&Number.isInteger(p.originalPrice)&&p.originalPrice>=p.discountPrice;
    const images=Array.isArray(o.keyImages)?o.keyImages:[];
    const thumb=images.find(i=>i.type==='OfferImageWide'&&/^https:\/\//.test(i.url))?.url||images.find(i=>/^https:\/\//.test(i.url))?.url;
    rows.push({gameID:'epic-'+o.id,external:o.title,thumb,brPrice:valid?p.discountPrice:null,brOriginal:valid?p.originalPrice:null,free:false,source:'Epic Games via egdata',kind:'game',url,observedAt:valid?new Date(t).toISOString():null,thirdParty:true});
  }
  return {rows:[...new Map(rows.map(x=>[x.url,x])).values()],hasMore:page<9&&(page+1)*24<data.total,coverage:'thirdparty',source:'egdata'};
}
