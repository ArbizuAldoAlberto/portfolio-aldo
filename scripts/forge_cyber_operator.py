#!/usr/bin/env python3
"""
forge_cyber_operator.py (Iteración 3 — Hard-Surface Tectonic Bionic Armor)
==========================================================================
Forja procedural en Blender Headless (`ab3d-forge` / Motor Local B, $0 API) del activo:
  `public/models/cyber_operator_sotd.glb`

Diseño Hard-Surface inspirado en Apple Design / Palantir / Active Theory:
  1. `Chassis_Thorax_Primary`  : Peto torácico facetado CNC + gola cervical alta (gorget) que recibe el cuello real
  2. `Chassis_Pauldron_L / R`  : Hombreras tectónicas angulares (placas superpuestas biseladas, cero esferas infladas)
  3. `Clavicle_Strut_L / R`    : Actuadores claviculares y nervaduras esternales en Oro Solar (#D4AF37)
  4. `Cervical_Spine_Column`   : Pistones hidráulicos cervicales y collarín biónico
  5. `Cranium_Bionic_Helmet`   : Corona neural occipital y arcos temporales CNC (sin burbuja tras la cabeza)
  6. `Quantum_Core_Reactor`    : Reactor cardíaco octaédrico/icosaédrico multicapa en el esternón
  7. `DataStream_Tendrils`     : Conductos fluidos de fibra óptica emergiendo de hombros y dorsales
"""

import os
import math
import bpy
import bmesh
from mathutils import Vector, Matrix

PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
OUT_GLB = os.path.join(PROJECT_ROOT, "public", "models", "cyber_operator_sotd.glb")


def clear_scene():
    bpy.ops.wm.read_factory_settings(use_empty=True)


def create_pbr_material(name, base_color, metallic=0.92, roughness=0.18, emission_color=None, emission_strength=0.0):
    mat = bpy.data.materials.new(name=name)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes.get("Principled BSDF")
    if bsdf:
        bsdf.inputs["Base Color"].default_value = (*base_color, 1.0)
        bsdf.inputs["Metallic"].default_value = metallic
        bsdf.inputs["Roughness"].default_value = roughness
        if "Coat Weight" in bsdf.inputs:
            bsdf.inputs["Coat Weight"].default_value = 1.0
            bsdf.inputs["Coat Roughness"].default_value = 0.08
        if emission_color and "Emission Color" in bsdf.inputs:
            bsdf.inputs["Emission Color"].default_value = (*emission_color, 1.0)
            bsdf.inputs["Emission Strength"].default_value = emission_strength
    return mat


def add_precision_bevel(obj, width=0.008, segments=2):
    bev = obj.modifiers.new(name="Bevel", type="BEVEL")
    bev.width = width
    bev.segments = segments
    bev.limit_method = "ANGLE"
    bev.angle_limit = math.radians(28)
    sub = obj.modifiers.new(name="Subsurf", type="SUBSURF")
    sub.levels = 1
    sub.render_levels = 1
    for poly in obj.data.polygons:
        poly.use_smooth = True


def build_tectonic_thorax(mat_obsidian):
    """Peto torácico hard-surface con facetas angulares CNC y gola cervical alta que abraza el cuello."""
    mesh = bpy.data.meshes.new("Chassis_Thorax_Primary")
    bm = bmesh.new()

    # Secciones octogonales/dodecagonales facetadas (Hard-Surface Stealth Armor)
    # En Blender: X = izq/der, -Y = frente (+Z en Three.js), Z = arriba (+Y en Three.js)
    profiles = [
        # (z_height, width_x, depth_y, front_protrusion, sternal_notch)
        (-0.72, 0.22, 0.14, 0.02, 0.00),
        (-0.52, 0.32, 0.19, 0.05, 0.02),
        (-0.30, 0.44, 0.24, 0.10, 0.04),
        (-0.06, 0.56, 0.29, 0.16, 0.06),
        (0.16,  0.60, 0.30, 0.18, 0.05),
        (0.32,  0.48, 0.26, 0.12, -0.02),
        (0.42,  0.30, 0.22, 0.08, -0.05),  # Gola cervical alta (Gorget)
    ]

    # Ángulos facetados para dar placas de blindaje tipo F-22 / Palantir
    angles_deg = [0, 22, 48, 72, 90, 108, 132, 158, 180, 202, 228, 252, 270, 288, 312, 338]
    rings = []

    for z_h, wx, dy, front_p, notch in profiles:
        ring = []
        for deg in angles_deg:
            rad = math.radians(deg)
            c = math.cos(rad)
            s = math.sin(rad)
            # s > 0 corresponde al frente (-Y en Blender)
            is_front = max(0.0, s)
            pec_plate = (1.0 - abs(abs(c) - 0.52)) * is_front * front_p
            center_notch = (1.0 - min(1.0, abs(c) * 4.2)) * is_front * notch

            vx = wx * c
            vy = -(dy * s + pec_plate - center_notch) - 0.04
            ring.append(bm.verts.new((vx, vy, z_h)))
        rings.append(ring)

    n_pts = len(angles_deg)
    for r_i in range(len(rings) - 1):
        r1 = rings[r_i]
        r2 = rings[r_i + 1]
        for i in range(n_pts):
            ni = (i + 1) % n_pts
            bm.faces.new((r1[i], r1[ni], r2[ni], r2[i]))

    bm.faces.new(rings[0][::-1])
    bm.faces.new(rings[-1])
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    bm.to_mesh(mesh)
    bm.free()

    obj = bpy.data.objects.new("Chassis_Thorax_Primary", mesh)
    bpy.context.collection.objects.link(obj)
    obj.data.materials.append(mat_obsidian)
    add_precision_bevel(obj, width=0.009, segments=2)
    return obj


def build_tectonic_pauldrons(mat_titanium):
    """Hombreras angulares multicapa (2 placas de blindaje escalonadas por hombro, cero esferas)."""
    objs = []
    for side, suffix in [(-1.0, "L"), (1.0, "R")]:
        mesh = bpy.data.meshes.new(f"Chassis_Pauldron_{suffix}")
        bm = bmesh.new()

        # Placa superior e inferior escalonadas (Layered Angular Pauldron)
        for layer_idx, (z_off, scale_w, tilt) in enumerate([(0.0, 1.0, 0.0), (-0.09, 0.88, -0.12)]):
            # Definir los 6 vértices de un perfil en V invertida y extruirlo a lo largo del hombro
            inner_x = side * (0.42 + layer_idx * 0.05)
            mid_x   = side * (0.68 + layer_idx * 0.06)
            outer_x = side * (0.88 + layer_idx * 0.04)

            profiles_x = [
                # (x, z_base, width_y,ridge_z)
                (inner_x, 0.34 + z_off, 0.16 * scale_w, 0.05),
                (mid_x,   0.30 + z_off, 0.22 * scale_w, 0.08),
                (outer_x, 0.16 + z_off + tilt, 0.14 * scale_w, 0.03),
            ]
            sec_rings = []
            for px, pz, wy, rz in profiles_x:
                # 6 puntos por sección transversal (placa biselada con espesor real)
                pts = [
                    (px, -wy - 0.04, pz),             # Borde frontal superior
                    (px, -0.04,      pz + rz),        # Cresta central superior
                    (px,  wy - 0.04, pz),             # Borde dorsal superior
                    (px,  wy - 0.04, pz - 0.038),     # Borde dorsal inferior
                    (px, -0.04,      pz + rz - 0.042),# Cresta central inferior
                    (px, -wy - 0.04, pz - 0.038),     # Borde frontal inferior
                ]
                if side < 0:
                    pts = pts[::-1]
                sec_rings.append([bm.verts.new(p) for p in pts])

            for r_i in range(len(sec_rings) - 1):
                r1 = sec_rings[r_i]
                r2 = sec_rings[r_i + 1]
                for i in range(6):
                    ni = (i + 1) % 6
                    bm.faces.new((r1[i], r1[ni], r2[ni], r2[i]))
            bm.faces.new(sec_rings[0][::-1])
            bm.faces.new(sec_rings[-1])

        bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
        bm.to_mesh(mesh)
        bm.free()

        obj = bpy.data.objects.new(f"Chassis_Pauldron_{suffix}", mesh)
        bpy.context.collection.objects.link(obj)
        obj.data.materials.append(mat_titanium)
        add_precision_bevel(obj, width=0.006, segments=2)
        objs.append(obj)
    return objs


def build_clavicles_and_sternum(mat_gold):
    """Actuadores claviculares, collarín gorget y nervaduras pectorales en Oro Solar (#D4AF37)."""
    objs = []
    # 1. Collarín Gorget Dorado que sella la base del cuello escultórico (z=0.38..0.44)
    gorget_curve = bpy.data.curves.new("Clavicle_Strut_Gorget", type="CURVE")
    gorget_curve.dimensions = "3D"
    gorget_curve.bevel_depth = 0.018
    gorget_curve.bevel_resolution = 6
    sp_g = gorget_curve.splines.new("BEZIER")
    g_pts = [
        (-0.34, -0.10, 0.40),
        (-0.18, -0.25, 0.34),
        (0.0,   -0.29, 0.31),
        (0.18,  -0.25, 0.34),
        (0.34,  -0.10, 0.40),
    ]
    sp_g.bezier_points.add(len(g_pts) - 1)
    for i, co in enumerate(g_pts):
        bp = sp_g.bezier_points[i]
        bp.co = co
        bp.handle_left_type = "AUTO"
        bp.handle_right_type = "AUTO"

    obj_g = bpy.data.objects.new("Clavicle_Strut_Gorget", gorget_curve)
    bpy.context.collection.objects.link(obj_g)
    bpy.context.view_layer.objects.active = obj_g
    bpy.ops.object.select_all(action="DESELECT")
    obj_g.select_set(True)
    bpy.ops.object.convert(target="MESH")
    obj_g.data.materials.append(mat_gold)
    objs.append(obj_g)

    # 2. Clavículas mecánicas hacia los hombros y líneas esternales
    sternum_curve = bpy.data.curves.new("Sternum_Trim_Gold_Curve", type="CURVE")
    sternum_curve.dimensions = "3D"
    sternum_curve.bevel_depth = 0.012
    sternum_curve.bevel_resolution = 5
    for side in (-1.0, 1.0):
        sp1 = sternum_curve.splines.new("BEZIER")
        pts1 = [
            (side * 0.08, -0.27, 0.28),
            (side * 0.34, -0.24, 0.32),
            (side * 0.64, -0.12, 0.31),
            (side * 0.84, -0.05, 0.20),
        ]
        sp1.bezier_points.add(len(pts1) - 1)
        for i, co in enumerate(pts1):
            bp = sp1.bezier_points[i]
            bp.co = co
            bp.handle_left_type = "AUTO"
            bp.handle_right_type = "AUTO"

        sp2 = sternum_curve.splines.new("BEZIER")
        pts2 = [
            (side * 0.03, -0.24, -0.45),
            (side * 0.05, -0.32, -0.05),
            (side * 0.32, -0.30, 0.04),
            (side * 0.52, -0.18, 0.18),
        ]
        sp2.bezier_points.add(len(pts2) - 1)
        for i, co in enumerate(pts2):
            bp = sp2.bezier_points[i]
            bp.co = co
            bp.handle_left_type = "AUTO"
            bp.handle_right_type = "AUTO"

    obj_sternum = bpy.data.objects.new("Sternum_Trim_Gold", sternum_curve)
    bpy.context.collection.objects.link(obj_sternum)
    bpy.context.view_layer.objects.active = obj_sternum
    bpy.ops.object.select_all(action="DESELECT")
    obj_sternum.select_set(True)
    bpy.ops.object.convert(target="MESH")
    obj_sternum.data.materials.append(mat_gold)
    objs.append(obj_sternum)
    return objs


def build_cervical_and_cranial_halo(mat_obsidian, mat_titanium):
    """Pistones cervicales hidráulicos + Arcos temporales CNC (sin burbuja detrás del rostro)."""
    # 1. Pistones cervicales laterales y columna vertebral
    curve_spine = bpy.data.curves.new("Cervical_Spine_Column_Curve", type="CURVE")
    curve_spine.dimensions = "3D"
    curve_spine.bevel_depth = 0.022
    curve_spine.bevel_resolution = 6
    for side in (-1.0, 1.0):
        sp = curve_spine.splines.new("BEZIER")
        pts = [
            (side * 0.24, -0.08, 0.32),
            (side * 0.20, -0.06, 0.52),
            (side * 0.16, -0.02, 0.72),
        ]
        sp.bezier_points.add(len(pts) - 1)
        for i, co in enumerate(pts):
            bp = sp.bezier_points[i]
            bp.co = co
            bp.handle_left_type = "AUTO"
            bp.handle_right_type = "AUTO"

    obj_spine = bpy.data.objects.new("Cervical_Spine_Column", curve_spine)
    bpy.context.collection.objects.link(obj_spine)
    bpy.context.view_layer.objects.active = obj_spine
    bpy.ops.object.select_all(action="DESELECT")
    obj_spine.select_set(True)
    bpy.ops.object.convert(target="MESH")
    obj_spine.data.materials.append(mat_titanium)

    # 2. Corona / Halo Neural CNC fino que enmarca las sienes sin crear efecto huevo
    halo_curve = bpy.data.curves.new("Cranium_Bionic_Helmet_Curve", type="CURVE")
    halo_curve.dimensions = "3D"
    halo_curve.bevel_depth = 0.014
    halo_curve.bevel_resolution = 6
    for side in (-1.0, 1.0):
        sp = halo_curve.splines.new("BEZIER")
        pts = [
            (side * 0.22, -0.14, 0.56),
            (side * 0.33, -0.10, 0.82),
            (side * 0.31, -0.08, 1.12),
            (side * 0.14, -0.10, 1.32),
        ]
        sp.bezier_points.add(len(pts) - 1)
        for i, co in enumerate(pts):
            bp = sp.bezier_points[i]
            bp.co = co
            bp.handle_left_type = "AUTO"
            bp.handle_right_type = "AUTO"

    obj_helm = bpy.data.objects.new("Cranium_Bionic_Helmet", halo_curve)
    bpy.context.collection.objects.link(obj_helm)
    bpy.context.view_layer.objects.active = obj_helm
    bpy.ops.object.select_all(action="DESELECT")
    obj_helm.select_set(True)
    bpy.ops.object.convert(target="MESH")
    obj_helm.data.materials.append(mat_obsidian)
    return [obj_spine, obj_helm]


def build_quantum_core(mat_core):
    """Reactor cardíaco octaédrico/icosaédrico interno alojado en el centro del tórax."""
    mesh = bpy.data.meshes.new("Quantum_Core_Reactor")
    bm = bmesh.new()
    bmesh.ops.create_icosphere(bm, subdivisions=1, radius=0.16, matrix=Matrix.Translation((0.0, -0.16, 0.06)))
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    bm.to_mesh(mesh)
    bm.free()

    obj = bpy.data.objects.new("Quantum_Core_Reactor", mesh)
    bpy.context.collection.objects.link(obj)
    obj.data.materials.append(mat_core)
    return obj


def build_datastream_tendrils(mat_cyan):
    """Conductos fluidos de datos (extremidades biónicas y filamentos neurales)."""
    curve_data = bpy.data.curves.new("DataStream_Tendrils_Curve", type="CURVE")
    curve_data.dimensions = "3D"
    curve_data.bevel_depth = 0.008
    curve_data.bevel_resolution = 4

    for side in (-1.0, 1.0):
        for idx in range(5):
            sp = curve_data.splines.new("BEZIER")
            offset_z = (idx - 2.0) * 0.045
            pts = [
                (side * 0.62, -0.06 + offset_z * 0.4, 0.24 + offset_z),
                (side * 0.88, -0.08 + offset_z, 0.02 + offset_z * 0.7),
                (side * 1.04, -0.02 - offset_z, -0.32 + offset_z),
                (side * 0.92, 0.06, -0.68 + offset_z * 1.1),
            ]
            sp.bezier_points.add(len(pts) - 1)
            for i, co in enumerate(pts):
                bp = sp.bezier_points[i]
                bp.co = co
                bp.handle_left_type = "AUTO"
                bp.handle_right_type = "AUTO"

    obj = bpy.data.objects.new("DataStream_Tendrils", curve_data)
    bpy.context.collection.objects.link(obj)
    bpy.context.view_layer.objects.active = obj
    bpy.ops.object.select_all(action="DESELECT")
    obj.select_set(True)
    bpy.ops.object.convert(target="MESH")
    obj.data.materials.append(mat_cyan)
    return obj


def main():
    clear_scene()
    os.makedirs(os.path.dirname(OUT_GLB), exist_ok=True)

    mat_obsidian = create_pbr_material("Obsidian_Titanium", (0.027, 0.043, 0.071), metallic=0.94, roughness=0.16)
    mat_titanium = create_pbr_material("Brushed_Titanium", (0.12, 0.16, 0.22), metallic=0.92, roughness=0.18)
    mat_gold = create_pbr_material(
        "Solar_Gold_Alloy",
        (0.831, 0.686, 0.216),
        metallic=0.98,
        roughness=0.14,
        emission_color=(0.831, 0.686, 0.216),
        emission_strength=0.18,
    )
    mat_cyan = create_pbr_material(
        "Quantum_Data_Stream",
        (0.0, 0.94, 1.0),
        metallic=0.85,
        roughness=0.12,
        emission_color=(0.0, 0.94, 1.0),
        emission_strength=0.35,
    )

    build_tectonic_thorax(mat_obsidian)
    build_tectonic_pauldrons(mat_titanium)
    build_clavicles_and_sternum(mat_gold)
    build_cervical_and_cranial_halo(mat_obsidian, mat_titanium)
    build_quantum_core(mat_gold)
    build_datastream_tendrils(mat_cyan)

    for obj in list(bpy.context.scene.objects):
        if obj.type == "MESH":
            bpy.context.view_layer.objects.active = obj
            for mod in list(obj.modifiers):
                bpy.ops.object.modifier_apply(modifier=mod.name)

    total_tris = sum(len(obj.data.polygons) for obj in bpy.context.scene.objects if obj.type == "MESH")
    print(f"[ab3d-forge] Total polygons forged (Iteration 3): {total_tris}")

    bpy.ops.export_scene.gltf(
        filepath=OUT_GLB,
        export_format="GLB",
        export_apply=True,
        export_yup=True,
    )
    print(f"[ab3d-forge] Exported GLB successfully -> {OUT_GLB}")


if __name__ == "__main__":
    main()
