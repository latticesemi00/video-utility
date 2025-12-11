# Lattice Video Timing & MIPI Configuration Calculator

This document describes the product: calculators, features, formulas, assets, and deployment details.

## Overview

Web-based calculators to assist FPGA/SoC designers configuring Lattice devices (CrossLink-NX, Avant, CertusPro-NX/MachXO5, Certus-NX). Includes video timing, MIPI configuration, and D-PHY timing tools. Hosted on GitHub Pages; runs as static HTML/CSS/JS.

## Pages

- `index.html` – landing page with overview, use cases, disclaimer, and navigation.
- `config.html` – MIPI Configuration Calculator with two modes:
  - User Configuration: device/package/speed selection, line rate bounds, bits/clock, D-PHY clock, pixel/byte clocks, validation, JSON import/export.
  - Pixel-Byte Frequency Calculator: P2B/B2P bandwidth calculators with reminders and tooltips.
- `video_timing.html` – Video Timing Calculator with CTA/CEA and VESA presets, custom mode, blanking totals, pixel clock and bandwidth outputs, JSON import/export, diagram tooltip.
- `dphy.html` – Soft D-PHY Timing Calculator (Gear 8), TX/RX timing parameters, min/max/IP defaults, UI/byte clock calculations, RX timing diagram tooltip, JSON export.

## JavaScript Modules

- `app.js` – mode management, device/package/speed logic, line-rate validation and clamping, MIPI and pixel-byte calculations, JSON import/export, tooltips/modals.
- `video_timing.js` – preset population, blanking and totals, color format → bits-per-pixel mapping, outputs, JSON import/export.
- `dphy.js` – D-PHY timing formulas, UI (ps), D-PHY clock, byte clock frequency/period, TX/RX timing ranges and defaults, JSON export.

## Device-Specific Behavior (config.html)

- Capability map:
  - CrossLink-NX: package + speed
  - Avant: no package/speed
  - Certus-NX: speed only
  - CertusPro-NX/MachXO5: speed only
- Line rate bounds (Mbps):
  - CrossLink-NX WLCSP84: speed_7=861, speed_8=1000, speed_9=1250
  - CrossLink-NX FCCSP104: speed_7=1034, speed_8=1200, speed_9=1500
  - CrossLink-NX QFN72/WLCSP72: speed_7=861, speed_8=1000, speed_9=1250
  - CrossLink-NX otherLIFCL: speed_7=1034, speed_8=1200, speed_9=1500
  - Avant: 1800 (no package/speed)
  - Certus-NX: speed_7=1034, speed_8=1200, speed_9=1500
  - CertusPro-NX/MachXO5: speed_7=1034, speed_8=1200, speed_9=1500

## Calculation Formulas

- MIPI (User Config):
  - Bits per Clock = (Data Type bits) × Pixel per Clock
  - D-PHY Clock (MHz) = Line Rate (Mbps) / 2
  - Pixel Clock (MHz) = (Line Rate × Number of Lanes) / Bits per Clock
  - Byte Clock Frequency (MHz) = Line Rate / Gear
- Pixel-Byte:
  - P2B Bandwidth (Mbps) = Pixel Clock × Output Pixel Lanes × Bits Per Color
  - B2P Bandwidth (Mbps) = Byte Clock × TX/RX Lanes × Gear
- Video Timing:
  - Horizontal Total = Horizontal Pixels + Total Horizontal Blanking
  - Vertical Total = Vertical Lines + Total Vertical Blanking
  - Pixels per Frame per Sec = HTotal × VTotal × Refresh Rate
  - Pixel Clock (MHz) = Pixels per Frame per Sec / (Pixel Per Clock × 1,000,000)
  - Total Link Bandwidth (Gbps) = (HTotal × VTotal × Refresh Rate × Bits per Pixel) / 1,000,000,000
- D-PHY Timing:
  - UI (ps) = 1,000,000 / Bit Rate (Mbps)
  - D-PHY Clock (MHz) = Bit Rate / 2
  - Byte Clock Frequency (MHz) = D-PHY Clock / 4
  - Byte Clock Period (ns) = 1000 / Byte Clock Frequency
  - TX/RX timing ranges follow `tx_dphy_timing_param.xlsx` (hardcoded).

## Color Format → Bits per Pixel

- RGB: 6bpc=18, 8bpc=24, 10bpc=30, 12bpc=36, 16bpc=48
- YCbCr 4:4:4: 8bpc=24, 10bpc=30, 12bpc=36, 16bpc=48
- YCbCr 4:2:2: 8bpc=16, 10bpc=20, 12bpc=24, 16bpc=32
- YCbCr 4:2:0: 8bpc=12, 10bpc=15, 12bpc=18, 16bpc=24
- RAW: 8, 10, 12, 14, 16 bits per pixel

## Tooltip & Modal System

- `.diagram-tooltip` elements show hover previews and open zoomable modals on click/Enter/Space.
- Modals close on Escape, outside click, or close button; images auto-fit viewport.

## JSON Import/Export

- Structures:
  - `config.html`: `{ selection: {...}, inputs: {...}, outputs: {...} }`
  - `video_timing.html`: `{ videoTiming: { presetResolution, inputs, outputs, meta } }`
  - `dphy.html`: `{ bit_rate, ui_ps, dphy_clock_frequency, timing_outputs, rx_timing_outputs }`
- Import validates schema and populates fields; export downloads pretty-printed JSON.

## Styling & Responsive Design

- Shared CSS variables in `styles.css`; primary `#209dd8`, hover `#3eabde`, warning `#fcdf50`, error `#e53935`, outputs on `#fefbe8`.
- Breakpoints: >1200px desktop, 900–1200px tablet, <900px mobile layout, <600px small mobile.
- Components: `.action-btn`, `.field-group`, `.output-group`, `.bandwidth-card`, `.description-box`, `.error-message`.

## Assets

Key images in `imgs/`:

- Logos/icons: `Lattice Logo Yellow_White.png`, favicons
- MIPI diagrams: `mipi-block-diagram.png`, `linerate.png`, `p2b.png`, `b2p.png`
- Video timing: `Calculator-FrameDiagram.png`
- D-PHY diagrams: `tx_dphy_main.png`, `tx_dphy.png`, `tx_dphy2.png`, `rx_dphy_main.png`, `rx_dphy2.png`, `rxtiming_lightmode.svg`
- Background: `lattice_bg_cropped.png`

## Deployment

- Hosted on GitHub Pages from the master branch; static files only.
- To deploy: push changes to the default branch; Pages updates automatically (takes ~1 minute to update the live page).

## Support

- Contacts: Rachel Ng Ai Ling, Hafiz Zaharudin.
- Repositories: internal Gitea (`hafiz.zaharudin/video-utility`) and public GitHub (`hfz-zhrdn/video-utility`).

## Change Log

- Version 1.0 (2025): initial release with MIPI configuration (dual-mode), video timing calculator, soft D-PHY timing calculator, JSON import/export, responsive design, and interactive tooltips/modals.
