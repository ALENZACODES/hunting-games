// The arsenal. 25 real firearms with game-tuned figures.
//
// vel      muzzle velocity, m/s
// dragL    drag length in metres (bigger = flatter, keeps speed longer)
// power    1 (.22 LR) … 10 (.50 BMG); compared with each target's minPower
// recoil   0..1, sight kick per shot
// sway     0..1, sight drift while aiming
// cycle    seconds between shots (pump / bolt / lever / trigger reset)
// reload   seconds per shell (reloadMode 'single') or per magazine ('mag')
// optic    { type: bead | iron | reddot | scope, zoom: [min, max], reticle }
// zero     metres the sight is zeroed at
// pellets / spread (radians) / range (m) for shotguns
// model    stand-in drawing used until weapons/<id>.png exists

export const CLASSES = {
  shotgun: 'Shotgun',
  rimfire: 'Rimfire',
  handgun: 'Handgun',
  lever: 'Lever action',
  rifle: 'Hunting rifle',
  military: 'Military rifle',
};

export const WEAPONS = [
  // ── Shotguns ───────────────────────────────────────────────
  { id: 'rem870', name: 'Remington 870 Wingmaster', generic: 'Pump Shotgun 12 ga', cls: 'shotgun', model: 'shotgun', caliber: '12 gauge', action: 'Pump', mag: 4, reload: 0.5, reloadMode: 'single', cycle: 0.55, vel: 400, dragL: 90, power: 2, pellets: 9, spread: 0.011, range: 50, recoil: 0.55, sway: 0.25, optic: { type: 'bead', zoom: [1.15, 1.15] }, zero: 30, unlock: 1, sound: 'shotgun' },
  { id: 'moss500', name: 'Mossberg 500 Field', generic: 'Field Pump 12 ga', cls: 'shotgun', model: 'shotgun', caliber: '12 gauge', action: 'Pump', mag: 5, reload: 0.5, reloadMode: 'single', cycle: 0.5, vel: 400, dragL: 90, power: 2, pellets: 9, spread: 0.013, range: 45, recoil: 0.55, sway: 0.25, optic: { type: 'bead', zoom: [1.15, 1.15] }, zero: 30, unlock: 1, sound: 'shotgun' },
  { id: 'citori725', name: 'Browning Citori 725', generic: 'Over/Under 12 ga', cls: 'shotgun', model: 'overunder', caliber: '12 gauge', action: 'Over/under', mag: 2, reload: 1.3, reloadMode: 'mag', cycle: 0.22, vel: 410, dragL: 95, power: 2, pellets: 10, spread: 0.009, range: 55, recoil: 0.5, sway: 0.22, optic: { type: 'bead', zoom: [1.15, 1.15] }, zero: 30, unlock: 4, sound: 'shotgun' },
  { id: 'a400', name: 'Beretta A400 Xtreme Plus', generic: 'Semi-Auto Shotgun 12 ga', cls: 'shotgun', model: 'semishotgun', caliber: '12 gauge', action: 'Semi-auto', mag: 4, reload: 0.45, reloadMode: 'single', cycle: 0.25, vel: 400, dragL: 90, power: 2, pellets: 9, spread: 0.011, range: 50, recoil: 0.4, sway: 0.25, optic: { type: 'bead', zoom: [1.15, 1.15] }, zero: 30, unlock: 8, sound: 'shotgun' },
  { id: 'sbe3', name: 'Benelli Super Black Eagle 3', generic: 'Magnum Semi-Auto 12 ga', cls: 'shotgun', model: 'semishotgun', caliber: '12 gauge 3½″', action: 'Semi-auto', mag: 3, reload: 0.45, reloadMode: 'single', cycle: 0.25, vel: 430, dragL: 100, power: 3, pellets: 11, spread: 0.01, range: 60, recoil: 0.6, sway: 0.25, optic: { type: 'bead', zoom: [1.15, 1.15] }, zero: 30, unlock: 15, sound: 'shotgun' },

  // ── Rimfire ────────────────────────────────────────────────
  { id: 'ruger1022', name: 'Ruger 10/22', generic: 'Semi-Auto .22', cls: 'rimfire', model: 'rimfire', caliber: '.22 LR', action: 'Semi-auto', mag: 10, reload: 1.6, reloadMode: 'mag', cycle: 0.18, vel: 370, dragL: 420, power: 1, recoil: 0.08, sway: 0.2, optic: { type: 'scope', zoom: [3, 9], reticle: 'duplex' }, zero: 50, unlock: 11, sound: 'rimfire' },
  { id: 'cz457', name: 'CZ 457 American', generic: 'Bolt .22', cls: 'rimfire', model: 'rimfire', caliber: '.22 LR', action: 'Bolt', mag: 5, reload: 1.5, reloadMode: 'mag', cycle: 0.7, vel: 330, dragL: 420, power: 1, recoil: 0.05, sway: 0.15, optic: { type: 'scope', zoom: [4, 12], reticle: 'mildot' }, zero: 50, unlock: 11, sound: 'rimfire' },

  // ── Handgun ────────────────────────────────────────────────
  { id: 'sw29', name: 'Smith & Wesson Model 29', generic: 'Magnum Revolver .44', cls: 'handgun', model: 'revolver', caliber: '.44 Magnum', action: 'Revolver', mag: 6, reload: 2.2, reloadMode: 'mag', cycle: 0.35, vel: 440, dragL: 600, power: 4, recoil: 0.7, sway: 0.45, optic: { type: 'iron', zoom: [1.2, 1.2] }, zero: 50, unlock: 21, sound: 'magnum' },

  // ── Lever actions ──────────────────────────────────────────
  { id: 'win94', name: 'Winchester Model 1894', generic: 'Lever Rifle .30-30', cls: 'lever', model: 'lever', caliber: '.30-30 Win', action: 'Lever', mag: 6, reload: 0.5, reloadMode: 'single', cycle: 0.55, vel: 720, dragL: 1500, power: 4, recoil: 0.45, sway: 0.3, optic: { type: 'iron', zoom: [1.25, 1.25] }, zero: 100, unlock: 21, sound: 'rifle' },
  { id: 'marlin1895', name: 'Marlin 1895', generic: 'Lever Rifle .45-70', cls: 'lever', model: 'lever', caliber: '.45-70 Govt', action: 'Lever', mag: 4, reload: 0.55, reloadMode: 'single', cycle: 0.6, vel: 580, dragL: 1100, power: 7, recoil: 0.8, sway: 0.32, optic: { type: 'scope', zoom: [2, 7], reticle: 'duplex' }, zero: 100, unlock: 41, sound: 'magnum' },

  // ── Bolt & semi-auto hunting rifles ───────────────────────
  { id: 'rugeramerican', name: 'Ruger American Rifle', generic: 'Bolt Rifle .243', cls: 'rifle', model: 'bolt', caliber: '.243 Win', action: 'Bolt', mag: 4, reload: 2.0, reloadMode: 'mag', cycle: 0.85, vel: 900, dragL: 2300, power: 4, recoil: 0.3, sway: 0.22, optic: { type: 'scope', zoom: [3, 9], reticle: 'duplex' }, zero: 100, unlock: 21, sound: 'rifle' },
  { id: 'tikka', name: 'Tikka T3x Lite', generic: 'Bolt Rifle 6.5 CM', cls: 'rifle', model: 'bolt', caliber: '6.5 Creedmoor', action: 'Bolt', mag: 3, reload: 2.0, reloadMode: 'mag', cycle: 0.8, vel: 830, dragL: 3000, power: 5, recoil: 0.32, sway: 0.2, optic: { type: 'scope', zoom: [4, 12], reticle: 'bdc' }, zero: 100, unlock: 25, sound: 'rifle' },
  { id: 'rem700', name: 'Remington Model 700', generic: 'Bolt Rifle .308', cls: 'rifle', model: 'bolt', caliber: '.308 Win', action: 'Bolt', mag: 4, reload: 2.1, reloadMode: 'mag', cycle: 0.85, vel: 820, dragL: 2500, power: 6, recoil: 0.45, sway: 0.2, optic: { type: 'scope', zoom: [4, 12], reticle: 'duplex' }, zero: 100, unlock: 21, sound: 'rifle' },
  { id: 'win70', name: 'Winchester Model 70', generic: 'Bolt Rifle .30-06', cls: 'rifle', model: 'bolt', caliber: '.30-06 Springfield', action: 'Bolt', mag: 5, reload: 0.5, reloadMode: 'single', cycle: 0.85, vel: 880, dragL: 2600, power: 6, recoil: 0.5, sway: 0.2, optic: { type: 'scope', zoom: [3, 9], reticle: 'duplex' }, zero: 100, unlock: 31, sound: 'rifle' },
  { id: 'sako85', name: 'Sako 85', generic: 'Bolt Rifle .270', cls: 'rifle', model: 'bolt', caliber: '.270 Win', action: 'Bolt', mag: 4, reload: 2.0, reloadMode: 'mag', cycle: 0.8, vel: 930, dragL: 2700, power: 6, recoil: 0.45, sway: 0.18, optic: { type: 'scope', zoom: [4, 16], reticle: 'bdc' }, zero: 100, unlock: 31, sound: 'rifle' },
  { id: 'xbolt', name: 'Browning X-Bolt', generic: 'Magnum Bolt 7mm', cls: 'rifle', model: 'bolt', caliber: '7mm Rem Mag', action: 'Bolt', mag: 3, reload: 2.1, reloadMode: 'mag', cycle: 0.85, vel: 950, dragL: 3200, power: 7, recoil: 0.6, sway: 0.18, optic: { type: 'scope', zoom: [4.5, 14], reticle: 'bdc' }, zero: 100, unlock: 35, sound: 'magnum' },
  { id: 'bar', name: 'Browning BAR Mk3', generic: 'Semi-Auto Rifle .30-06', cls: 'rifle', model: 'semirifle', caliber: '.30-06 Springfield', action: 'Semi-auto', mag: 4, reload: 2.0, reloadMode: 'mag', cycle: 0.3, vel: 880, dragL: 2600, power: 6, recoil: 0.5, sway: 0.25, optic: { type: 'scope', zoom: [3, 9], reticle: 'duplex' }, zero: 100, unlock: 38, sound: 'rifle' },
  { id: 'savage110', name: 'Savage 110', generic: 'Magnum Bolt .300', cls: 'rifle', model: 'bolt', caliber: '.300 Win Mag', action: 'Bolt', mag: 3, reload: 2.2, reloadMode: 'mag', cycle: 0.9, vel: 900, dragL: 3300, power: 7, recoil: 0.65, sway: 0.2, optic: { type: 'scope', zoom: [5, 20], reticle: 'mildot' }, zero: 100, unlock: 41, sound: 'magnum' },
  { id: 'weatherby', name: 'Weatherby Mark V', generic: 'Magnum Bolt .300 Wby', cls: 'rifle', model: 'bolt', caliber: '.300 Wby Mag', action: 'Bolt', mag: 3, reload: 2.2, reloadMode: 'mag', cycle: 0.9, vel: 990, dragL: 3400, power: 8, recoil: 0.75, sway: 0.18, optic: { type: 'scope', zoom: [5, 20], reticle: 'bdc' }, zero: 100, unlock: 45, sound: 'magnum' },
  { id: 'ruger1', name: 'Ruger No. 1', generic: 'Single-Shot .375', cls: 'rifle', model: 'single', caliber: '.375 H&H Mag', action: 'Single shot', mag: 1, reload: 1.1, reloadMode: 'mag', cycle: 0.2, vel: 780, dragL: 2400, power: 9, recoil: 0.9, sway: 0.22, optic: { type: 'scope', zoom: [1.5, 6], reticle: 'duplex' }, zero: 100, unlock: 45, sound: 'magnum' },

  // ── Military ───────────────────────────────────────────────
  { id: 'm4', name: 'Colt M4A1 Carbine', generic: 'Carbine 5.56', cls: 'military', model: 'ar', caliber: '5.56 NATO', action: 'Automatic', mag: 30, reload: 2.2, reloadMode: 'mag', cycle: 0.075, auto: true, vel: 880, dragL: 1900, power: 4, recoil: 0.16, sway: 0.25, optic: { type: 'reddot', zoom: [1.5, 3] }, zero: 100, unlock: 61, sound: 'carbine' },
  { id: 'akm', name: 'AKM', generic: 'Assault Rifle 7.62×39', cls: 'military', model: 'ak', caliber: '7.62×39', action: 'Automatic', mag: 30, reload: 2.6, reloadMode: 'mag', cycle: 0.1, auto: true, vel: 715, dragL: 1500, power: 4, recoil: 0.26, sway: 0.3, optic: { type: 'iron', zoom: [1.25, 1.25] }, zero: 100, unlock: 61, sound: 'carbine' },
  { id: 'scar', name: 'FN SCAR 17S', generic: 'Battle Rifle 7.62', cls: 'military', model: 'ar', caliber: '7.62 NATO', action: 'Semi-auto', mag: 20, reload: 2.4, reloadMode: 'mag', cycle: 0.12, vel: 800, dragL: 2500, power: 6, recoil: 0.35, sway: 0.22, optic: { type: 'scope', zoom: [1, 6], reticle: 'lpvo' }, zero: 100, unlock: 71, sound: 'rifle' },
  { id: 'axmc', name: 'Accuracy International AXMC', generic: 'Sniper Rifle .338', cls: 'military', model: 'sniper', caliber: '.338 Lapua Mag', action: 'Bolt', mag: 10, reload: 2.8, reloadMode: 'mag', cycle: 0.9, vel: 900, dragL: 4200, power: 9, recoil: 0.7, sway: 0.12, optic: { type: 'scope', zoom: [5, 25], reticle: 'mildot' }, zero: 100, unlock: 71, sound: 'magnum' },
  { id: 'm82', name: 'Barrett M82A1', generic: 'Anti-Materiel Rifle .50', cls: 'military', model: 'fifty', caliber: '.50 BMG', action: 'Semi-auto', mag: 10, reload: 3.2, reloadMode: 'mag', cycle: 0.45, vel: 853, dragL: 5200, power: 10, recoil: 1.0, sway: 0.3, optic: { type: 'scope', zoom: [4, 16], reticle: 'mildot' }, zero: 100, unlock: 81, sound: 'fifty' },
];

export const WEAPON_BY_ID = Object.fromEntries(WEAPONS.map((w) => [w.id, w]));

export function weaponName(w, generic) {
  return generic ? w.generic : w.name;
}
