#!/usr/bin/env python3
"""
generate_face_heightmap.py
==========================
Procesador de visión por computadora y síntesis de relieve escultórico 3D (Opción B 100% Local).
Toma la fotografía de referencia de Aldo Arbizu en `E:\\06_DOCUMENTOS\\Personal\\YO\\source_face.jpg`
(o selecciona automáticamente el retrato frontal central `5044195281498475511.jpg`),
segmenta la silueta tipo busto clásico y genera mapas con fidelidad de retrato de estudio:
  1. `public/textures/face_displacement.png` (Mapa de desplazamiento volumétrico 3D suave y simétrico)
  2. `public/textures/face_mask.png`         (Máscara alfa / silueta de busto escultórico 1024x1024)
  3. `public/textures/face_normal.png`       (Mapa de normales en espacio tangente libre de artefactos)
  4. `public/textures/face_albedo.png`       (Mapa tonal de retrato de estudio de alto rango dinámico)
"""

import os
import shutil
import cv2
import numpy as np
from scipy.ndimage import distance_transform_edt, gaussian_filter
from PIL import Image

YO_DIR = r"E:\06_DOCUMENTOS\Personal\YO"
DEFAULT_FRONTAL = os.path.join(YO_DIR, "5044195281498475511.jpg")
SOURCE_FACE_PATH = os.path.join(YO_DIR, "source_face.jpg")

PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
OUT_DIR = os.path.join(PROJECT_ROOT, "public", "textures")


def ensure_source_face() -> str:
    if not os.path.exists(SOURCE_FACE_PATH):
        if os.path.exists(DEFAULT_FRONTAL):
            shutil.copy2(DEFAULT_FRONTAL, SOURCE_FACE_PATH)
            print(f"[ OK ] Copiada foto frontal base a: {SOURCE_FACE_PATH}")
        else:
            jpgs = sorted(
                [os.path.join(YO_DIR, f) for f in os.listdir(YO_DIR) if f.lower().endswith((".jpg", ".jpeg", ".png"))]
            )
            if not jpgs:
                raise FileNotFoundError(f"No se encontraron imágenes en {YO_DIR}")
            shutil.copy2(jpgs[-2], SOURCE_FACE_PATH)
            print(f"[ OK ] Copiada foto de referencia a: {SOURCE_FACE_PATH}")
    return SOURCE_FACE_PATH


def detect_face_crop(img_bgr: np.ndarray, target_size: int = 1024):
    """Detecta el rostro frontal y encuadra un busto escultórico simétrico (cabeza + cuello + pecho superior)."""
    h, w, _ = img_bgr.shape
    gray = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2GRAY)

    cascade_path = os.path.join(cv2.data.haarcascades, "haarcascade_frontalface_default.xml")
    face_cascade = cv2.CascadeClassifier(cascade_path)
    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.08, minNeighbors=6, minSize=(180, 180))

    if len(faces) > 0:
        fx, fy, fw, fh = sorted(faces, key=lambda b: b[2] * b[3], reverse=True)[0]
        cx = fx + fw * 0.5
        cy = fy + fh * 0.52
        crop_half = int(max(fw, fh) * 1.18)
        center_y = int(cy + fh * 0.14)
        center_x = int(cx)
    else:
        center_x = w // 2
        center_y = int(h * 0.54)
        crop_half = int(min(w, h) * 0.44)

    x1 = max(0, center_x - crop_half)
    x2 = min(w, center_x + crop_half)
    y1 = max(0, center_y - crop_half)
    y2 = min(h, center_y + crop_half)

    cropped = img_bgr[y1:y2, x1:x2]
    ch, cw, _ = cropped.shape
    side = max(ch, cw)
    wall_color = np.median(cropped[:20, :, :], axis=(0, 1)).astype(np.uint8)
    square = np.full((side, side, 3), wall_color, dtype=np.uint8)
    y_off = (side - ch) // 2
    x_off = (side - cw) // 2
    square[y_off : y_off + ch, x_off : x_off + cw] = cropped

    resized = cv2.resize(square, (target_size, target_size), interpolation=cv2.INTER_LANCZOS4)
    return resized


def segment_sculptural_bust(img_bgr: np.ndarray):
    """
    Segmenta el busto escultórico (cabello, rostro, orejas, cuello íntegro y hombros en pedestal elíptico).
    """
    n = img_bgr.shape[0]
    yy, xx = np.mgrid[0:n, 0:n].astype(np.float32) / float(n)

    gray = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2GRAY)
    cascade_path = os.path.join(cv2.data.haarcascades, "haarcascade_frontalface_default.xml")
    face_cascade = cv2.CascadeClassifier(cascade_path)
    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.05, minNeighbors=5, minSize=(220, 220))

    if len(faces) > 0:
        fx, fy, fw, fh = sorted(faces, key=lambda b: b[2] * b[3], reverse=True)[0]
        fcx = (fx + fw * 0.5) / n
        fcy = (fy + fh * 0.5) / n
        frx = (fw * 0.5) / n
        fry = (fh * 0.5) / n
    else:
        fcx, fcy, frx, fry = 0.50, 0.44, 0.20, 0.21

    face_oval = ((xx - fcx) / (frx * 0.76)) ** 2 + ((yy - (fcy + 0.03)) / (fry * 1.02)) ** 2
    hair_dome = ((xx - fcx) / (frx * 0.88)) ** 2 + ((yy - (fcy - fry * 0.50)) / (fry * 0.62)) ** 2
    ears_oval = ((xx - fcx) / (frx * 0.89)) ** 2 + ((yy - (fcy + 0.02)) / (fry * 0.28)) ** 2

    neck_y_norm = np.clip((yy - (fcy + fry * 0.65)) / (fry * 1.15), 0.0, 1.0)
    neck_half_w = frx * (0.50 + 0.18 * (neck_y_norm ** 1.5))
    in_neck = (yy >= (fcy + fry * 0.60)) & (yy <= (fcy + fry * 1.85)) & (np.abs(xx - fcx) <= neck_half_w)

    bust_top_y = fcy + fry * 1.48
    shoulder_dome = ((xx - fcx) / (frx * 1.88)) ** 2 + ((yy - (fcy + fry * 2.15)) / (fry * 0.82)) ** 2
    in_shoulders = (yy >= bust_top_y) & (shoulder_dome <= 1.0)

    luma = gray.astype(np.float32) / 255.0
    hair_halo = ((xx - fcx) / (frx * 1.18)) ** 2 + ((yy - (fcy - fry * 0.45)) / (fry * 0.88)) ** 2
    is_hair_pixel = (luma < 0.42) & (hair_halo <= 1.0)

    b_ch, g_ch, r_ch = (
        img_bgr[:, :, 0].astype(np.float32),
        img_bgr[:, :, 1].astype(np.float32),
        img_bgr[:, :, 2].astype(np.float32),
    )
    is_shirt_pixel = (g_ch >= (r_ch - 14.0)) & (yy >= (fcy + fry * 1.25)) & (shoulder_dome <= 1.08)

    fg_core = (
        (face_oval <= 1.0)
        | (hair_dome <= 0.84)
        | (ears_oval <= 0.96)
        | in_neck
        | is_hair_pixel
        | is_shirt_pixel
        | (in_shoulders & (yy >= fcy + fry * 1.55))
    )

    pedestal_clip = (((xx - fcx) / 0.39) ** 2 + ((yy - 0.51) / 0.415) ** 2) <= 1.0
    fg_mask = (fg_core & pedestal_clip).astype(np.uint8) * 255

    k_close = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (15, 15))
    k_open = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (9, 9))
    fg_mask = cv2.morphologyEx(fg_mask, cv2.MORPH_CLOSE, k_close, iterations=2)
    fg_mask = cv2.morphologyEx(fg_mask, cv2.MORPH_OPEN, k_open, iterations=1)

    flood = fg_mask.copy()
    mask_flood = np.zeros((n + 2, n + 2), np.uint8)
    cv2.floodFill(flood, mask_flood, (0, 0), 255)
    holes = cv2.bitwise_not(flood)
    fg_mask = cv2.bitwise_or(fg_mask, holes)

    bottom_taper = np.clip((0.915 - yy) / 0.065, 0.0, 1.0)
    mask_float = (fg_mask.astype(np.float32) / 255.0) * bottom_taper
    mask_smooth = gaussian_filter(mask_float, sigma=4.0)
    mask_smooth = np.clip((mask_smooth - 0.12) / 0.80, 0.0, 1.0)
    mask_smooth = gaussian_filter(mask_smooth, sigma=2.2)

    return mask_smooth, (fcx, fcy, frx, fry)


def build_sculptural_height_and_normals(img_bgr: np.ndarray, mask: np.ndarray, face_params):
    """
    Construye:
      - `face_displacement.png`: Domo 3D anatómico limpio y simétrico sin deformaciones en las mejillas.
      - `face_normal.png`: Mapa de normales suave de estudio (sin manchas ni abolladuras).
      - `face_albedo.png`: Retrato tonal de estudio con iluminación simétrica corregida.
    """
    n = img_bgr.shape[0]
    fcx, fcy, frx, fry = face_params
    yy, xx = np.mgrid[0:n, 0:n].astype(np.float32) / float(n)

    # 1. Domo 3D Macro Simétrico por Transformada de Distancia
    binary_inside = mask > 0.18
    dist_px = distance_transform_edt(binary_inside).astype(np.float32)
    max_dist = max(float(np.max(dist_px)), 1.0)
    norm_dist = np.clip(dist_px / (max_dist * 0.82), 0.0, 1.0)
    macro_dome = gaussian_filter(np.power(norm_dist, 0.62), sigma=20.0)

    # 2. Volúmenes Anatómicos Simétricos (Frente, Cejas, Puente Nasal, Pómulos, Labios/Mentón)
    dx = (xx - fcx) / frx
    dy = (yy - fcy) / fry

    nose_bridge = 0.22 * np.exp(-((dx / 0.18) ** 2 + ((dy + 0.04) / 0.42) ** 2))
    nose_tip = 0.16 * np.exp(-((dx / 0.21) ** 2 + ((dy - 0.16) / 0.18) ** 2))
    brow_ridge = 0.11 * np.exp(-((dx / 0.68) ** 2 + ((dy + 0.34) / 0.14) ** 2))
    cheek_left = 0.10 * np.exp(-(((dx + 0.44) / 0.34) ** 2 + ((dy - 0.08) / 0.28) ** 2))
    cheek_right = 0.10 * np.exp(-(((dx - 0.44) / 0.34) ** 2 + ((dy - 0.08) / 0.28) ** 2))
    chin_lips = 0.12 * np.exp(-((dx / 0.36) ** 2 + ((dy - 0.56) / 0.30) ** 2))
    forehead_dome = 0.12 * np.exp(-((dx / 0.65) ** 2 + ((dy + 0.60) / 0.28) ** 2))
    eye_socket_l = -0.06 * np.exp(-(((dx + 0.33) / 0.19) ** 2 + ((dy + 0.20) / 0.11) ** 2))
    eye_socket_r = -0.06 * np.exp(-(((dx - 0.33) / 0.19) ** 2 + ((dy + 0.20) / 0.11) ** 2))

    anatomical_relief = (
        nose_bridge
        + nose_tip
        + brow_ridge
        + cheek_left
        + cheek_right
        + chin_lips
        + forehead_dome
        + eye_socket_l
        + eye_socket_r
    )

    # 3. Retrato Tonal de Estudio con Corrección de Sombra Lateral (`face_albedo.png`)
    img_rgb = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2RGB).astype(np.float32) / 255.0
    # Luminancia cálida de retrato
    raw_luma = 0.48 * img_rgb[:, :, 0] + 0.38 * img_rgb[:, :, 1] + 0.14 * img_rgb[:, :, 2]

    # Nivelación de iluminación de baja frecuencia (elimina la sombra asimétrica de la mejilla izquierda)
    low_freq_illumination = gaussian_filter(raw_luma, sigma=56.0) + 1e-4
    target_illumination = gaussian_filter(raw_luma, sigma=140.0)
    even_luma = np.clip(raw_luma * (target_illumination / low_freq_illumination), 0.0, 1.0)

    # Suavizado bilateral sutil que preserva ojos, pestañas, cejas, barba y rulos con nitidez fotográfica
    even_u8 = np.clip(even_luma * 255.0, 0, 255).astype(np.uint8)
    studio_portrait = cv2.bilateralFilter(even_u8, d=7, sigmaColor=18, sigmaSpace=7).astype(np.float32) / 255.0

    # Curva S de contraste ejecutivo para el mapa de albedo escultórico
    p_low, p_high = np.percentile(studio_portrait[mask > 0.2], [2.0, 98.5])
    studio_norm = np.clip((studio_portrait - p_low) / max(p_high - p_low, 1e-4), 0.0, 1.0)
    sculpt_albedo = np.power(studio_norm, 0.92) * mask

    # 4. Mapa de Desplazamiento 3D Limpio (`face_displacement.png`)
    # Basado principalmente en el domo anatómico 3D + relieve fino nivelado (sin abolladuras por sombras)
    fine_detail = studio_norm - gaussian_filter(studio_norm, sigma=10.0)
    hair_region = np.clip(((fcy + 0.05 * fry) - yy) / (0.60 * fry), 0.0, 1.0) * mask
    hair_lift = np.clip((0.45 - studio_norm) / 0.45, 0.0, 1.0) * hair_region * 0.16

    height = (0.68 * macro_dome + anatomical_relief + 0.12 * studio_norm + 0.08 * fine_detail + hair_lift) * mask
    valid = height[mask > 0.05]
    if valid.size > 0:
        h_min, h_max = np.percentile(valid, 1.0), np.percentile(valid, 99.5)
        height = np.clip((height - h_min) / max(h_max - h_min, 1e-5), 0.0, 1.0) * mask

    displacement_map = gaussian_filter(height, sigma=3.2) * mask

    # 5. Mapa de Normales Escultórico de Estudio (`face_normal.png`)
    normal_surface = (displacement_map + 0.035 * fine_detail * mask).astype(np.float32)
    normal_surface = gaussian_filter(normal_surface, sigma=1.6).astype(np.float32)
    dz_dx = cv2.Sobel(normal_surface, cv2.CV_32F, 1, 0, ksize=5) * 2.4
    dz_dy = cv2.Sobel(normal_surface, cv2.CV_32F, 0, 1, ksize=5) * 2.4
    nx = -dz_dx * mask
    ny = dz_dy * mask
    nz = np.ones_like(nx)
    norm_len = np.sqrt(nx * nx + ny * ny + nz * nz) + 1e-6
    nx /= norm_len
    ny /= norm_len
    nz /= norm_len

    normal_rgb = np.stack([(nx * 0.5 + 0.5), (ny * 0.5 + 0.5), (nz * 0.5 + 0.5)], axis=-1)
    normal_u8 = np.clip(normal_rgb * 255.0, 0, 255).astype(np.uint8)

    albedo_u8 = np.clip(sculpt_albedo * 255.0, 0, 255).astype(np.uint8)
    disp_u8 = np.clip(displacement_map * 255.0, 0, 255).astype(np.uint8)
    mask_u8 = np.clip(mask * 255.0, 0, 255).astype(np.uint8)

    return disp_u8, mask_u8, normal_u8, albedo_u8


def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    src_path = ensure_source_face()
    print(f"[1/4] Cargando retrato base: {src_path}")

    img_bgr = cv2.imread(src_path, cv2.IMREAD_COLOR)
    if img_bgr is None:
        raise RuntimeError(f"No se pudo abrir la imagen: {src_path}")

    print("[2/4] Detectando rostro y encuadrando busto escultórico 1024x1024...")
    cropped_bgr = detect_face_crop(img_bgr, target_size=1024)

    print("[3/4] Segmentando silueta de busto y sintetizando relieve 3D + normales...")
    mask, face_params = segment_sculptural_bust(cropped_bgr)
    disp_u8, mask_u8, normal_u8, albedo_u8 = build_sculptural_height_and_normals(cropped_bgr, mask, face_params)

    disp_path = os.path.join(OUT_DIR, "face_displacement.png")
    mask_path = os.path.join(OUT_DIR, "face_mask.png")
    normal_path = os.path.join(OUT_DIR, "face_normal.png")
    albedo_path = os.path.join(OUT_DIR, "face_albedo.png")

    Image.fromarray(disp_u8, mode="L").save(disp_path, optimize=True)
    Image.fromarray(mask_u8, mode="L").save(mask_path, optimize=True)
    Image.fromarray(normal_u8, mode="RGB").save(normal_path, optimize=True)
    Image.fromarray(albedo_u8, mode="L").save(albedo_path, optimize=True)

    print(f"[4/4] Mapas escultóricos 3D generados exitosamente en {OUT_DIR}:")
    print(f"  - {disp_path}")
    print(f"  - {mask_path}")
    print(f"  - {normal_path}")
    print(f"  - {albedo_path}")


if __name__ == "__main__":
    main()
