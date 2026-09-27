'use strict';
(() => {
  const root = document.querySelector('.phone-demo');
  const content = document.getElementById('phone-content');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const cup = '<svg viewBox="0 0 48 48" fill="none" aria-hidden="true"><path d="M12 17h24l-3 26H15z" fill="#d6bb97"/><path d="M10 13h28v5H10z" fill="#805c42"/><path d="M14 9h20l4 4H10z" fill="#ac8663"/><path d="M25 3l-3 27" stroke="#fff" stroke-width="3"/><path d="M14 27h20l-1 9H15z" fill="#f8f4eb"/></svg>';
  const sun = '<svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="13" fill="#ffd677"/><path d="M32 3v8m0 42v8M3 32h8m42 0h8M11 11l6 6m30 30 6 6M11 53l6-6m30-30 6-6" stroke="#ffd677" stroke-width="3" stroke-linecap="round"/></svg>';
  const cloud = '<svg viewBox="0 0 64 48" aria-hidden="true"><path d="M15 36a12 12 0 0 1-1-24 17 17 0 0 1 32-2 13 13 0 1 1 4 26z" fill="#fff"/><path d="M20 41l-3 5m17-5-3 5m17-5-3 5" stroke="#a3d8ff" stroke-width="3" stroke-linecap="round"/></svg>';
  const agentIcon = '<span class="agent-icon">E<span>·</span></span>';
  const nav = (title, right='') => `<div class="app-nav"><span class="nav-back">‹</span><strong>${title}</strong><span>${right}</span></div>`;
  const agentBar = text => `<div class="agent-pill">${agentIcon}<span>${text}</span><i class="thinking-dots"><b></b><b></b><b></b></i></div>`;
  const coffeeNav = '<div class="coffee-tabbar"><span class="active">⌂<small>Order</small></span><span>♡<small>Favorites</small></span><span>◷<small>Activity</small></span><span>◎<small>Account</small></span></div>';
  const keyboard = '<div class="ios-keyboard">'+['qwertyuiop','asdfghjkl','⇧zxcvbnm⌫'].map(row=>'<div class="key-row">'+[...row].map(key=>`<span class="ios-key">${key}</span>`).join('')+'</div>').join('')+'<div class="key-row keyboard-bottom"><span class="ios-key">123</span><span class="ios-key space-key">space</span><span class="ios-key">return</span></div></div>';
  function requestScreen(){return `<div class="phone-page assistant-page">${nav('ExpActivator','···')}<div class="assistant-welcome">${agentIcon}<h3>Good morning.</h3><p>What can I do for you?</p></div><div class="phone-chat user-chat delayed-chat" data-reveal="3300">Order my usual coffee.</div><div class="phone-chat assistant-chat" data-reveal="4100">I’ll find your usual order.</div><div class="composer"><span class="typed-request" data-type="Order my usual coffee."></span><span class="send-button" data-tap>↑</span></div>${keyboard}</div>`;}
  function homeScreen(){return `<div class="phone-page ios-home"><div class="home-widget"><span>Sunday, September 27</span><strong>Good morning</strong><small>Your day, a little easier.</small></div><div class="app-grid"><div><i class="app-icon weather-icon">☀</i><span>Weather</span></div><div><i class="app-icon calendar-icon"><small>Sun</small>27</i><span>Calendar</span></div><div><i class="app-icon coffee-icon" data-tap>${cup}</i><span>Daily Coffee</span></div><div><i class="app-icon maps-icon">↗</i><span>Maps</span></div><div><i class="app-icon clock-icon">◷</i><span>Clock</span></div><div><i class="app-icon notes-icon">≡</i><span>Notes</span></div></div>${agentBar('Opening your preferred café')}<div class="ios-dock"><i>☎</i><i>◉</i><i>✉</i><i>♫</i></div></div>`;}
  function menuScreen(){return `<div class="phone-page coffee-page">${nav('Daily Coffee','♧')}<div class="coffee-body"><div class="pickup-location"><span>Pickup from</span><strong>Campus café <b>⌄</b></strong><small>Open · 4 min walk</small></div><h3>Good morning, Alex.</h3><div class="usual-card" data-tap><div class="coffee-picture">${cup}</div><div><small>Your usual</small><h4>Iced oat latte</h4><p>Medium · Less ice</p><strong>S$6.50 <span>＋</span></strong></div></div><div class="menu-categories"><b>For you</b><span>Coffee</span><span>Tea</span></div><div class="menu-item"><span class="small-coffee">${cup}</span><div><strong>Iced americano</strong><small>Bold and refreshing</small></div><b>＋</b></div><div class="menu-item"><span class="small-coffee">${cup}</span><div><strong>Flat white</strong><small>Smooth and balanced</small></div><b>＋</b></div></div>${coffeeNav}${agentBar('Matching your usual drink')}</div>`;}
  function customizeScreen(){return `<div class="phone-page coffee-page">${nav('Customize','♡')}<div class="coffee-body customize-body"><div class="product-heading"><span class="product-cup">${cup}</span><div><h3>Iced latte</h3><p>Made just the way you like it.</p><strong>S$6.50</strong></div></div><div class="option-group"><label>Size</label><div><span>Small</span><span class="chosen" data-select="700">Medium</span><span>Large</span></div></div><div class="option-group"><label>Milk</label><div><span>Dairy</span><span class="chosen" data-select="1500">Oat</span><span>Soy</span></div></div><div class="option-group"><label>Ice</label><div><span>Regular</span><span class="chosen" data-select="2300">Less ice</span><span>No ice</span></div></div><div class="option-group"><label>Sweetness</label><div><span class="chosen" data-select="3100">No sugar</span><span>Regular</span></div></div><p class="preference-confirm" data-reveal="3400">✓ Preferences applied from your history</p><button class="coffee-button" data-tap data-advance>Add to order <span>S$6.50</span></button></div>${agentBar('Applying the preferences that fit this screen')}</div>`;}
  function reviewScreen(){return `<div class="phone-page coffee-page">${nav('Review order')}<div class="coffee-body"><div class="order-location"><small>Pickup</small><h3>Campus café</h3><p>Ready in about 8 minutes</p></div><div class="order-product"><span class="small-coffee">${cup}</span><div><strong>Iced oat latte</strong><p>Medium · Less ice · No sugar</p><span>1 × S$6.50</span></div></div><div class="receipt-row"><span>Subtotal</span><b>S$6.50</b></div><div class="receipt-row"><span>Pickup fee</span><b>S$0.00</b></div><div class="receipt-row total"><span>Total</span><b>S$6.50</b></div><div class="confirmation-note">Your usual, ready to order.<br>Please confirm to continue.</div><button class="coffee-button" data-tap data-advance>Confirm order <span>→</span></button><small class="phone-demo-label">Simulated confirmation · No payment</small></div></div>`;}
  function coffeeDone(){return `<div class="phone-page coffee-page">${nav('Order confirmed')}<div class="coffee-body order-done"><div class="success-seal">✓</div><h3>Your usual is on its way.</h3><p>Pickup at Campus café</p><div class="pickup-ticket"><span>Pickup number</span><strong>A024</strong><div></div><p>Iced oat latte</p><small>Medium · Less ice · No sugar</small><b>Ready around 8:20</b></div><div class="assistant-result">${agentIcon}<p>Done. Your usual drink, with your usual preferences.</p></div><small class="phone-demo-label">Demo complete · No real order placed</small></div></div>`;}
  function lockScreen(expanded=false,notification=false){return `<div class="phone-page lock-page"><div class="lock-date">Sunday, September 27</div><div class="lock-time">${notification?'8:05':'8:04'}</div><div class="lock-location">⌂ At home</div>${notification?`<div class="ios-notification ${expanded?'expanded':''}"><div class="notification-head">${agentIcon}<strong>ExpActivator</strong><span>now</span></div><h4>Your morning weather?</h4><p>You usually check the forecast before heading out. Shall I take a look?</p>${expanded?'<button data-tap data-advance>Check weather <span>→</span></button><span class="notification-later">Not now</span>':'<small data-tap>Tap to view</small>'}</div>`:'<div class="lock-quiet"><span>◌</span><p>No suggestion yet.</p><small>Waiting for the right context.</small></div>'}<div class="lock-bottom"><span>⌁</span><span>◎</span></div></div>`;}
  function weatherScreen(hourly=false){return `<div class="phone-page weather-page"><div class="weather-scroll ${hourly?'show-hourly':''}"><div class="weather-heading"><p>Singapore</p><strong>28°</strong>${sun}<span>Partly cloudy</span><small>H: 31°  L: 26°</small></div><div class="weather-card rain-summary">${cloud}<p>Rain expected around 9:00.<br><b>Bring an umbrella if you head out.</b></p></div><div class="weather-card hourly-card" data-tap><label>Hourly forecast</label><div class="hours"><div><span>Now</span>${sun}<b>28°</b></div><div><span>9 AM</span>${cloud}<b>27°</b></div><div><span>10 AM</span>${cloud}<b>27°</b></div><div><span>11 AM</span>${sun}<b>29°</b></div></div></div><div class="weather-card daily-card"><label>Next few days</label><div>Today <span>☀</span> 26° ━━━ 31°</div><div>Mon <span>☂</span> 25° ━━━ 30°</div><div>Tue <span>☀</span> 26° ━━━ 32°</div></div><div class="weather-details"><div class="weather-card"><label>Feels like</label><strong>31°</strong></div><div class="weather-card"><label>Humidity</label><strong>78%</strong></div></div></div><div class="weather-bottom"><span>☰</span><span>● ○</span><span>⊕</span></div>${agentBar(hourly?'Reading the forecast for your morning':'Opening Weather after your confirmation')}</div>`;}
  function weatherDone(){return `<div class="phone-page assistant-page">${nav('ExpActivator','···')}<div class="conversation-date">Today, 8:05 AM</div><div class="phone-chat assistant-chat">Would you like your morning weather?</div><div class="phone-chat user-chat">Yes, check it.</div><div class="weather-answer">${sun}<span>Singapore · This morning</span><h3>28° <small>Partly cloudy</small></h3><p>Rain is expected around 9 AM. Take an umbrella when you leave.</p><small>Forecast checked after your confirmation</small></div><div class="task-done-chip">✓ Morning weather checked</div><div class="idle-composer">Message ExpActivator <span>↑</span></div></div>`;}
  const scenarios={
    personal:{label:'Instruction-driven',intro:'“Order my usual coffee.” Watch the agent recover an unstated preference and apply it at each screen.',clock:'8:12',badge:'Step-level activation',steps:[
      {name:'Receive the request',detail:'The user gives an ambiguous instruction.',evidence:'The request names neither the café nor the drink. Personal history supplies the missing context.',action:'User types “Order my usual coffee.”',render:requestScreen,duration:5100,tap:2900},
      {name:'Find the preferred app',detail:'Relevant history identifies the café.',evidence:'Illustrative history: the user’s recent coffee orders were placed in Daily Coffee, at Campus café.',action:'Tap Daily Coffee to begin the familiar task.',render:homeScreen,duration:3200,tap:1800},
      {name:'Recommend the usual drink',detail:'The menu activates a relevant past choice.',evidence:'Applicable preference: iced oat latte. The current menu determines which historical choice can be used here.',action:'Select the usual iced oat latte.',render:menuScreen,duration:4100,tap:2700},
      {name:'Apply personal preferences',detail:'The reference changes with the screen.',evidence:'On the customization screen: medium size, oat milk, less ice, and no sugar. Example preferences, selected at this step.',action:'Set oat milk, less ice, and no sugar; add to order.',render:customizeScreen,duration:5400,tap:4300},
      {name:'Review and confirm',detail:'The user confirms the prepared order.',evidence:'The selected experience guides configuration. This simulated user confirmation authorizes the final order.',action:'Simulated user taps “Confirm order.”',render:reviewScreen,duration:4500,tap:3100},
      {name:'Complete the task',detail:'The result reflects the user’s preferences.',evidence:'One instruction, multiple screen-specific references. The completed order preserves the preferred café, drink, and options.',action:'Order confirmed. The personalized task is complete.',render:coffeeDone,duration:6500}
    ]},
    proactive:{label:'Context-driven',intro:'It is morning, and the user is at home. Watch the agent recognize a routine, offer help, and act after confirmation.',clock:'8:05',badge:'Task-level activation',steps:[
      {name:'Observe the context',detail:'No instruction has been given.',evidence:'Illustrative context: at home, just before the morning routine. The agent has not emitted a suggestion.',action:'Observe time and scenario; wait for sufficient support.',render:()=>lockScreen(false,false),duration:3600},
      {name:'Activate a morning routine',detail:'Time and scenario support a suggestion.',evidence:'The paper reports an at-home weather routine at 08:05. This simulation illustrates that contextual trigger.',action:'A morning-weather suggestion appears on the lock screen.',render:()=>lockScreen(false,true),duration:4400,tap:3000},
      {name:'Ask before acting',detail:'The user accepts the suggestion.',evidence:'An activated intent is a reference for a suggestion, not authorization to execute. Confirmation is simulated here.',action:'Simulated user taps “Check weather.”',render:()=>lockScreen(true,true),duration:4200,tap:2800},
      {name:'Open the relevant app',detail:'The accepted suggestion becomes a task.',evidence:'After acceptance, the illustrative workflow opens Weather. Forecast values are sample data, not paper measurements.',action:'Open Weather and inspect the current conditions.',render:()=>weatherScreen(false),duration:4000},
      {name:'Inspect the useful details',detail:'Look ahead to the morning forecast.',evidence:'The task now guides execution: inspect the hourly forecast to find information useful before heading out.',action:'Scroll to the hourly forecast and check for rain.',render:()=>weatherScreen(true),duration:4400,tap:1800},
      {name:'Return a useful summary',detail:'The routine ends with an actionable result.',evidence:'The suggestion was grounded in context, accepted by the user, and followed through to a concise weather summary.',action:'Report the morning forecast and finish the task.',render:weatherDone,duration:6500}
    ]}
  };
  let scenario='personal',index=0,elapsed=0,playing=!reduce.matches,visible=false,last=0,typedCount=-1,tapped=false;
  const screen=document.getElementById('iphone');
  const play=document.getElementById('sim-play');
  const steps=document.getElementById('simulation-steps');
  const touch=document.getElementById('touch-indicator');
  function syncPlay(){play.textContent=playing?'Pause':index===5&&elapsed>=scenarios[scenario].steps[index].duration?'Replay':'Play';play.setAttribute('aria-label',playing?'Pause phone simulation':'Play phone simulation');root.classList.toggle('sim-paused',!playing);}
  function render(announce=false){
    const scene=scenarios[scenario],step=scene.steps[index];
    elapsed=0;typedCount=-1;tapped=false;touch.classList.remove('is-tapping');
    content.innerHTML=step.render();
    screen.classList.toggle('manual-frame',!playing);
    if(playing)content.querySelectorAll('[data-select]').forEach(e=>{e.classList.remove('chosen');const options=[...e.parentElement.children];options.find(x=>x!==e).classList.add('chosen');});
    screen.classList.toggle('light-status',scenario==='proactive'&&index<5);
    document.getElementById('ios-clock').textContent=scenario==='proactive'&&index===0?'8:04':scene.clock;
    document.getElementById('device-scene-label').textContent=scene.label;
    document.getElementById('scenario-intro').textContent=scene.intro;
    document.getElementById('experience-badge').textContent=scene.badge;
    document.getElementById('experience-text').textContent=step.evidence;
    document.getElementById('device-action-text').textContent=step.action;
    document.getElementById('sim-counter').textContent=`0${index+1} / 06`;
    document.getElementById('sim-prev').disabled=index===0;
    document.getElementById('sim-next').disabled=index===5;
    steps.innerHTML=scene.steps.map((s,i)=>`<li class="${i===index?'current':i<index?'complete':''}"><button type="button" data-sim-step="${i}" ${i===index?'aria-current="step"':''}><span class="step-dot">${i<index?'✓':i+1}</span><span><strong>${s.name}</strong><small>${s.detail}</small></span></button></li>`).join('');
    if(announce)document.getElementById('sim-status').textContent=`Step ${index+1}: ${step.name}. ${step.action}`;
    if(!playing)revealAll();
    syncPlay();
  }
  function revealAll(){content.querySelectorAll('[data-select]').forEach(e=>{[...e.parentElement.children].forEach(x=>x.classList.remove('chosen'));e.classList.add('chosen');});content.querySelectorAll('[data-reveal]').forEach(e=>e.classList.add('revealed'));const t=content.querySelector('[data-type]');if(t)t.textContent=t.dataset.type;}
  function move(next,manual=false){index=Math.max(0,Math.min(5,next));if(manual)playing=false;render(manual);}
  document.querySelectorAll('[data-scenario]').forEach(b=>b.addEventListener('click',()=>{scenario=b.dataset.scenario;index=0;playing=!reduce.matches;document.querySelectorAll('[data-scenario]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));render(true);}));
  steps.addEventListener('click',e=>{const b=e.target.closest('[data-sim-step]');if(b){move(Number(b.dataset.simStep),true);steps.querySelector(`[data-sim-step="${index}"]`).focus({preventScroll:true});}});
  content.addEventListener('click',e=>{if(e.target.closest('[data-advance]'))move(index+1,true);});
  document.getElementById('sim-prev').addEventListener('click',()=>move(index-1,true));
  document.getElementById('sim-next').addEventListener('click',()=>move(index+1,true));
  document.getElementById('sim-replay').addEventListener('click',()=>{index=0;playing=!reduce.matches;render(true);});
  play.addEventListener('click',()=>{if(index===5&&elapsed>=scenarios[scenario].steps[index].duration){index=0;playing=true;render(true);}else{playing=!playing;if(playing&&screen.classList.contains('manual-frame'))render();else syncPlay();}});
  new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;},{threshold:.15}).observe(screen);
  reduce.addEventListener('change',e=>{if(e.matches){playing=false;revealAll();syncPlay();}});
  function drawTouch(target){
    if(reduce.matches)return;
    const box=target.getBoundingClientRect(),glass=screen.querySelector('.iphone-glass').getBoundingClientRect();
    touch.style.left=`${box.left-glass.left+box.width/2}px`;touch.style.top=`${box.top-glass.top+box.height/2}px`;
    touch.classList.remove('is-tapping');void touch.offsetWidth;touch.classList.add('is-tapping');
  }
  function animate(now){
    const delta=last?Math.min(now-last,100):0;last=now;
    const step=scenarios[scenario].steps[index];
    if(playing&&visible&&!document.hidden){
      elapsed+=delta;
      const typing=content.querySelector('[data-type]');
      if(typing){const n=Math.min(typing.dataset.type.length,Math.floor(elapsed/55));if(n!==typedCount){typing.textContent=typing.dataset.type.slice(0,n);typedCount=n;}}
      if(typing&&elapsed>=3300){typing.textContent='';typing.classList.add('message-sent');}
      content.querySelectorAll('[data-reveal]').forEach(e=>{if(elapsed>=Number(e.dataset.reveal))e.classList.add('revealed');});
      content.querySelectorAll('[data-select]').forEach(e=>{if(!e.dataset.applied&&elapsed>=Number(e.dataset.select)){e.dataset.applied='true';[...e.parentElement.children].forEach(x=>x.classList.remove('chosen'));e.classList.add('chosen');drawTouch(e);}});
      if(step.tap&&!tapped&&elapsed>=step.tap){
        const target=content.querySelector('[data-tap]');
        if(target)drawTouch(target);
        tapped=true;
      }
      if(elapsed>=step.duration){if(index<5){index++;render();}else{playing=false;syncPlay();}}
    }
    document.getElementById('sim-progress-fill').style.width=`${(index+Math.min(elapsed/step.duration,1))/6*100}%`;
    requestAnimationFrame(animate);
  }
  render();requestAnimationFrame(animate);
})();
