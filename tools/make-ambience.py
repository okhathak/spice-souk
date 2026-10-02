"""Makes sounds/souk.mp3: a calm souk background, seamless as a loop.
A distant crowd murmur built from the game's own recorded voices (low-passed and
blurred until no word is understood), tea glasses clinking now and then, and a far
oud playing slowly in maqam Hijaz. Needs numpy and ffmpeg (FFMPEG env or imageio_ffmpeg)."""
import json, os, random, subprocess, sys
import numpy as np

SR, LEN, XF = 32000, 48.0, 3.0
ROOT = os.path.join(os.path.dirname(__file__), '..')
FF = os.environ.get('FFMPEG') or __import__('imageio_ffmpeg').get_ffmpeg_exe()
rng = random.Random(7); nrng = np.random.default_rng(7)
N = int(SR * LEN); L = np.zeros(N); R = np.zeros(N)

def load(f):
    raw = subprocess.run([FF, '-v', 'quiet', '-i', f, '-f', 'f32le', '-ac', '1', '-ar', str(SR), '-'], capture_output=True).stdout
    return np.frombuffer(raw, np.float32).astype(np.float64)

def lowpass(x, fc):  # one-pole, run twice
    a = np.exp(-2 * np.pi * fc / SR)
    for _ in range(2):
        y = np.empty_like(x); s = 0.0
        for i in range(len(x)): s = (1 - a) * x[i] + a * s; y[i] = s
        x = y
    return x

def place(sig, t, g, pan):
    i = int(t * SR) % N; n = len(sig)
    idx = (np.arange(n) + i) % N
    np.add.at(L, idx, sig * g * (1 - pan)); np.add.at(R, idx, sig * g * pan)

# 1. the crowd: ~150 recorded lines scattered across the loop, quiet and far
man = json.load(open(os.path.join(ROOT, 'voices', 'manifest.json'), encoding='utf-8'))
files = list(man.values()); rng.shuffle(files)
clips = [load(os.path.join(ROOT, 'voices', f)) for f in files[:60]]
for k in range(150):
    c = clips[k % len(clips)]
    rate = rng.uniform(.88, 1.06)  # different people
    c = np.interp(np.arange(0, len(c), rate), np.arange(len(c)), c)
    place(c, rng.uniform(0, LEN), rng.uniform(.08, .2), rng.uniform(.2, .8))
crowdL, crowdR = lowpass(L.copy(), 1300), lowpass(R.copy(), 1300)

# 2. reverb: a short noise tail blurs the words into murmur
def verb(x, secs=1.4):
    n = int(SR * secs); ir = nrng.standard_normal(n) * np.exp(-np.linspace(0, 6, n)); ir /= np.sqrt((ir ** 2).sum())
    k = 1 << (len(x) + n).bit_length()
    y = np.fft.irfft(np.fft.rfft(x, k) * np.fft.rfft(ir, k), k)[:len(x) + n]
    y[:n] += y[len(x):len(x) + n]; return y[:len(x)]   # wrap the tail round: the loop has no end
L[:] = crowdL * .35 + verb(crowdL) * .9; R[:] = crowdR * .35 + verb(crowdR) * .9

# 3. tea glasses, now and then
def clink():
    n = int(SR * .9); t = np.arange(n) / SR; f0 = rng.uniform(2600, 3400)
    return sum(np.sin(2 * np.pi * f0 * m * t) * np.exp(-t * d) * a for m, d, a in [(1, 9, 1), (1.53, 13, .6), (2.27, 18, .35)])
glass = np.zeros(N); t = 1.0
while t < LEN - 1:
    s = clink(); i = int(t * SR); glass[i:i + len(s)] += s[:N - i] * rng.uniform(.03, .06)
    if rng.random() < .4:
        s = clink(); j = i + int(SR * rng.uniform(.12, .25)); glass[j:j + len(s)] += s[:N - j] * .03
    t += rng.uniform(4, 9)
gv = verb(glass, 1.0); L += glass * .5 + gv * .5; R += glass * .4 + gv * .6

# 4. a far oud: slow plucks in Hijaz on D (Karplus-Strong), soft and rare
def pluck(f, secs=2.6):
    n = int(SR * secs); p = int(SR / f); buf = nrng.uniform(-1, 1, p); out = np.empty(n)
    for i in range(n):
        out[i] = buf[i % p]; buf[i % p] = .5 * (buf[i % p] + buf[(i + 1) % p]) * .996
    return lowpass(out, 2200)
D = 146.83; hijaz = [0, 1, 4, 5, 7, 8, 10, 12]
oud = np.zeros(N); t = 2.0; deg = 0
while t < LEN - 3:
    deg = max(0, min(len(hijaz) - 1, deg + rng.choice([-1, -1, 0, 1, 1, 2])))
    for k in range(rng.choice([1, 1, 2, 3])):
        s = pluck(D * 2 ** (hijaz[deg] / 12)); i = int((t + k * .38) * SR); m = min(len(s), N - i)
        oud[i:i + m] += s[:m] * .09
    t += rng.uniform(3.5, 6.5)
ov = verb(oud, 1.8); L += oud * .3 + ov * .7; R += oud * .3 + ov * .7

# 5. seamless loop: fold the last XF seconds over the start, then trim
x = int(XF * SR); fade = np.linspace(0, 1, x)
for ch in (L, R):
    ch[:x] = ch[:x] * fade + ch[N - x:] * (1 - fade)
out = np.stack([L[:N - x], R[:N - x]], 1)
out *= .5 / np.max(np.abs(out))
os.makedirs(os.path.join(ROOT, 'sounds'), exist_ok=True)
p = subprocess.run([FF, '-v', 'quiet', '-y', '-f', 'f32le', '-ac', '2', '-ar', str(SR), '-i', '-',
                    '-c:a', 'libmp3lame', '-b:a', '80k', os.path.join(ROOT, 'sounds', 'souk.mp3')],
                   input=out.astype(np.float32).tobytes())
print('souk.mp3', p.returncode, round((N - x) / SR, 1), 's')
