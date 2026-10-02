"""Records every line in voices/lines.json with Microsoft's neural voices (edge-tts) and
writes voices/manifest.json: "voice|text" -> file. Only missing clips are made, so a run
after a small game edit records only the new lines. Runs on GitHub (see .github/workflows/voices.yml)."""
import asyncio, hashlib, json, os, sys
import edge_tts

ROOT = os.path.join(os.path.dirname(__file__), '..', 'voices')
lines = json.load(open(os.path.join(ROOT, 'lines.json'), encoding='utf-8'))
mpath = os.path.join(ROOT, 'manifest.json')
man = json.load(open(mpath, encoding='utf-8')) if os.path.exists(mpath) else {}

async def one(item, sem, failed):
    key = item['voice'] + '|' + item['text']
    name = hashlib.sha1(key.encode('utf-8')).hexdigest()[:12] + '.mp3'
    fp = os.path.join(ROOT, name)
    if man.get(key) == name and os.path.exists(fp) and os.path.getsize(fp) > 800:
        return
    async with sem:
        for attempt in range(3):
            try:
                await edge_tts.Communicate(item['text'], item['voice'], rate='+6%').save(fp)
                if os.path.getsize(fp) > 800:
                    man[key] = name
                    return
            except Exception as e:  # a voice the service refuses must not stop the rest
                err = e
            await asyncio.sleep(2 + attempt * 3)
        failed.append(key)
        if os.path.exists(fp):
            os.remove(fp)

async def main():
    sem, failed = asyncio.Semaphore(4), []
    await asyncio.gather(*(one(i, sem, failed) for i in lines))
    keep = {i['voice'] + '|' + i['text'] for i in lines}
    for k in [k for k in man if k not in keep]:  # lines the game no longer says
        f = os.path.join(ROOT, man.pop(k))
        if os.path.exists(f):
            os.remove(f)
    json.dump(dict(sorted(man.items())), open(mpath, 'w', encoding='utf-8'), ensure_ascii=False, indent=0)
    print(f'{len(man)} recorded, {len(failed)} failed')
    for k in failed:
        print('FAILED', k)
    if lines and not man:
        sys.exit(1)

asyncio.run(main())
