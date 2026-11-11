const $ = (s, r = document) => r.querySelector(s);
const view = $('#view');
const DAY = 864e5;
const fmt = (s) => s ? d(s).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A';
const days = (s) => Math.round((d(s) - TODAY) / DAY);
const status = (s) => {
  if (!s) return { k: 'ok', t: 'No expiry', n: 9999 };
  const n = days(s);
  if (n < 0) return { k: 'bad pulse', t: `Expired ${-n}d ago`, n };
  if (n <= 90) return { k: 'warn', t: `Expires in ${n}d`, n };
  return { k: 'ok', t: 'Valid', n };
};
const badge = (s) => `<span class="badge b-${s.k}">${s.t}</span>`.replace('b-ok', 'b-ok').replace(/b-bad pulse/, 'b-bad pulse').replace('b-warn', 'b-warn');
const DOCS = { dbs: 'DBS Certificate', licence: 'Driving Licence', passport: 'Passport', rtw: 'Right to Work', nmc: 'NMC Registration' };
const docExpiry = (s, k) => ({ dbs: s.docs.dbs?.expires, licence: s.docs.licence?.expires, passport: s.docs.passport?.expires, rtw: s.docs.rtw?.expires, nmc: s.docs.nmc?.expires }[k]);

function issues(s) {
  const out = [];
  for (const k of ['dbs', 'licence', 'passport', 'rtw', 'nmc']) {
    if (!s.docs[k]) continue;
    const st = status(docExpiry(s, k));
    if (st.k !== 'ok') out.push({ s, label: DOCS[k], st, date: docExpiry(s, k) });
  }
  s.training.forEach(([n, , e]) => { const st = status(e); if (st.k !== 'ok') out.push({ s, label: n, st, date: e }); });
  return out.sort((a, b) => a.st.n - b.st.n);
}
function score(s) {
  const items = [];
  ['dbs', 'passport', 'rtw'].forEach(k => items.push(s.docs[k] ? status(docExpiry(s, k)).k === 'ok' : false));
  s.training.forEach(t => items.push(status(t[2]).k === 'ok'));
  return Math.round(items.filter(Boolean).length / items.length * 100);
}
const chipsFor = (s) => { const n = issues(s); const bad = n.filter(i => i.st.k.startsWith('bad')).length, w = n.length - bad;
  return (bad ? `<span class="badge b-bad" style="margin:0">${bad} expired</span>` : '') + (w ? `<span class="badge b-warn" style="margin:0">${w} due soon</span>` : '') + (!n.length ? '<span class="badge b-ok" style="margin:0">Fully compliant</span>' : ''); };

function countUp(root) {
  root.querySelectorAll('[data-count]').forEach(el => {
    const to = +el.dataset.count, t0 = performance.now();
    const step = (t) => { const p = Math.min((t - t0) / 1000, 1); el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3))) + (el.dataset.suf || ''); if (p < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  });
  root.querySelectorAll('.bar i').forEach(b => setTimeout(() => b.style.width = b.dataset.w + '%', 100));
  root.querySelectorAll('.reveal').forEach((el, i) => el.style.animationDelay = i * 70 + 'ms');
}

function dashboard() {
  const all = STAFF.flatMap(issues);
  const expired = all.filter(i => i.st.k.startsWith('bad')).length, soon = all.length - expired;
  const avg = Math.round(STAFF.reduce((a, s) => a + score(s), 0) / STAFF.length);
  const totalItems = STAFF.reduce((a, s) => a + 5 + s.training.length, 0);
  return `<div class="view"><h1>Good morning, Admin</h1><p class="sub">Wednesday 11 November 2026 · Staff compliance overview</p>
  <div class="grid stats">
    ${[['👥', STAFF.length, 'Active staff', ''], ['🛡️', avg, 'Compliance score', '%'], ['⚠️', soon, 'Expiring in 90 days', ''], ['🚨', expired, 'Expired items', '']].map(([i, n, l, suf]) => `<div class="card stat hover reveal"><div class="ico">${i}</div><div class="n" data-count="${n}" data-suf="${suf}">0</div><div class="l">${l}</div></div>`).join('')}
  </div>
  <div class="grid two">
    <div class="card reveal"><h3>Items needing attention</h3>
      ${all.slice(0, 7).map(i => `<a class="alert" href="#/staff/${i.s.id}"><img src="${i.s.photo}" alt=""><div><b>${i.s.name}</b><small>${i.label} · ${fmt(i.date)}</small></div>${badge(i.st)}</a>`).join('')}
    </div>
    <div class="card reveal"><h3>Overall compliance</h3>
      <div class="donut"><div style="position:relative"><svg viewBox="0 0 120 120"><circle class="bg" cx="60" cy="60" r="50"/><circle class="fg" cx="60" cy="60" r="50" id="ring"/></svg><div class="dtxt"><span data-count="${avg}" data-suf="%">0</span></div></div>
      <div class="legend"><div><span class="dot" style="background:var(--ok)"></span>${totalItems - all.length} valid items</div><div><span class="dot" style="background:var(--amb)"></span>${soon} due soon</div><div><span class="dot" style="background:var(--red)"></span>${expired} expired</div></div></div>
      <h3 style="margin-top:26px">Team by department</h3>
      ${[...new Set(STAFF.map(s => s.dept))].map(dp => `<div style="display:flex;justify-content:space-between;align-items:center;gap:14px;margin:8px 0;font-size:14px"><span style="width:110px">${dp}</span><div class="bar" style="flex:1"><i data-w="${STAFF.filter(s => s.dept === dp).length / STAFF.length * 100}"></i></div><b>${STAFF.filter(s => s.dept === dp).length}</b></div>`).join('')}
    </div>
  </div></div>`;
}

function staffCard(s) {
  return `<a class="card person hover reveal" href="#/staff/${s.id}"><img src="${s.photo}" alt="${s.name}"><h4>${s.name}</h4><p>${s.role}</p><div class="chips">${chipsFor(s)}</div></a>`;
}
function staffList(q = '') {
  const list = STAFF.filter(s => (s.name + s.role + s.dept).toLowerCase().includes(q.toLowerCase()));
  return `<div class="view"><h1>Staff</h1><p class="sub">${list.length} team member${list.length === 1 ? '' : 's'}</p><div class="grid staffgrid">${list.map(staffCard).join('') || '<div class="empty">No staff found.</div>'}</div></div>`;
}

function idCard(k, s) {
  const x = s.docs[k];
  if (!x) return `<div class="missing">${k === 'nmc' ? 'Not applicable for this role' : 'No document on file'}</div>`;
  const photo = `<img src="${s.photo}" alt="">`;
  const f = (rows) => `<div class="f">${rows.map(([a, b]) => `<div><i>${a}</i>${b}</div>`).join('')}</div>`;
  const nm = s.name.toUpperCase().split(' ');
  if (k === 'licence') return `<div class="id-card licence"><div class="t"><span>DRIVING LICENCE</span><span>UK</span></div><div class="id-body">${photo}${f([['1.', nm[1]], ['2.', nm[0]], ['3.', fmt(s.dob)], ['4b.', fmt(x.expires)], ['5.', x.number], ['9.', x.cats]])}</div></div>`;
  if (k === 'passport') return `<div class="id-card passport"><div class="t"><span>PASSPORT</span><span>${x.nationality.toUpperCase()}</span></div><div class="id-body">${photo}${f([['Surname', nm[1]], ['Given', nm[0]], ['Passport No', x.number], ['DOB', fmt(s.dob)], ['Expiry', fmt(x.expires)]])}</div></div>`;
  if (k === 'dbs') return `<div class="id-card dbs"><div class="t"><span>DBS CERTIFICATE</span><span>${x.update ? 'UPDATE SERVICE' : 'STANDARD'}</span></div><div class="id-body">${photo}${f([['Cert No', x.number], ['Level', x.level.replace('Enhanced with Barred Lists', 'Enhanced + Barred')], ['Issued', fmt(x.issued)], ['Result', 'No information']])}</div></div>`;
  if (k === 'rtw') return `<div class="id-card rtw"><div class="t"><span>RIGHT TO WORK</span><span>VERIFIED</span></div><div class="id-body">${photo}${f([['Status', x.type], ['Checked', fmt(x.checked)], ['Valid to', x.expires ? fmt(x.expires) : 'Indefinite'], ...(x.share ? [['Share code', x.share]] : [])])}</div></div>`;
  return `<div class="id-card nmc"><div class="t"><span>NMC REGISTRATION</span><span>NURSE</span></div><div class="id-body">${photo}${f([['PIN', x.pin], ['Expires', fmt(x.expires)], ['Revalidation', fmt(x.revalidation)]])}</div></div>`;
}

function profile(id, tab = 'docs') {
  const s = STAFF.find(x => x.id == id); if (!s) return staffList();
  const tabs = { docs: 'Documents', train: 'Training', emp: 'Employment', contact: 'Contact' };
  const sc = score(s);
  let body = '';
  if (tab === 'docs') body = `<div class="grid docs">${['dbs', 'licence', 'passport', 'rtw', 'nmc'].map(k => { const e = docExpiry(s, k), has = !!s.docs[k];
    return `<div class="card reveal"><div class="doc-head"><h3>${DOCS[k]}</h3>${has ? badge(status(e)) : '<span class="badge b-na">' + (k === 'nmc' ? 'N/A' : 'Missing') + '</span>'}</div>${idCard(k, s)}${has ? `<div class="exp"><span>Issued ${fmt(s.docs[k].issued || s.docs[k].checked)}</span><span>Expires ${e ? fmt(e) : 'never'}</span></div>` : ''}</div>`; }).join('')}</div>`;
  if (tab === 'train') body = `<div class="card reveal scroll"><table><thead><tr><th>Course</th><th>Completed</th><th>Expires</th><th>Status</th></tr></thead><tbody>${s.training.map(([n, c, e]) => `<tr><td><b>${n}</b></td><td>${fmt(c)}</td><td>${fmt(e)}</td><td>${badge(status(e))}</td></tr>`).join('')}</tbody></table></div>`;
  if (tab === 'emp') body = `<div class="card reveal"><div class="kv">${[['Job title', s.role], ['Department', s.dept], ['Start date', fmt(s.start)], ['Contract', s.contract], ['Weekly hours', s.hours], ['NI number', s.ni], ['References', s.refs + ' received'], ['Last supervision', fmt(s.supervision)]].map(([a, b]) => `<div><span>${a}</span><b>${b}</b></div>`).join('')}</div></div>`;
  if (tab === 'contact') body = `<div class="card reveal"><div class="kv">${[['Email', s.email], ['Phone', s.phone], ['Address', s.address], ['Date of birth', fmt(s.dob)], ['Emergency contact', s.nok.name + ' (' + s.nok.rel + ')'], ['Emergency phone', s.nok.phone]].map(([a, b]) => `<div><span>${a}</span><b>${b}</b></div>`).join('')}</div></div>`;
  return `<div class="view"><a class="back" href="#/staff">← All staff</a>
  <div class="hero"><img src="${s.photo}" alt=""><div style="flex:1"><h1>${s.name}</h1><p>${s.role} · ${s.dept} · Since ${fmt(s.start)}</p><div style="margin-top:14px;max-width:320px"><small>Compliance ${sc}%</small><div class="bar" style="background:rgba(255,255,255,.2)"><i data-w="${sc}"></i></div></div></div><div class="chips">${chipsFor(s)}</div></div>
  <div class="tabs">${Object.entries(tabs).map(([k, v]) => `<button class="${k === tab ? 'on' : ''}" data-tab="${k}">${v}</button>`).join('')}</div>${body}</div>`;
}

function compliance() {
  const cols = [['dbs', 'DBS'], ['licence', 'Licence'], ['passport', 'Passport'], ['rtw', 'Right to Work']];
  return `<div class="view"><h1>Compliance matrix</h1><p class="sub">Document status across all staff</p><div class="card scroll reveal"><table><thead><tr><th>Staff</th>${cols.map(c => `<th>${c[1]}</th>`).join('')}<th>Score</th></tr></thead><tbody>${STAFF.map(s => `<tr><td><a class="alert" style="margin:0;padding:0" href="#/staff/${s.id}"><img src="${s.photo}" alt=""><b>${s.name}</b></a></td>${cols.map(([k]) => `<td>${s.docs[k] ? badge(status(docExpiry(s, k))).replace('margin-left:auto', '') : '<span class="badge b-na" style="margin:0">Missing</span>'}</td>`).join('')}<td><div class="bar"><i data-w="${score(s)}"></i></div></td></tr>`).join('')}</tbody></table></div></div>`;
}

let tab = 'docs';
function route() {
  const [, p, id] = (location.hash || '#/').split('/');
  document.querySelectorAll('[data-nav]').forEach(a => a.classList.toggle('active', a.dataset.nav === (p || 'dashboard')));
  if (p === 'staff' && id) view.innerHTML = profile(id, tab);
  else if (p === 'staff') view.innerHTML = staffList();
  else if (p === 'compliance') view.innerHTML = compliance();
  else view.innerHTML = dashboard();
  countUp(view);
  const ring = $('#ring');
  if (ring) setTimeout(() => ring.style.strokeDasharray = `${Math.round(STAFF.reduce((a, s) => a + score(s), 0) / STAFF.length) * 3.14} 999`, 150);
  if (p !== 'staff' || !id) window.scrollTo(0, 0);
}
view.addEventListener('click', e => {
  const b = e.target.closest('[data-tab]'); if (!b) return;
  tab = b.dataset.tab; route();
});
window.addEventListener('hashchange', () => { tab = 'docs'; route(); });
$('#search').addEventListener('input', e => {
  if (!e.target.value) return route();
  location.hash.startsWith('#/staff/') || (location.hash = '#/staff');
  view.innerHTML = staffList(e.target.value); countUp(view);
});
route();
