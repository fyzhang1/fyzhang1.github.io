'use strict';
const models = [
  {name:'Qwen3-VL-8B',rows:[['Base',47.6,19.4,23.7,null,null,null,null],['Recent',50.6,20.6,29.2,48.6,68.4,50.3,2.3],['Retrieve',51.6,22.6,41.4,48.4,67.8,48.9,-5.5],['LLM-UM',51.0,22.0,39.2,29.1,68.9,51.5,10.5],['HIM-Agent',51.3,22.6,40.2,50.8,72.7,58.5,20.7],['ExpActivator',58.1,30.9,47.9,52.1,82.6,71.8,42.7]]},
  {name:'MAI-UI-8B',rows:[['Base',46.6,17.9,22.3,null,null,null,null],['Recent',47.6,18.1,21.2,44.5,68.3,50.0,0.0],['Retrieve',49.7,21.6,32.7,44.3,68.3,50.0,0.0],['LLM-UM',48.1,19.0,28.3,26.7,68.3,50.0,0.0],['HIM-Agent',48.2,19.9,28.7,50.5,70.6,54.8,14.1],['ExpActivator',56.5,26.6,42.7,49.6,82.7,72.7,45.2]]},
  {name:'Qwen3.5-9B',rows:[['Base',50.1,17.2,21.4,null,null,null,null],['Recent',49.4,17.9,25.5,47.3,69.5,52.7,10.2],['Retrieve',49.2,19.9,32.5,52.1,68.2,50.0,0.0],['LLM-UM',52.4,20.7,39.8,21.5,61.9,49.0,-3.6],['HIM-Agent',51.4,21.0,37.8,48.4,82.4,61.2,22.0],['ExpActivator',55.9,24.3,40.9,51.0,86.5,70.9,38.9]]},
  {name:'GUI-Owl-1.5-8B',rows:[['Base',58.2,22.7,21.5,null,null,null,null],['Recent',59.1,23.9,27.2,46.5,69.2,52.1,9.1],['Retrieve',60.3,28.2,41.6,48.2,67.8,49.1,-2.8],['LLM-UM',57.9,24.8,30.8,26.6,67.1,48.1,-3.9],['HIM-Agent',58.7,27.2,35.6,51.1,72.5,58.0,19.0],['ExpActivator',61.8,28.9,45.8,53.9,82.6,72.4,44.6]]}
];
// Native horizontal scrolling keeps the results swipeable on touch devices.
function comparisonRows(col, max) {
  return models.map(m => {
    const baseline = Math.max(...m.rows.slice(0, -1).map(r => r[col] ?? -Infinity));
    const ours = m.rows.at(-1)[col];
    return `<div class="chart-row"><div class="model-name">${m.name}</div><div class="bar-pair" role="img" aria-label="${m.name}: strongest baseline ${baseline.toFixed(1)}, ExpActivator ${ours.toFixed(1)}"><div class="bar-line"><span class="bar" style="--width:${baseline/max*84}%"></span><span class="bar-value">${baseline.toFixed(1)}</span></div><div class="bar-line"><span class="bar ours" style="--width:${ours/max*84}%"></span><span class="bar-value">${ours.toFixed(1)}</span></div></div></div>`;
  }).join('');
}
const resultSlides = [
  {name:'Execution', number:'4<span>/4</span>', headline:'Best execution on every backbone.', description:'The highest action-type accuracy, step success, and cumulative success among the evaluated methods.', title:'Personalized execution', unit:'Step success rate (%) · Higher is better', baseline:'Strongest baseline', chart:comparisonRows(2,35), note:'Table 1 · Best baseline for each backbone: Retrieve / HIM-Agent, Retrieve, HIM-Agent, and Retrieve, respectively.'},
  {name:'Proactive', number:'2.3<span>×</span>', headline:'Know when to suggest. And when to abstain.', description:'Approximately 2.3× the MCC of the strongest proactive baseline, across four frozen backbones.', title:'Proactive suggestion', unit:'Matthews correlation coefficient (×100) · Higher is better', baseline:'HIM-Agent', chart:comparisonRows(7,50), note:'Table 1 · MCC measures how well a method distinguishes suggestion opportunities from states where it should abstain.'},
  {name:'Efficiency', number:'~80<span>%</span>', headline:'Less history. More useful context.', description:'Fewer history tokens than task-level retrieval on Qwen3-VL-8B, while improving step success.', title:'History-token cost', unit:'History tokens per step · Lower is better', baseline:'Memory baselines', chart:[['Recent',756.6],['Retrieve',730.6],['LLM-UM',843.7],['HIM-Agent',417.8],['ExpActivator',144.6]].map(([name,value])=>`<div class="chart-row cost-row"><div class="model-name">${name}</div><div class="bar-line" role="img" aria-label="${name}: ${value} history tokens per step"><span class="bar ${name==='ExpActivator'?'ours':''}" style="--width:${value/900*84}%"></span><span class="bar-value">${value.toFixed(1)}</span></div></div>`).join(''), note:'Table 2 · Qwen3-VL-8B. History tokens count the prompt tokens added over the no-history condition: 730.6 for Retrieve, 144.6 for ExpActivator.'}
];
const track = document.getElementById('results-track');
track.innerHTML = resultSlides.map((slide,i)=>`<article class="result-slide" role="group" aria-roledescription="slide" aria-label="${i+1} of 3: ${slide.name}"><div class="slide-main"><div class="slide-summary"><div class="slide-number">${slide.number}</div><h3>${slide.headline}</h3><p>${slide.description}</p></div><div class="slide-data"><h3>${slide.title}</h3><p class="chart-unit">${slide.unit}</p><div class="legend"><span><i class="baseline-key"></i>${slide.baseline}</span><span><i class="ours-key"></i>ExpActivator</span></div><div class="result-chart">${slide.chart}</div></div></div><p class="chart-note">${slide.note}</p></article>`).join('');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let currentSlide = 0, paused = reducedMotion.matches, visible = false, hovering = false;
const panel = document.querySelector('.results-panel');
const pauseButton = document.getElementById('carousel-pause');
function updatePauseButton() {
  pauseButton.innerHTML = paused ? 'Play <span aria-hidden="true">▷</span>' : 'Pause <span aria-hidden="true">Ⅱ</span>';
  pauseButton.setAttribute('aria-label', paused ? 'Start automatic scrolling' : 'Pause automatic scrolling');
}
function stopAutoplay() { paused = true; updatePauseButton(); }
function selectSlide(index, userInitiated = false) {
  const next = (index + resultSlides.length) % resultSlides.length;
  if (userInitiated) stopAutoplay();
  track.scrollTo({left: next * track.clientWidth, behavior: reducedMotion.matches ? 'instant' : 'smooth'});
  if (userInitiated) document.getElementById('carousel-status').textContent = `${next+1} of 3: ${resultSlides[next].name}`;
}
function syncSlide() {
  currentSlide = Math.max(0, Math.min(resultSlides.length-1, Math.round(track.scrollLeft / track.clientWidth)));
  document.querySelectorAll('[data-slide]').forEach((b,i)=>b.setAttribute('aria-pressed', String(i===currentSlide)));
  document.querySelectorAll('.carousel-dots i').forEach((dot,i)=>dot.classList.toggle('active',i===currentSlide));
  document.getElementById('slide-count').textContent = `0${currentSlide+1} / 03`;
}
track.addEventListener('scroll', syncSlide, {passive:true});
track.addEventListener('pointerdown', stopAutoplay, {passive:true});
track.addEventListener('wheel', stopAutoplay, {passive:true});
track.addEventListener('keydown', event => {
  if (event.key==='ArrowRight' || event.key==='ArrowLeft') {
    event.preventDefault(); selectSlide(currentSlide + (event.key==='ArrowRight'?1:-1),true);
  }
});
document.querySelectorAll('[data-slide]').forEach(b=>b.addEventListener('click',()=>selectSlide(Number(b.dataset.slide),true)));
document.getElementById('carousel-prev').addEventListener('click',()=>selectSlide(currentSlide-1,true));
document.getElementById('carousel-next').addEventListener('click',()=>selectSlide(currentSlide+1,true));
pauseButton.addEventListener('click',()=>{paused=!paused;updatePauseButton();});
panel.addEventListener('mouseenter',()=>{hovering=true;});
panel.addEventListener('mouseleave',()=>{hovering=false;});
panel.addEventListener('focusin',event=>{if(event.target!==pauseButton) stopAutoplay();});
new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;},{threshold:0.45}).observe(track);
setInterval(()=>{if(!paused && visible && !hovering && !document.hidden) selectSlide(currentSlide+1);},6500);
reducedMotion.addEventListener('change',event=>{if(event.matches) stopAutoplay();});
let resizeTimer;
window.addEventListener('resize',()=>{clearTimeout(resizeTimer);const index=currentSlide;resizeTimer=setTimeout(()=>{track.scrollTo({left:index*track.clientWidth,behavior:'instant'});},100);});
updatePauseButton();
function rowHtml(row){return `<tr class="${row[0]==='ExpActivator'?'ours-row':''}"><th scope="row">${row[0]}</th>${row.slice(1).map(n=>`<td>${n===null?'—':n.toFixed(1)}</td>`).join('')}</tr>`;}
document.getElementById('results-table').innerHTML=models.map(m=>`<tr class="table-group"><th colspan="8" scope="colgroup">${m.name}</th></tr>${m.rows.map(rowHtml).join('')}`).join('')+'<tr class="table-group"><th colspan="8" scope="colgroup">External references</th></tr>'+rowHtml(['QwenVL-Max',51.6,24.8,27.3,52.2,67.4,49.6,-2.4])+rowHtml(['Always suggest',null,null,null,null,68.3,50.0,0.0]);
document.getElementById('copy-citation').addEventListener('click',async()=>{
  const text=document.getElementById('bibtex').textContent, status=document.getElementById('copy-status');
  try {await navigator.clipboard.writeText(text);status.textContent='BibTeX copied to clipboard.';}
  catch {const selection=window.getSelection(), range=document.createRange();range.selectNodeContents(document.getElementById('bibtex'));selection.removeAllRanges();selection.addRange(range);status.textContent='Citation selected. Press ⌘C or Ctrl+C to copy.';}
});
