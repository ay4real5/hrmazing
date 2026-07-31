# -*- coding: utf-8 -*-
"""
Stamp image URLs with a hash of their contents, e.g.

    images/logo.webp  ->  images/logo.webp?v=8f2a91c4

Why this exists
---------------
netlify.toml serves /images/* with `max-age=31536000, immutable`, which is right
for performance but means a browser will happily keep a copy for a year. Because
the filenames never change, replacing logo.webp would leave returning visitors —
and anyone who had already loaded the page — looking at the old artwork with no
way to know. Hard-refreshing is not something you can ask customers to do.

Appending a content hash makes the URL change whenever the bytes change, so the
browser fetches the new file automatically while still caching aggressively.

Run this after changing anything in images/:

    python tools/stamp-assets.py

It is idempotent — existing ?v= stamps are recalculated, not stacked.
"""
import hashlib
import io
import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PATTERN = re.compile(r'(?P<attr>src|href)="(?P<path>images/[^"?]+)(?:\?v=[0-9a-f]+)?"')


def digest(rel_path):
    full = os.path.join(ROOT, rel_path.replace('/', os.sep))
    if not os.path.exists(full):
        return None
    with open(full, 'rb') as f:
        return hashlib.md5(f.read()).hexdigest()[:8]


def main():
    html_files = [f for f in os.listdir(ROOT) if f.endswith('.html')]
    missing, stamped, changed_files = [], 0, []

    for name in sorted(html_files):
        path = os.path.join(ROOT, name)
        src = io.open(path, encoding='utf-8').read()

        def repl(m):
            nonlocal stamped
            rel = m.group('path')
            h = digest(rel)
            if h is None:
                missing.append((name, rel))
                return m.group(0)
            stamped += 1
            return f'{m.group("attr")}="{rel}?v={h}"'

        out = PATTERN.sub(repl, src)
        if out != src:
            io.open(path, 'w', encoding='utf-8').write(out)
            changed_files.append(name)

    print(f'stamped {stamped} image reference(s) across {len(html_files)} page(s)')
    if changed_files:
        print('updated: ' + ', '.join(changed_files))
    else:
        print('already up to date')
    for name, rel in missing:
        print(f'  WARNING: {name} references {rel}, which does not exist')


if __name__ == '__main__':
    main()
