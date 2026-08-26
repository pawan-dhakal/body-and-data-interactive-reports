# Body & Data — Interactive Research Publications Suite

Full-fidelity, browser-native interactive editions of Body & Data's major investigative research reports on digital rights, privacy, biometric governance, online gender-based violence, and disability justice in Nepal.

Built with **pure HTML5, modern CSS3, and zero-dependency Vanilla JavaScript** adhering to WCAG 2.1/2.2 AAA accessibility standards.

---

## 📚 Publications Suite

### 1. Nepal’s Biometric Present: Governance, Accessibility and Accountability (2025)
* **File**: `site/nepal-biometric-present.html`
* **Original PDF**: `uploads/nid_biometric_present_bd_compressed.pdf` / `site/uploads/nid_biometric_present_bd_compressed.pdf`
* **Key Features**:
  * **Interactive OpenStreetMap (Leaflet)**: Field district explorer across Kathmandu, Sarlahi (Border Plains), Khotang (Eastern Hills), and Panchthar (2018 Pilot District) with offline vendor assets.
  * **16-Year Interactive Timeline (2009–2025)**: Filterable by Procurement & Tech, Policy Directives, Legal/Supreme Court judgments, and Field Resistance.
  * **6-Step Enrolment Friction Walkthrough**: Documenting bureaucratic hurdles, data errors, and cyber café intermediary fees.
  * **6-Hop Biometric Dataflow Tracer & 18 Actionable Recommendations**.

### 2. Mapping Laws Relevant to Online Violence in Nepal: A Human Rights & Case Law Review (2021)
* **File**: `site/mapping-laws.html`
* **Original PDF**: `uploads/OnlineGBVLawsMapping-min.pdf` / `site/uploads/OnlineGBVLawsMapping-min.pdf`
* **Key Features**:
  * **Interactive 2D Policy Matrix (32 Provisions $\times$ 7 Laws)**: Cross-mapping statutes against Freedom of Expression, Right to Privacy, and Freedom from Violence with a live inspector panel.
  * **Undefined Terms Highlighter**: Highlighting vague moralistic statutes (*"public morality"*, *"social harmony"*, *"decency"*).
  * **15 Court Case Studies (Judicial Explorer)**: Filterable by Convicted, Acquitted, and Pending court decisions.
  * **8 Systemic Statutory Flaws & 7 Policy Recommendations**.

### 3. Beyond Access: Women and Queer Persons with Disabilities Online (2020)
* **File**: `site/beyond-access.html`
* **Original PDF**: `uploads/Beyond-Access_BodyData_EROTICS-research-min_compressed.pdf` / `site/uploads/Beyond-Access_BodyData_EROTICS-research-min_compressed.pdf`
* **Key Features**:
  * **7-Layer Spectrum of Access Ladder**: From physical hardware ownership to household autonomy and safe digital spaces.
  * **Audre Lorde Erotic Reframing Matrix**: Interactive toggle reframing 12 daily digital activities through Lorde's feminist lens.
  * **4 Arenas of Policing & 6-Tier Violence Ladder**.
  * **Qualitative Voices Archive (23 Lived Testimonies) & 5-Sector Recommendations**.

---

## 🛠️ Architecture & Features

* **Dual-Depth Reading Engine**: Toggles between unabridged **Full Text Mode** and executive **Plain Summary Mode** with persistent `localStorage` state and URL hash routing (`#glance`, `?depth=summary`).
* **Dynamic Root Font Zoom ($A-$ / $A+$)**: Scalable from $0.8\times$ (12.8px) up to $1.45\times$ (23.2px) dynamically scaling all `rem`-based typography.
* **Accessible TOC Drawer**: Modal focus trapping (`Tab`/`Shift+Tab`), background scroll lock, and WCAG 1.4.13 compliant floating annotations.
* **Modular JSON Data Architecture (`site/data/`)**: Fully validated against `site/data/schemas/report.schema.json` for structured, non-technical content management.
* **Archival Print Stylesheet (`site/css/print.css`)**: Unrolls tabbed panels and details accordions for book-quality printing.

---

## 🚀 Running Locally

Serve the `site/` folder using Python's built-in HTTP server:

```bash
# Start local server on port 8080
python3 -m http.server 8080 --directory site
```

Then open in your browser:
* **Library Portal Gateway**: `http://localhost:8080/index.html`
* **Nepal's Biometric Present**: `http://localhost:8080/nepal-biometric-present.html`
* **Mapping Laws**: `http://localhost:8080/mapping-laws.html`
* **Beyond Access**: `http://localhost:8080/beyond-access.html`

---

## 📄 License & Attribution

Research and publications by **Body & Data** (Kathmandu, Nepal). Supported by Open Society Foundations (OSF), Vision for Change, and APC EROTICS / AmplifyChange.
