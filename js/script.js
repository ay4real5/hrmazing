/* ============================================================
   HER-mazing Touch — interactions & illustration injection
   ============================================================ */

/* ---------- SVG illustration library ---------- */
const ART = {

  candle: () => `
    <svg viewBox="0 0 200 250" class="art" aria-hidden="true">
      <ellipse class="jar-shadow" cx="100" cy="230" rx="60" ry="9"/>
      <g class="flame">
        <ellipse cx="100" cy="50" rx="28" ry="34" fill="url(#gHalo)"/>
        <path class="flame-outer" d="M100 18 C111 36 117 46 117 55 C117 66 109 74 100 74 C91 74 83 66 83 55 C83 46 89 36 100 18Z" fill="url(#gFlame)"/>
        <path class="flame-inner" d="M100 40 C106 49 109 54 109 59 C109 66 105 70 100 70 C95 70 91 66 91 59 C91 54 94 49 100 40Z" fill="#FFF6DA" opacity=".9"/>
      </g>
      <rect x="98" y="70" width="4" height="14" rx="2" fill="#4A3325"/>
      <rect x="52" y="110" width="96" height="104" rx="9" fill="var(--wax,#F0E2C8)"/>
      <ellipse cx="100" cy="112" rx="48" ry="7" fill="#000" opacity=".08"/>
      <rect x="45" y="86" width="110" height="132" rx="15" fill="url(#gGlass)" stroke="#F2DCA4" stroke-opacity=".5" stroke-width="1.5"/>
      <ellipse cx="100" cy="88" rx="55" ry="9" fill="none" stroke="url(#gGold)" stroke-width="2.5"/>
      <rect x="70" y="142" width="60" height="44" rx="5" fill="#FBF6EA" opacity=".95"/>
      <text x="100" y="165" class="jar-mono" text-anchor="middle">H</text>
      <rect x="82" y="172" width="36" height="1.6" rx="1" fill="#C9A227" opacity=".55"/>
      <rect x="60" y="98" width="9" height="108" rx="5" fill="#fff" opacity=".14"/>
      <rect x="136" y="104" width="5" height="96" rx="3" fill="#fff" opacity=".08"/>
    </svg>`,

  /* wicker basket bursting with roses, daisies, strawberries + mug — the signature piece */
  basket: () => `
    <svg viewBox="0 0 200 250" class="art" aria-hidden="true">
      <ellipse class="jar-shadow" cx="100" cy="232" rx="66" ry="10"/>
      <g class="art-float">
        <path d="M62 112 Q100 62 138 112" fill="none" stroke="#C9A97E" stroke-width="8" stroke-linecap="round"/>
        <path d="M62 112 Q100 62 138 112" fill="none" stroke="#A98B60" stroke-width="3" stroke-linecap="round" opacity=".5"/>
        <g>
          <circle cx="70" cy="120" r="18" fill="#F0C8A8"/><circle cx="70" cy="120" r="11" fill="#E4AE8E"/><circle cx="70" cy="120" r="5" fill="#D69B7E"/>
          <circle cx="130" cy="118" r="17" fill="#F6DCC8"/><circle cx="130" cy="118" r="10" fill="#EDC0A4"/><circle cx="130" cy="118" r="4.5" fill="#DDA184"/>
          <circle cx="100" cy="104" r="15" fill="#F3D2BC"/><circle cx="100" cy="104" r="9" fill="#E9B99C"/><circle cx="100" cy="104" r="4" fill="#D69B7E"/>
        </g>
        <g fill="#FCF8F0">
          <g transform="translate(86,128)"><circle r="7.5"/><circle cx="0" cy="0" r="3" fill="#E8C468"/></g>
          <g transform="translate(116,132)"><circle r="7"/><circle r="2.8" fill="#E8C468"/></g>
          <g transform="translate(56,100)"><circle r="6"/><circle r="2.4" fill="#E8C468"/></g>
          <g transform="translate(146,102)"><circle r="6"/><circle r="2.4" fill="#E8C468"/></g>
        </g>
        <g>
          <path d="M78 136 q10 -6 18 2 q2 12 -9 18 q-11 -6 -9 -20Z" fill="#5C3220"/>
          <path d="M106 140 q10 -6 18 2 q2 12 -9 18 q-11 -6 -9 -20Z" fill="#6B3A22"/>
          <path d="M62 142 q8 -5 15 2 q1 10 -8 15 q-9 -5 -7 -17Z" fill="#7A4327"/>
        </g>
        <path d="M48 122 q-11 -13 3 -20 q11 5 8 20Z" fill="#6E7F55"/>
        <path d="M152 120 q11 -13 -3 -20 q-11 5 -8 20Z" fill="#7C8D62"/>
        <rect x="84" y="150" width="34" height="34" rx="5" fill="#FFFDF8"/>
        <path d="M118 158 q12 0 12 9 t-12 9" fill="none" stroke="#FFFDF8" stroke-width="5"/>
        <ellipse cx="101" cy="152" rx="15" ry="4" fill="#4A2C1D"/>
        <path d="M58 160 L142 160 L134 216 Q133 222 126 222 L74 222 Q67 222 66 216 Z" fill="#C9A97E"/>
        <path d="M58 160 L142 160 L140 176 L60 176 Z" fill="#B08E62"/>
        <g stroke="#8E6E48" stroke-width="2" opacity=".45" fill="none">
          <path d="M66 184 h68"/><path d="M68 196 h64"/><path d="M70 208 h60"/>
        </g>
        <g stroke="#8E6E48" stroke-width="1.6" opacity=".3" fill="none">
          <path d="M80 176 v44"/><path d="M100 176 v46"/><path d="M120 176 v44"/>
        </g>
        <path d="M82 214 q18 -16 36 0" fill="none" stroke="url(#gGold)" stroke-width="5" stroke-linecap="round"/>
        <path d="M100 214 q-14 -10 -18 2 q10 6 18 -2Z" fill="url(#gGold)"/>
        <path d="M100 214 q14 -10 18 2 q-10 6 -18 -2Z" fill="url(#gGold)"/>
      </g>
    </svg>`,

  /* espresso gift box with gold hairlines + satin bow (the brand bag) */
  box: () => `
    <svg viewBox="0 0 200 250" class="art" aria-hidden="true">
      <ellipse class="jar-shadow" cx="100" cy="226" rx="70" ry="11"/>
      <g class="art-float">
        <!-- body -->
        <rect x="34" y="128" width="132" height="92" rx="4" fill="var(--tint,#4E382B)"/>
        <rect x="34" y="128" width="34" height="92" fill="#fff" opacity=".07"/>
        <rect x="146" y="128" width="20" height="92" fill="#000" opacity=".14"/>
        <rect x="42" y="140" width="116" height="1.3" fill="url(#gGold)" opacity=".55"/>
        <rect x="42" y="208" width="116" height="1.3" fill="url(#gGold)" opacity=".55"/>
        <!-- lid -->
        <rect x="24" y="102" width="152" height="30" rx="4" fill="#3B2A20"/>
        <rect x="24" y="102" width="152" height="9" rx="4" fill="#fff" opacity=".1"/>
        <rect x="32" y="122" width="136" height="1.4" fill="url(#gGold)" opacity=".8"/>
        <!-- ribbon -->
        <rect x="88" y="102" width="24" height="118" fill="url(#gGold)"/>
        <rect x="88" y="102" width="7" height="118" fill="#fff" opacity=".28"/>
        <rect x="106" y="102" width="6" height="118" fill="#000" opacity=".12"/>
        <!-- bow loops -->
        <path d="M100 100 C72 78 44 74 42 90 C40 105 74 106 100 100Z" fill="url(#gGold)"/>
        <path d="M100 100 C128 78 156 74 158 90 C160 105 126 106 100 100Z" fill="url(#gGold)"/>
        <path d="M100 100 C80 90 58 84 50 90 C46 96 78 102 100 100Z" fill="#000" opacity=".16"/>
        <path d="M100 100 C120 90 142 84 150 90 C154 96 122 102 100 100Z" fill="#000" opacity=".16"/>
        <!-- tails -->
        <path d="M94 104 L78 132 L90 126 L92 138 L104 106Z" fill="url(#gGold)" opacity=".92"/>
        <path d="M106 104 L124 130 L112 126 L110 138 L98 106Z" fill="url(#gGold)" opacity=".92"/>
        <!-- knot -->
        <ellipse cx="100" cy="100" rx="11" ry="9" fill="#E0C070"/>
        <ellipse cx="100" cy="97" rx="6" ry="3.6" fill="#F6E4B0"/>
      </g>
    </svg>`,

  bouquet: () => `
    <svg viewBox="0 0 200 250" class="art" aria-hidden="true">
      <ellipse class="jar-shadow" cx="100" cy="230" rx="46" ry="8"/>
      <g class="art-float">
        <g stroke="#6E7F55" stroke-width="3" fill="none" stroke-linecap="round">
          <path d="M100 150 L100 214"/><path d="M88 152 L78 210"/><path d="M112 152 L122 210"/>
        </g>
        <path d="M64 122 q-14 -16 2 -24 q14 6 10 24Z" fill="#6E7F55"/>
        <path d="M136 120 q14 -16 -2 -24 q-14 6 -10 24Z" fill="#7C8D62"/>
        <path d="M52 140 q-16 -10 -6 -22 q14 2 16 20Z" fill="#7C8D62"/>
        <path d="M148 138 q16 -10 6 -22 q-14 2 -16 20Z" fill="#6E7F55"/>
        <circle cx="72" cy="118" r="19" fill="#F0C8A8"/><circle cx="72" cy="118" r="12" fill="#E4AE8E"/><circle cx="72" cy="118" r="5.5" fill="#D69B7E"/>
        <circle cx="128" cy="116" r="18" fill="#F6DCC8"/><circle cx="128" cy="116" r="11" fill="#EDC0A4"/><circle cx="128" cy="116" r="5" fill="#DDA184"/>
        <circle cx="100" cy="98" r="20" fill="#F3D2BC"/><circle cx="100" cy="98" r="12.5" fill="#E9B99C"/><circle cx="100" cy="98" r="5.5" fill="#D69B7E"/>
        <circle cx="86" cy="134" r="14" fill="#F6E0D0"/><circle cx="86" cy="134" r="8" fill="#EBC3A8"/>
        <circle cx="116" cy="136" r="13" fill="#F0CDB6"/><circle cx="116" cy="136" r="7.5" fill="#E2AF92"/>
        <g fill="#FCF8F0">
          <g transform="translate(58,98)"><circle r="7"/><circle r="2.8" fill="#E8C468"/></g>
          <g transform="translate(142,96)"><circle r="7"/><circle r="2.8" fill="#E8C468"/></g>
          <g transform="translate(100,132)"><circle r="6.5"/><circle r="2.6" fill="#E8C468"/></g>
        </g>
        <path d="M74 150 L126 150 L112 216 Q111 220 106 220 L94 220 Q89 220 88 216 Z" fill="#F6EEE0"/>
        <path d="M74 150 L100 150 L96 220 L94 220 Q89 220 88 216Z" fill="#E8DCC8"/>
        <path d="M82 176 q18 -12 36 0" fill="none" stroke="url(#gGold)" stroke-width="4.5" stroke-linecap="round"/>
        <ellipse cx="100" cy="176" rx="6" ry="4.5" fill="#E0C070"/>
      </g>
    </svg>`,

  money: () => `
    <svg viewBox="0 0 200 250" class="art" aria-hidden="true">
      <ellipse class="jar-shadow" cx="100" cy="230" rx="46" ry="8"/>
      <g class="art-float">
        <g stroke="#6E7F55" stroke-width="3" fill="none" stroke-linecap="round">
          <path d="M100 150 L100 214"/><path d="M86 150 L76 208"/><path d="M114 150 L124 208"/>
        </g>
        <g>
          <g transform="rotate(-38 100 150)"><rect x="60" y="74" width="58" height="38" rx="4" fill="#87A672"/><rect x="65" y="79" width="48" height="28" rx="3" fill="none" stroke="#F2DCA4" stroke-width="1.6" opacity=".85"/><circle cx="89" cy="93" r="8.5" fill="#E8F0DE" opacity=".85"/><text x="89" y="97" text-anchor="middle" style="font-family:Cormorant Garamond,serif;font-size:13px;font-weight:700;fill:#5E7A4C">$</text></g>
          <g transform="rotate(-13 100 150)"><rect x="66" y="62" width="58" height="38" rx="4" fill="#9CBA86"/><rect x="71" y="67" width="48" height="28" rx="3" fill="none" stroke="#F2DCA4" stroke-width="1.6" opacity=".85"/><circle cx="95" cy="81" r="8.5" fill="#EDF3E5" opacity=".9"/><text x="95" y="85" text-anchor="middle" style="font-family:Cormorant Garamond,serif;font-size:13px;font-weight:700;fill:#5E7A4C">$</text></g>
          <g transform="rotate(13 100 150)"><rect x="76" y="62" width="58" height="38" rx="4" fill="#A2BE8C"/><rect x="81" y="67" width="48" height="28" rx="3" fill="none" stroke="#F2DCA4" stroke-width="1.6" opacity=".85"/><circle cx="105" cy="81" r="8.5" fill="#EDF3E5" opacity=".9"/><text x="105" y="85" text-anchor="middle" style="font-family:Cormorant Garamond,serif;font-size:13px;font-weight:700;fill:#5E7A4C">$</text></g>
          <g transform="rotate(38 100 150)"><rect x="82" y="74" width="58" height="38" rx="4" fill="#87A672"/><rect x="87" y="79" width="48" height="28" rx="3" fill="none" stroke="#F2DCA4" stroke-width="1.6" opacity=".85"/><circle cx="111" cy="93" r="8.5" fill="#E8F0DE" opacity=".85"/><text x="111" y="97" text-anchor="middle" style="font-family:Cormorant Garamond,serif;font-size:13px;font-weight:700;fill:#5E7A4C">$</text></g>
        </g>
        <circle cx="70" cy="132" r="16" fill="#F0C8A8"/><circle cx="70" cy="132" r="10" fill="#E4AE8E"/><circle cx="70" cy="132" r="4.5" fill="#D69B7E"/>
        <circle cx="130" cy="130" r="15" fill="#F6DCC8"/><circle cx="130" cy="130" r="9" fill="#EDC0A4"/><circle cx="130" cy="130" r="4" fill="#DDA184"/>
        <circle cx="100" cy="140" r="14" fill="#F3D2BC"/><circle cx="100" cy="140" r="8.5" fill="#E9B99C"/><circle cx="100" cy="140" r="4" fill="#D69B7E"/>
        <g fill="#FCF8F0"><g transform="translate(85,120)"><circle r="6.5"/><circle r="2.6" fill="#E8C468"/></g><g transform="translate(117,118)"><circle r="6.5"/><circle r="2.6" fill="#E8C468"/></g></g>
        <path d="M74 150 L126 150 L112 216 Q111 220 106 220 L94 220 Q89 220 88 216 Z" fill="#3B2A20"/>
        <path d="M74 150 L100 150 L96 220 L94 220 Q89 220 88 216Z" fill="#000" opacity=".2"/>
        <path d="M80 168 h40" stroke="url(#gGold)" stroke-width="1.6" opacity=".7"/>
        <path d="M82 184 q18 -12 36 0" fill="none" stroke="url(#gGold)" stroke-width="4.5" stroke-linecap="round"/>
        <ellipse cx="100" cy="184" rx="6" ry="4.5" fill="#E0C070"/>
      </g>
    </svg>`,

  tag: () => `
    <svg viewBox="0 0 200 250" class="art" aria-hidden="true">
      <ellipse class="jar-shadow" cx="100" cy="230" rx="48" ry="8"/>
      <g class="art-float">
        <g fill="none" stroke="#B9A88E" stroke-width="3">
          <path d="M62 34 Q100 66 138 34"/>
        </g>
        <g fill="#C9BBA2">
          <circle cx="70" cy="44" r="3.2"/><circle cx="80" cy="54" r="3.2"/><circle cx="92" cy="60" r="3.2"/>
          <circle cx="108" cy="60" r="3.2"/><circle cx="120" cy="54" r="3.2"/><circle cx="130" cy="44" r="3.2"/>
        </g>
        <g transform="rotate(-7 100 150)">
          <rect x="52" y="76" width="96" height="140" rx="30" fill="#CFC3AC"/>
          <rect x="52" y="76" width="96" height="140" rx="30" fill="none" stroke="url(#gGold)" stroke-width="2"/>
          <rect x="58" y="82" width="84" height="128" rx="26" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="1.2"/>
          <circle cx="100" cy="98" r="8" fill="#8E8471"/>
          <circle cx="100" cy="98" r="8" fill="none" stroke="url(#gGold)" stroke-width="1.6"/>
          <text x="100" y="146" class="engrave-script" text-anchor="middle" style="fill:#6E6553;font-size:30px">Bella</text>
          <rect x="70" y="158" width="60" height="2" rx="1" fill="#8E8471" opacity=".7"/>
          <text x="100" y="180" class="engrave-sub" text-anchor="middle" style="fill:#7A7160;font-size:10px">571-575-7174</text>
        </g>
      </g>
    </svg>`,

  tumbler: () => `
    <svg viewBox="0 0 200 250" class="art" aria-hidden="true">
      <ellipse class="jar-shadow" cx="100" cy="232" rx="46" ry="8"/>
      <g class="art-float">
        <rect x="96" y="20" width="9" height="46" rx="4.5" fill="#D8C6B0"/>
        <path d="M96 62 q-14 4 -14 14" fill="none" stroke="#D8C6B0" stroke-width="9" stroke-linecap="round"/>
        <rect x="64" y="62" width="72" height="20" rx="8" fill="#7A6E60"/>
        <rect x="64" y="62" width="72" height="7" rx="4" fill="#fff" opacity=".16"/>
        <path d="M68 80 L132 80 L122 216 Q121 222 114 222 L86 222 Q79 222 78 216 Z" fill="var(--tint,#A8B4BC)"/>
        <path d="M68 80 L84 80 L78 222 L86 222 Q79 222 78 216Z" fill="#fff" opacity=".22"/>
        <path d="M120 84 L128 84 L120 218 L114 218 Z" fill="#000" opacity=".1"/>
        <rect x="78" y="120" width="44" height="1.6" rx="1" fill="#fff" opacity=".55"/>
        <text x="100" y="152" class="engrave-script" text-anchor="middle" style="font-size:34px;fill:#FFFDF8;opacity:.92">Kay</text>
        <rect x="78" y="164" width="44" height="1.6" rx="1" fill="#fff" opacity=".55"/>
      </g>
    </svg>`,

  mug: () => `
    <svg viewBox="0 0 200 250" class="art" aria-hidden="true">
      <ellipse class="jar-shadow" cx="100" cy="228" rx="52" ry="9"/>
      <g class="art-float">
        <g class="steam" fill="none" stroke="#E8DCC8" stroke-width="3.4" stroke-linecap="round" opacity=".55">
          <path d="M84 74 q9 -14 0 -28 q-9 -14 0 -26"/>
          <path d="M104 68 q9 -14 0 -28 q-9 -14 0 -24"/>
          <path d="M122 76 q9 -12 0 -24"/>
        </g>
        <path d="M132 122 q28 0 28 24 t-28 26" fill="none" stroke="var(--tint,#D8C6B0)" stroke-width="13" stroke-linecap="round"/>
        <path d="M132 122 q28 0 28 24 t-28 26" fill="none" stroke="#000" stroke-opacity=".08" stroke-width="5" stroke-linecap="round"/>
        <path d="M52 100 L138 100 L130 208 Q129 216 120 216 L70 216 Q61 216 60 208 Z" fill="var(--tint,#D8C6B0)"/>
        <path d="M52 100 L70 100 L64 216 L70 216 Q61 216 60 208Z" fill="#fff" opacity=".28"/>
        <ellipse cx="95" cy="100" rx="43" ry="10" fill="#F6EEE0"/>
        <ellipse cx="95" cy="101" rx="35" ry="7.5" fill="#5B3A24"/>
        <rect x="66" y="136" width="58" height="1.6" rx="1" fill="url(#gGold)" opacity=".85"/>
        <text x="95" y="170" class="engrave-script" text-anchor="middle" style="font-size:36px;fill:#7A5A3A">Mom</text>
        <rect x="66" y="182" width="58" height="1.6" rx="1" fill="url(#gGold)" opacity=".85"/>
      </g>
    </svg>`,

  emblem: () => `
    <svg viewBox="0 0 200 250" class="art" aria-hidden="true">
      <ellipse class="jar-shadow" cx="100" cy="230" rx="60" ry="9"/>
      <g class="art-float">
        <circle cx="100" cy="140" r="72" fill="#7A4B2C"/>
        <circle cx="100" cy="140" r="72" fill="none" stroke="url(#gGold)" stroke-width="2.5"/>
        <circle cx="100" cy="140" r="63" fill="#9C6A44"/>
        <circle cx="100" cy="140" r="55" fill="none" stroke="#6E4326" stroke-width="1.6" opacity=".55"/>
        <circle cx="100" cy="140" r="42" fill="none" stroke="#6E4326" stroke-width="1.6" opacity=".4"/>
        <circle cx="100" cy="140" r="28" fill="none" stroke="#6E4326" stroke-width="1.6" opacity=".3"/>
        <text x="100" y="134" class="engrave-script" text-anchor="middle" style="font-size:40px">Carter</text>
        <rect x="70" y="148" width="60" height="1.8" rx="1" fill="url(#gGold)"/>
        <text x="100" y="170" class="engrave-sub" text-anchor="middle">EST. 2016</text>
      </g>
    </svg>`,

  mat: () => `
    <svg viewBox="0 0 200 250" class="art" aria-hidden="true">
      <ellipse class="jar-shadow" cx="100" cy="216" rx="72" ry="10"/>
      <g class="art-float">
        <path d="M34 196 L64 92 L136 92 L166 196 Z" fill="var(--tint,#8A7048)"/>
        <path d="M34 196 L64 92 L136 92 L166 196 Z" fill="none" stroke="#6E5836" stroke-width="2"/>
        <path d="M46 186 L72 102 L128 102 L154 186 Z" fill="none" stroke="#F6EEE0" stroke-width="2.5" opacity=".7"/>
        <g stroke="#6E5836" stroke-width="1" opacity=".35">
          <path d="M40 180 H160"/><path d="M44 166 H156"/><path d="M48 152 H152"/><path d="M52 138 H148"/><path d="M56 124 H144"/><path d="M60 110 H140"/>
        </g>
        <text x="100" y="152" class="engrave-script" text-anchor="middle" style="font-size:34px;fill:#FBF6EA">Welcome</text>
        <text x="100" y="172" class="engrave-sub" text-anchor="middle" style="fill:#F6EEE0;font-size:10px">THE CARTERS</text>
      </g>
    </svg>`,

  wood: () => `
    <svg viewBox="0 0 200 250" class="art" aria-hidden="true">
      <ellipse class="jar-shadow" cx="100" cy="232" rx="58" ry="9"/>
      <g class="art-float">
        <ellipse cx="100" cy="138" rx="74" ry="76" fill="#6E4326"/>
        <ellipse cx="100" cy="134" rx="70" ry="72" fill="#8A5A38"/>
        <g fill="none" stroke="#6E4326" stroke-opacity=".45" stroke-width="1.8">
          <ellipse cx="100" cy="134" rx="58" ry="60"/><ellipse cx="98" cy="136" rx="45" ry="47"/>
          <ellipse cx="102" cy="132" rx="32" ry="34"/><ellipse cx="100" cy="134" rx="19" ry="21"/>
        </g>
        <path d="M100 118 c-10 -16 -34 -8 -34 10 c0 16 22 28 34 38 c12 -10 34 -22 34 -38 c0 -18 -24 -26 -34 -10Z" fill="#5C3720" opacity=".55"/>
        <path d="M100 118 c-10 -16 -34 -8 -34 10 c0 16 22 28 34 38 c12 -10 34 -22 34 -38 c0 -18 -24 -26 -34 -10Z" fill="none" stroke="url(#gGold)" stroke-width="2"/>
        <rect x="74" y="182" width="52" height="1.8" rx="1" fill="url(#gGold)" opacity=".85"/>
      </g>
    </svg>`
};

document.addEventListener('DOMContentLoaded', () => {

  /* ============ inject illustrations ============ */
  document.querySelectorAll('#candleGrid .pcard-art, #seasonGrid .pcard-art')
    .forEach(el => { el.innerHTML = ART.candle(); });

  document.querySelectorAll('[data-art]').forEach(card => {
    const slot = card.querySelector('.pcard-art, .collection-art');
    const build = ART[card.dataset.art];
    if (slot && build) slot.innerHTML = build();
  });

  /* ============ preloader ============ */
  const preloader = document.getElementById('preloader');
  const dismiss = () => preloader.classList.add('done');
  window.addEventListener('load', () => setTimeout(dismiss, 700));
  setTimeout(dismiss, 2600); // safety net

  /* ============ header + scroll progress ============ */
  const header = document.getElementById('siteHeader');
  const progress = document.getElementById('scrollProgress');
  const hero = document.getElementById('hero');

  const onScroll = () => {
    const y = window.scrollY;
    header.classList.toggle('scrolled', y > 40);

    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = max > 0 ? `${(y / max) * 100}%` : '0%';

    // hero parallax
    if (hero && y < window.innerHeight) {
      const inner = hero.querySelector('.hero-inner');
      const bg = hero.querySelector('.hero-bg');
      if (inner) inner.style.transform = `translateY(${y * 0.22}px)`;
      if (bg) bg.style.transform = `translateY(${y * 0.1}px)`;
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ============ nav indicator ============ */
  const navLinks = document.getElementById('navLinks');
  const indicator = document.getElementById('navIndicator');
  const tabButtons = [...document.querySelectorAll('.tab-btn')];

  function moveIndicator() {
    const active = navLinks.querySelector('.tab-btn.is-active');
    if (!active || !indicator) return;
    indicator.style.left = `${active.offsetLeft}px`;
    indicator.style.width = `${active.offsetWidth}px`;
  }
  window.addEventListener('resize', moveIndicator);
  if (document.fonts) document.fonts.ready.then(moveIndicator);
  requestAnimationFrame(moveIndicator);
  setTimeout(moveIndicator, 400);

  /* ============ tabs ============ */
  const panels = [...document.querySelectorAll('.panel')];
  const mobileMenu = document.getElementById('mobileMenu');
  const burger = document.getElementById('burger');
  const mmItems = [...document.querySelectorAll('.mm-item')];

  function closeMenu() {
    mobileMenu.classList.remove('open');
    burger.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  function activateTab(name) {
    panels.forEach(p => p.classList.toggle('is-active', p.dataset.panel === name));

    tabButtons.forEach(b => {
      const on = b.dataset.tab === name;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-selected', on);
    });
    mmItems.forEach(m => m.classList.toggle('is-active', m.dataset.tabLink === name));

    moveIndicator();
    closeMenu();
    window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });

    // re-run reveals for the newly visible panel
    const panel = panels.find(p => p.dataset.panel === name);
    if (panel) {
      panel.querySelectorAll('.reveal').forEach(el => el.classList.remove('in'));
      requestAnimationFrame(() => {
        panel.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
      });
    }
    onScroll();
  }

  tabButtons.forEach(b => b.addEventListener('click', () => activateTab(b.dataset.tab)));
  document.querySelectorAll('[data-tab-link]').forEach(el =>
    el.addEventListener('click', () => activateTab(el.dataset.tabLink))
  );

  burger.addEventListener('click', () => {
    const open = !mobileMenu.classList.contains('open');
    mobileMenu.classList.toggle('open', open);
    burger.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMenu();
  });

  /* ============ gift filters ============ */
  const chips = [...document.querySelectorAll('.chip')];
  const giftCards = [...document.querySelectorAll('#giftGrid .pcard')];
  const giftEmpty = document.getElementById('giftEmpty');

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('is-active'));
      chip.classList.add('is-active');

      const filter = chip.dataset.filter;
      let shown = 0;

      giftCards.forEach((card, i) => {
        const match = filter === 'all' ||
          (card.dataset.occasions || '').split(' ').includes(filter);
        card.classList.toggle('filtered-out', !match);
        if (match) {
          shown++;
          card.classList.remove('in');
          card.style.transitionDelay = `${i * 45}ms`;
          requestAnimationFrame(() => card.classList.add('in'));
        }
      });

      if (giftEmpty) giftEmpty.hidden = shown !== 0;
    });
  });

  /* ============ reveal on scroll ============ */
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  /* ============ petals ============ */
  const petalBox = document.getElementById('petals');
  if (petalBox && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const rnd = (min, max) => Math.random() * (max - min) + min;
    for (let i = 0; i < 16; i++) {
      const p = document.createElement('span');
      p.className = 'petal';
      const scale = rnd(0.7, 1.5);
      p.style.left = `${rnd(0, 100)}%`;
      p.style.width = `${11 * scale}px`;
      p.style.height = `${13 * scale}px`;
      p.style.setProperty('--drift', `${rnd(-90, 120)}px`);
      p.style.animationDuration = `${rnd(13, 26)}s`;
      p.style.animationDelay = `${-rnd(0, 22)}s`;
      petalBox.appendChild(p);
    }
  }

  /* ============ 3D tilt on cards ============ */
  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (canHover) {
    document.querySelectorAll('.tilt').forEach(card => {
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform =
          `perspective(900px) rotateX(${-py * 5}deg) rotateY(${px * 5}deg) translateY(-9px)`;
      });
      card.addEventListener('mouseleave', () => { card.style.transform = ''; });
    });
  }

  /* ============ footer year ============ */
  const yr = document.getElementById('year');
  if (yr) yr.textContent = new Date().getFullYear();
});
