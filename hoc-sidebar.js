// Shared sidebar renderer
function renderSidebar(activePage) {
  const pages = [
    { section: 'Operations', items: [
      { href: 'app.html', icon: 'nd', label: 'Dashboard' },
      { href: 'app.html#appointments', icon: 'nsq', label: 'Appointments' },
      { href: 'app.html#patients', icon: 'nsq round', label: 'Patients' },
    ]},
    { section: 'Clinical', items: [
      { href: 'charting.html', icon: 'nsq', label: 'Charting & SOAP' },
      { href: 'app.html#photos', icon: 'nsq', label: 'Before & After' },
    ]},
    { section: 'Revenue', items: [
      { href: 'memberships.html', icon: 'nsq', label: 'Memberships' },
      { href: 'app.html#payments', icon: 'nsq rect', label: 'Payments' },
    ]},
    { section: 'Business', items: [
      { href: 'analytics.html', icon: 'nsq', label: 'Analytics' },
      { href: 'inventory.html', icon: 'nsq', label: 'Inventory' },
      { href: 'app.html#messages', icon: 'nsq round', label: 'Messages', badge: '5' },
    ]},
    { section: 'Patient Tools', items: [
      { href: 'booking.html', icon: 'nsq', label: 'Online Booking ↗', target: '_blank' },
      { href: 'app.html#kiosk', icon: 'nsq', label: 'Patient Check-In' },
    ]},
  ];

  let html = `<div class="sidebar">
    <div class="sb-brand">
      <div class="sb-logo">Haus of Confidence</div>
      <div class="sb-tag">medspa platform</div>
    </div>
    <div style="flex:1;overflow-y:auto;padding-top:.3rem;">`;

  for (const section of pages) {
    html += `<div class="ns">${section.section}</div>`;
    for (const item of section.items) {
      const isActive = activePage === item.href || (activePage === item.href?.split('#')[0]);
      const iconClass = item.icon === 'nd' ? 'nd' : item.icon.includes('round') ? 'nsq' : item.icon.includes('rect') ? 'nsq' : 'nsq';
      const iconStyle = item.icon.includes('round') ? 'border-radius:50%;' : item.icon.includes('rect') ? 'border-radius:2px;' : '';
      html += `<a class="ni${isActive?' active':''}" href="${item.href}"${item.target?` target="${item.target}"`:''}>
        <div class="${iconClass}" style="${iconStyle}"></div>${item.label}
        ${item.badge ? `<span class="nbadge">${item.badge}</span>` : ''}
      </a>`;
    }
  }

  html += `</div>
    <div class="sb-rep">✦ Replaces: Clover + 3 other systems</div>
    <div class="sb-user"><div class="sb-uname">Dr. Sara Ameli</div><div class="sb-ucred">DNP, FNP-C</div></div>
  </div>`;
  return html;
}
