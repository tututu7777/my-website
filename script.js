const live='https://super-ip-ai-showcase-1113.elated-cat-5292.chatgpt.site';
let data,settings,screen='',reason='direct',qrMode='hold';
const $=id=>document.getElementById(id);
const el=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n};
const money=v=>(v/100).toFixed(2).replace(/\.00$/,'').replace(/(\.\d)0$/,'$1');
function media(src){return src.startsWith('/assets/')?src.slice(1):src.startsWith('/api/media')?live+src:src}
function button(text,cls,handler){const n=el('button',cls,text);n.type='button';n.onclick=handler;return n}
function render(){document.title=`${data.title} · AI新媒体获客部`;$('intro').textContent=data.subtitle;$('ending').textContent=data.subtitle;const blocks=$('blocks');blocks.replaceChildren();const nav=$('nav');nav.replaceChildren();let imageIndex=0;
  for(const b of data.blocks.filter(x=>x.visible)){
    if(b.type==='image'){const fig=el('figure','poster');fig.id=b.id;const img=el('img');img.src=media(b.src);img.alt=b.title+'。'+b.caption;img.loading=imageIndex?'lazy':'eager';fig.append(img);const cap=el('figcaption');cap.append(el('strong','',b.title),el('span','',b.caption));fig.append(cap);blocks.append(fig);const a=el('a');a.href='#'+b.id;a.append(el('small','',String(++imageIndex).padStart(2,'0')),document.createTextNode(b.title));nav.append(a)}
    else{const section=el('section','video');section.id=b.id;section.append(el('span','eyebrow','● VIDEO / 视频'),el('h2','',b.title),el('p','',b.caption));if(b.src){const vid=el('video');vid.controls=true;vid.playsInline=true;vid.preload='metadata';vid.src=media(b.src);if(b.poster)vid.poster=media(b.poster);section.append(vid)}else{const box=el('div','video-empty');box.append(el('span','play','▶'),el('strong','','精彩内容，即将呈现'),el('small','','视频更新后，可在这里直接观看'));section.append(box)}blocks.append(section)}
  }
  settings=Object.assign({enabled:true,mode:'payment',amountCents:990,productName:'超级IP智能体 · 试用体验',productDescription:'体验 AI 新媒体内容创作，添加微信了解使用方式。',payButtonText:'购买试用',wechatButtonText:'添加微信',showWechatShortcut:true,paymentMethod:'link',checkoutUrl:'',paymentQrImage:'',qrImage:'',contactName:'专属顾问',wechatId:'',contactDescription:'添加微信，了解产品与试用详情。',returnDescription:'如已付款，请将支付凭证发给顾问核对。',cancelDescription:'没关系，先添加微信，了解清楚再决定。'},data.conversion||{});
  const cta=$('cta');cta.replaceChildren();if(settings.enabled){cta.hidden=false;const row=el('div','cta-inner');if(settings.mode==='payment'&&settings.showWechatShortcut)row.append(button('加微信','shortcut',()=>showContact('direct')));row.append(button(settings.mode==='payment'?`¥${money(settings.amountCents)}  ${settings.payButtonText}  ›`:settings.wechatButtonText+'  ›','main-button',()=>settings.mode==='payment'?show('checkout'):showContact('direct')));cta.append(row)}else cta.hidden=true;
}
function show(next){screen=next;$('modal').hidden=false;document.body.style.overflow='hidden';draw()}
function close(){if(screen==='checkout'||screen==='pay-qr'){showContact('cancelled');return}screen='';$('modal').hidden=true;document.body.style.overflow=''}
function showContact(why){reason=why;qrMode='hold';show('contact')}
function draw(){const root=$('dialog-content');root.replaceChildren();if(screen==='checkout'){
  root.append(el('span','eyebrow','开始你的 AI 体验'),el('h2','',settings.productName),el('p','',settings.productDescription),el('div','product',settings.productName),el('div','amount','¥'+money(settings.amountCents)));
  const ready=settings.paymentMethod==='link'?!!settings.checkoutUrl:!!settings.paymentQrImage;
  root.append(el('p',ready?'':'hint',ready?'请在收款页面核对金额和收款方后付款。':'收款暂未开通，可先加微信了解详情。'));
  const pay=button(settings.paymentMethod==='link'?'打开收银台':'查看收款二维码','action',()=>{if(settings.paymentMethod==='qrcode'){show('pay-qr');return}try{sessionStorage.setItem('super-ip-checkout-pending',String(Date.now()))}catch{}window.location.href=settings.checkoutUrl});pay.disabled=!ready;root.append(pay,button('暂不付款，先加微信','minor',()=>showContact('cancelled')));
}else if(screen==='pay-qr'){
  root.append(el('h2','',settings.productName),el('div','amount','¥'+money(settings.amountCents)));const img=el('img','qr');img.src=media(settings.paymentQrImage);img.alt='收款二维码';root.append(img,el('p','','请核对金额和收款方；到账情况需人工核对。'),button('我已付款，添加顾问','action',()=>showContact('returned')),button('取消付款，先咨询','minor',()=>showContact('cancelled')));
}else{
  root.append(el('span','eyebrow','保持联系 · 更多可能'),el('h2','',reason==='cancelled'?'先聊一聊，也很好。':reason==='direct'?'添加微信，开启新可能。':'下一步，添加专属顾问。'),el('p','',reason==='cancelled'?settings.cancelDescription:reason==='direct'?settings.contactDescription:settings.returnDescription));
  const tabs=el('div','qr-tabs');tabs.append(button('长按识别',qrMode==='hold'?'active':'',()=>{qrMode='hold';draw()}),button('截图扫码',qrMode==='screenshot'?'active':'',()=>{qrMode='screenshot';draw()}));root.append(tabs);
  if(settings.qrImage){const img=el('img','qr');img.src=media(settings.qrImage);img.alt=settings.contactName+'的微信二维码';root.append(img)}else root.append(el('div','pending','微信二维码待上传'));
  root.append(el('p','qr-help',qrMode==='hold'?'长按二维码，选择“识别图中二维码”；若无此选项，请切换截图扫码。':'截图保存后，打开微信扫一扫，从相册选择图片。'));
  if(settings.wechatId){const row=el('div','wechat-id');row.append(document.createTextNode('微信号：'+settings.wechatId));row.append(button('复制','',async()=>{try{await navigator.clipboard.writeText(settings.wechatId)}catch{}}));root.append(row)}
}
}
$('close').onclick=close;$('modal').onclick=e=>{if(e.target===$('modal'))close()};document.addEventListener('keydown',e=>{if(e.key==='Escape'&&screen)close()});$('share').onclick=async()=>{try{await navigator.clipboard.writeText(location.href);$('share').textContent='已复制'}catch{prompt('复制网页链接',location.href)}};
addEventListener('scroll',()=>{const max=document.documentElement.scrollHeight-innerHeight;$('progress').style.width=(max?Math.min(100,scrollY/max*100):0)+'%'},{passive:true});
try{const ts=Number(sessionStorage.getItem('super-ip-checkout-pending'));if(ts&&Date.now()-ts<86400000){sessionStorage.removeItem('super-ip-checkout-pending');addEventListener('load',()=>showContact('returned'))}}catch{}
fetch('content.json',{cache:'no-store'}).then(r=>r.json()).then(v=>{data=v;render()}).catch(()=>{$('blocks').append(el('p','hint','页面内容暂时无法加载，请刷新重试。'))});
