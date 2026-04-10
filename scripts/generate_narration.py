"""
Generate narration audio — v4 dialogue, AlvaroNeural (male), +5% rate.
After generation, prints exact duration of each segment so we can
calculate the minimum scene length needed.
"""
import asyncio, struct, os
import edge_tts

VOICE = "es-ES-AlvaroNeural"
RATE  = "+5%"
OUTPUT_DIR = "public/audio"

# v4 original texts — DO NOT shorten
SEGMENTS = [
    ("narr_01_hook.mp3",
     "¿Cuánto has ganado en este proyecto? "
     "¿Cuánto queda por cobrar? ¿Cuánto te costó?"),

    ("narr_02_problem.mp3",
     "Llevas los proyectos en la cabeza, los gastos en Excel "
     "y las facturas donde puedas. "
     "Y nunca tienes el control real de tu negocio."),

    ("narr_03_twist.mp3",
     "Hay una forma mejor."),

    ("narr_04_ocr.mp3",
     "¿Una factura de proveedor? Haz una foto. "
     "La inteligencia artificial extrae el NIF, el IVA y el importe sola."),

    ("narr_05_dashboard.mp3",
     "De un vistazo: ingresos, gastos, beneficio neto por proyecto "
     "y estimación fiscal. Sin abrir Excel."),

    ("narr_06_export.mp3",
     "Y cuando tu gestor lo necesite, "
     "exportas el informe en segundos."),

    ("narr_07_pricing.mp3",
     "ProjectTrack no es un programa de facturación. "
     "Es el copiloto financiero para quien trabaja por proyectos: "
     "freelancers, estudios, consultoras, constructoras. "
     "Empieza gratis. El plan PRO son menos de quince euros al mes."),

    ("narr_08_cta.mp3",
     "Entra ahora en projecttrack punto app y empieza hoy. "
     "Sin tarjeta. Sin complicaciones. "
     "Solo tú con el control de tu negocio."),
]


def mp3_duration(path: str) -> float:
    """Parse MP3 frame headers to get accurate duration."""
    bitrates_v1_l3 = [0,32,40,48,56,64,80,96,112,128,160,192,224,256,320,0]
    samplerates    = {0b00: 44100, 0b01: 48000, 0b10: 32000}
    total_samples  = 0
    sr_out         = 44100

    with open(path, 'rb') as f:
        data = f.read()

    i = 0
    while i < len(data) - 3:
        # Skip ID3 tag
        if data[i:i+3] == b'ID3':
            sz = ((data[i+6]&0x7F)<<21)|((data[i+7]&0x7F)<<14)|\
                 ((data[i+8]&0x7F)<<7)|(data[i+9]&0x7F)
            i += 10 + sz
            continue
        if data[i] == 0xFF and (data[i+1] & 0xE0) == 0xE0:
            b1, b2 = data[i+1], data[i+2]
            br_idx = (b2 >> 4) & 0xF
            sr_idx = (b2 >> 2) & 0x3
            pad    = (b2 >> 1) & 0x1
            if 0 < br_idx < 15 and sr_idx in samplerates:
                br = bitrates_v1_l3[br_idx] * 1000
                sr = samplerates[sr_idx]
                sr_out = sr
                frame_size = int(144 * br / sr) + pad
                total_samples += 1152
                i += frame_size
                continue
        i += 1
    return total_samples / sr_out


async def generate_segment(filename: str, text: str):
    path = f"{OUTPUT_DIR}/{filename}"
    comm = edge_tts.Communicate(text, VOICE, rate=RATE)
    await comm.save(path)


async def main():
    print(f"Voice: {VOICE}  Rate: {RATE}\n")
    for filename, text in SEGMENTS:
        await generate_segment(filename, text)

    FPS = 30
    NARR_DELAY_FRAMES = 8   # frames before narration starts inside scene
    TAIL_FRAMES = 45         # breathing room after narration ends (1.5 s)

    print(f"{'Segment':<26} {'Audio':>7}  {'Min scene':>10}  {'Min frames':>11}")
    print("-" * 60)
    for filename, _ in SEGMENTS:
        path = f"{OUTPUT_DIR}/{filename}"
        dur  = mp3_duration(path)
        min_scene_s = (NARR_DELAY_FRAMES + dur * FPS + TAIL_FRAMES) / FPS
        min_frames  = int(NARR_DELAY_FRAMES + dur * FPS + TAIL_FRAMES)
        print(f"{filename:<26} {dur:>6.2f}s  {min_scene_s:>9.2f}s  {min_frames:>10} fr")


if __name__ == "__main__":
    asyncio.run(main())
