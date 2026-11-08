'use strict';
(function () {
  const welcome = document.getElementById('welcome');
  if (welcome && typeof welcome.showModal === 'function') {
    const dismiss = function () { welcome.close(); document.querySelector('.hero .button').focus({preventScroll: true}); };
    document.getElementById('welcome-continue').addEventListener('click', dismiss);
    document.getElementById('welcome-skip').addEventListener('click', dismiss);
    welcome.showModal();
  }
  const countries = {
    US: { name: 'United States', text: 'Keep the platform’s legal name, your state of residence, payment records, and any written promises. Federal and state reporting or legal routes may differ. Your bank can explain payment dispute procedures; a lawyer licensed in the relevant state can advise on legal rights and deadlines.' },
    UK: { name: 'United Kingdom', text: 'Keep account statements, the platform’s identity, complaint correspondence, and dates of payments. Provider complaint procedures and access to dispute schemes depend on the firm and circumstances. Ask your payment provider about available routes and consult a suitably authorised local lawyer for legal advice.' },
    CA: { name: 'Canada', text: 'Record your province or territory, the platform’s identity, payment history, and communications. Securities oversight, civil procedures, and reporting routes can vary by province or territory. A lawyer licensed in the relevant jurisdiction can advise on your position.' },
    AU: { name: 'Australia', text: 'Prepare a chronology, platform details, payment confirmations, and any complaint responses. Access to external dispute resolution depends on the provider, membership, and issue. Ask your financial institution about its processes and seek a suitably licensed Australian lawyer for legal advice.' },
    SG: { name: 'Singapore', text: 'Keep the platform’s legal name, transaction records, account terms, and communications. Local regulatory status and eligibility for dispute resolution matter. Your bank can explain its payment procedures; consult a Singapore-qualified lawyer about legal options and time limits.' },
    AE: { name: 'United Arab Emirates', text: 'Keep records of the platform entity, relevant emirate or financial zone, transfers, and correspondence. The applicable legal framework and authority may depend on where the entity operates, including financial free zones. Seek a lawyer licensed for the relevant UAE jurisdiction.' }
  };
  const menu = document.querySelector('.menu-toggle');
  const nav = document.getElementById('navigation');
  function closeMenu() { nav.classList.remove('open'); menu.setAttribute('aria-expanded', 'false'); }
  menu.addEventListener('click', function () { const open = menu.getAttribute('aria-expanded') !== 'true'; menu.setAttribute('aria-expanded', String(open)); nav.classList.toggle('open', open); });
  nav.addEventListener('click', function (event) { if (event.target.closest('a')) closeMenu(); });
  document.addEventListener('keydown', function (event) { if (event.key === 'Escape' && nav.classList.contains('open')) { closeMenu(); menu.focus(); } });
  const countrySelector = document.getElementById('country-selector');
  function showCountry() { const country = countries[countrySelector.value]; const panel = document.getElementById('country-info'); panel.replaceChildren(); const heading = document.createElement('h3'); heading.textContent = country.name; const text = document.createElement('p'); text.textContent = country.text; panel.append(heading, text); }
  countrySelector.addEventListener('change', showCountry); showCountry();
  const helper = document.getElementById('helper-content');
  const controls = document.getElementById('helper-controls');
  const back = document.getElementById('helper-back');
  const skip = document.getElementById('helper-skip');
  const next = document.getElementById('helper-next');
  const state = { step: 0, country: '', issue: '', evidence: [] };
  const issues = ['Broker / withdrawal concern', 'Suspected investment scam', 'Crypto-related concern', 'Unauthorised transaction', 'Other / unsure'];
  const evidence = ['Payment or transaction records', 'Emails, messages, or call notes', 'Account statements or screenshots', 'Contracts or promotional material', 'Existing complaints or reports'];
  function options(values, selected) { return values.map(function (value) { return '<option' + (value === selected ? ' selected' : '') + '>' + value + '</option>'; }).join(''); }
  function remember() { if (state.step === 0) state.country = document.getElementById('helper-country').value; if (state.step === 1) state.issue = document.getElementById('helper-issue').value; if (state.step === 2) state.evidence = Array.from(helper.querySelectorAll('input:checked')).map(function (el) { return Number(el.value); }); }
  function render(focus) {
    controls.hidden = false;
    back.disabled = state.step === 0;
    back.hidden = state.step === 0;
    skip.hidden = state.step === 3;
    next.textContent = state.step === 3 ? 'Start again' : state.step === 2 ? 'See my checklist →' : 'Next →';
    let content = '<div class="helper-progress" aria-hidden="true">' + [0, 1, 2].map(function (n) { return '<span class="' + (n <= state.step ? 'active' : '') + '"></span>'; }).join('') + '</div>';
    if (state.step < 3) content += '<p class="eyebrow">STEP ' + (state.step + 1) + ' OF 3 · OPTIONAL</p>';
    if (state.step === 0) content += '<h3 tabindex="-1">Where are you based?</h3><label for="helper-country">Country</label><select id="helper-country"><option value="">Prefer not to say</option>' + options(Object.values(countries).map(function (c) { return c.name; }), state.country) + '</select><p class="fine">This helps tailor the preparation note, not determine legal eligibility.</p>';
    if (state.step === 1) content += '<h3 tabindex="-1">What is your main concern?</h3><label for="helper-issue">Type of issue</label><select id="helper-issue"><option value="">Not selected</option>' + options(issues, state.issue) + '</select>';
    if (state.step === 2) content += '<h3 tabindex="-1">What records do you have?</h3><fieldset><legend>Select any that apply, or skip this step.</legend>' + evidence.map(function (label, index) { return '<label class="check"><input type="checkbox" value="' + index + '"' + (state.evidence.includes(index) ? ' checked' : '') + '>' + label + '</label>'; }).join('') + '</fieldset>';
    if (state.step === 3) {
      const list = ['Write a dated timeline of events, including contact and payment dates.', 'Record the platform’s name, website, account reference, and any claimed legal entity.', 'Keep original records unchanged; use redacted copies for any future sharing.'];
      evidence.forEach(function (label, index) { list.push((state.evidence.includes(index) ? 'Organise your existing ' : 'If available, gather ') + label.toLowerCase() + '.'); });
      if (state.issue === 'Crypto-related concern') list.push('Record public transaction hashes, network names, and public wallet addresses. Never include seed phrases or private keys.');
      if (state.issue === 'Unauthorised transaction') list.push('Keep the bank’s transaction references and a record of when you notified your payment provider. Ask it directly about deadlines.');
      if (state.issue === 'Broker / withdrawal concern') list.push('Keep withdrawal requests, responses, and any demands for additional payments.');
      content += '<h3 tabindex="-1">Your preparation checklist</h3><p class="fine">A practical starting point — not a recovery score or legal assessment.</p><ul>' + list.map(function (item) { return '<li>' + item + '</li>'; }).join('') + '</ul>';
      const country = Object.values(countries).find(function (c) { return c.name === state.country; });
      if (country) content += '<p class="fine">' + country.name + ': ' + country.text + '</p>';
      content += '<p class="fine">Local representation requires a separate agreement with a suitably licensed lawyer. Keep records privately; this site accepts no uploads.</p><a class="text-link" href="#contact">View the demo contact form ↗</a>';
    }
    helper.innerHTML = content;
    if (focus) helper.querySelector('h3').focus();
  }
  next.addEventListener('click', function () { if (state.step === 3) { state.step = 0; state.country = ''; state.issue = ''; state.evidence = []; } else { remember(); state.step++; } render(true); });
  back.addEventListener('click', function () { if (state.step < 3) remember(); state.step = Math.max(0, state.step - 1); render(true); });
  skip.addEventListener('click', function () { if (state.step === 0) state.country = ''; if (state.step === 1) state.issue = ''; if (state.step === 2) state.evidence = []; state.step++; render(true); });
  render(false);
  const form = document.getElementById('contact-form');
  document.getElementById('contact-fields').disabled = false;
  form.addEventListener('submit', function (event) { event.preventDefault(); const result = document.getElementById('form-result'); result.textContent = 'Your request could not be sent. Please try again later'; result.focus(); });
  // Native validation still runs; no network calls, storage, or form serialization occur.
  document.querySelectorAll('a[href^="#"]').forEach(function (link) { link.addEventListener('click', function () { const id = link.getAttribute('href').slice(1); if (!id) return; const target = document.getElementById(id); if (target && target.tagName === 'DETAILS') target.open = true; }); });
  document.getElementById('year').textContent = new Date().getFullYear();
})();
