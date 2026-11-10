# -*- coding: utf-8 -*-
# Python 2.7. Texture / shader / model / audio inventory for the Kubrik project.
import os, re, sys, io, struct
from collections import Counter, defaultdict

ROOT = sys.argv[1]
ASSETS = os.path.join(ROOT, 'Assets')

def img_size(p):
    try:
        with open(p, 'rb') as f:
            h = f.read(32)
            ext = os.path.splitext(p)[1].lower()
            if h[:8] == b'\x89PNG\r\n\x1a\n':
                return struct.unpack('>II', h[16:24])
            if h[:2] == b'BM':
                w, hh = struct.unpack('<ii', h[18:26]); return (w, abs(hh))
            if h[:4] == b'8BPS':
                hh, w = struct.unpack('>II', h[14:22]); return (w, hh)
            if ext == '.tga':
                return struct.unpack('<HH', h[12:16])
            if h[:2] == b'\xff\xd8':
                f.seek(2)
                while True:
                    b = f.read(4)
                    if len(b) < 4: return None
                    marker, ln = struct.unpack('>HH', b)
                    if 0xFFC0 <= marker <= 0xFFCF and marker not in (0xFFC4, 0xFFC8, 0xFFCC):
                        d = f.read(5); hh, w = struct.unpack('>HH', d[1:5]); return (w, hh)
                    f.seek(ln - 2, 1)
            if h[:2] in (b'II', b'MM'):
                return None
    except Exception:
        return None
    return None

tex_ext = ('.png', '.bmp', '.psd', '.tga', '.jpg', '.tif')
buckets = defaultdict(Counter)
big = []
unknown = 0
by_folder = defaultdict(list)
for d, _, files in os.walk(ASSETS):
    for f in files:
        e = os.path.splitext(f)[1].lower()
        if e in tex_ext:
            p = os.path.join(d, f)
            s = img_size(p)
            top = 'Original' if os.sep + 'Original' + os.sep in p else 'Remastered'
            if not s:
                unknown += 1; continue
            m = max(s)
            b = '<=64' if m <= 64 else '<=128' if m <= 128 else '<=256' if m <= 256 else '<=512' if m <= 512 else '<=1024' if m <= 1024 else '<=2048' if m <= 2048 else '>2048'
            buckets[top][b] += 1
            rel = os.path.relpath(p, ASSETS).replace('\\', '/')
            by_folder['/'.join(rel.split('/')[:4])].append(m)
            big.append((m, s, rel))

order = ['<=64', '<=128', '<=256', '<=512', '<=1024', '<=2048', '>2048']
print('TEXTURES by longest edge')
for top in sorted(buckets):
    print('  %-10s %s' % (top, '  '.join('%s:%d' % (o, buckets[top][o]) for o in order)))
print('  unreadable headers: %d' % unknown)
print('TEXTURE folders (count, median longest edge, max)')
for k in sorted(by_folder):
    v = sorted(by_folder[k])
    print('  %-55s n=%-3d median=%-5d max=%d' % (k, len(v), v[len(v)//2], v[-1]))

# shaders
kinds = Counter(); details = []
for d, _, files in os.walk(ASSETS):
    for f in files:
        if f.endswith('.shader'):
            p = os.path.join(d, f)
            t = io.open(p, 'r', encoding='utf-8', errors='replace').read()
            k = []
            if '#pragma surface' in t: k.append('surface')
            if 'CGPROGRAM' in t and '#pragma vertex' in t: k.append('vert/frag')
            if re.search(r'\bSetTexture\b', t) or ('CGPROGRAM' not in t and 'Pass' in t): k.append('fixed-function')
            if 'GrabPass' in t: k.append('grabpass')
            if not k: k = ['other']
            top = 'ImageEffects' if 'ImageEffects' in p else ('Original' if os.sep + 'Original' + os.sep in p else 'Remastered')
            kinds[(top, '+'.join(k))] += 1
print('SHADERS')
for k, v in sorted(kinds.items()):
    print('  %-14s %-28s %d' % (k[0], k[1], v))

# models & audio
ext_sz = defaultdict(lambda: [0, 0])
for d, _, files in os.walk(ASSETS):
    for f in files:
        e = os.path.splitext(f)[1].lower()
        if e in ('.fbx', '.wav', '.mp3', '.m4a', '.anim', '.controller', '.mat', '.prefab', '.unity') + tex_ext:
            a = ext_sz[e]; a[0] += 1; a[1] += os.path.getsize(os.path.join(d, f))
print('FILES by type (count, MB)')
for e, (n, sz) in sorted(ext_sz.items(), key=lambda kv: -kv[1][1]):
    print('  %-12s %4d  %.1f' % (e, n, sz / 1048576.0))

# material -> shader usage
guid_re = re.compile(r'^guid:\s*([0-9a-f]{32})', re.M)
g2p = {}
for d, _, files in os.walk(ASSETS):
    for f in files:
        if f.endswith('.shader.meta'):
            t = io.open(os.path.join(d, f), 'r', encoding='utf-8', errors='replace').read(400)
            m = guid_re.search(t)
            if m: g2p[m.group(1)] = f[:-5]
mats = Counter()
sh = re.compile(r'm_Shader:\s*\{fileID:\s*(-?\d+)(?:,\s*guid:\s*([0-9a-f]{32}))?')
for d, _, files in os.walk(ASSETS):
    for f in files:
        if f.endswith('.mat'):
            t = io.open(os.path.join(d, f), 'r', encoding='utf-8', errors='replace').read(3000)
            m = sh.search(t)
            if not m: mats['(binary/unknown)'] += 1; continue
            fid, g = m.group(1), m.group(2)
            if g is None or g.startswith('0000000000000000'):
                mats['builtin fileID %s' % fid] += 1
            else:
                mats[g2p.get(g, 'missing shader ' + g[:8])] += 1
print('MATERIALS by shader (top 30 of %d materials)' % sum(mats.values()))
for k, v in mats.most_common(30):
    print('  %-45s %d' % (k, v))
