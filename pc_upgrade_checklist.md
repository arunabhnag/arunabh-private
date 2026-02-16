# PC Upgrade Checklist — PSU + GPU Swap
**System:** Cooler Master H500 Mesh | Asus TUF X570 | Ryzen 3700X | Deepcool Captain 240 AIO

## Upgrade Summary
| Component | Out | In |
|---|---|---|
| PSU | EVGA 700GD | NZXT C850 Gold Core |
| GPU | Sapphire 5700XT Nitro+ | Sapphire 9070XT Nitro+ |

## Known Quirks & Notes
> - RAM is intentionally running at **2133 MT/s** (rated 3200) due to an unresolved EXPO/IMC/socket issue — this is expected and will **not** be addressed during this upgrade
> - BIOS is already on **latest stable** — do not flash beta updates
> - The 160GB HDD is being retired — back up its contents **before build day**
> - The 9070XT Nitro+ uses **2x 6-pin PCIe** connectors (not 8-pin)
> - **Never mix modular cables between PSU brands** — use only the NZXT-included cables

---

## Pre-Build Day

### Back Up & Data
- [ ] Copy all data from 160GB HDD → 1TB Barracuda
- [ ] Verify backup completed and files are accessible on the Barracuda

### Software Prep
- [ ] Download **AMD Radeon Software** (GPU driver) from [amd.com](https://www.amd.com) and save locally
- [ ] Download **AMD Chipset Drivers** from [amd.com](https://www.amd.com) and save locally
- [ ] Download **DDU (Display Driver Uninstaller)** from [wagnardsoft.com](https://www.wagnardsoft.com)
- [ ] Create a **Windows Restore Point** → Search: *"Create a restore point"* → Create
- [ ] Back up any other important data to external drive or cloud

### Clean GPU Driver Removal (Pre-Build)
> ⚠️ **Disconnect from the internet before running DDU** — Windows Update will automatically push a generic driver in the window between DDU wiping the old one and you installing the new one. Stay offline until the new Radeon Software is fully installed.

- [ ] **Disconnect from the internet** (unplug ethernet / disable Wi-Fi)
- [ ] Boot into **Safe Mode**: Settings → Recovery → Advanced Startup → Troubleshoot → Advanced Options → Startup Settings → Restart → **F4**
- [ ] Run DDU → *"Clean and restart"* for AMD/GPU
- [ ] Windows reboots to generic Microsoft display driver — low-res display is expected and normal

---

## Build Day — Step 1: PSU Swap

> Do the PSU first and confirm the system still POSTs **before** touching the GPU.

### Teardown
- [ ] Shut down fully and flip the PSU switch to **OFF** (rear of case)
- [ ] Unplug the AC power cord from the wall
- [ ] Wait **30 seconds** for capacitors to discharge
- [ ] Remove the left glass panel and right back panel
- [ ] 📸 **Take a photo of all current cable routing** before unplugging anything
- [ ] Unplug all cables from the EVGA 700GD: 24-pin, CPU 4+4, PCIe to GPU, SATA to both HDDs
- [ ] Remove the PSU shroud (thumbscrews)
- [ ] Unscrew the 4 PSU mounting screws from the rear panel
- [ ] Slide the EVGA 700GD out

### Install NZXT C850 Gold Core
- [ ] Slide the C850 in with **fan facing DOWN** (toward bottom mesh vent), power socket facing rear
- [ ] Secure with the 4 included screws
- [ ] Reattach PSU shroud
- [ ] Connect cables using **only the NZXT-included cables**:
  - [ ] 24-pin ATX → motherboard
  - [ ] 4+4 EPS → top of motherboard (CPU power)
  - [ ] SATA power → 1TB Barracuda
  - [ ] SATA power → 160GB HDD *(if not yet discarded)*
  - [ ] PCIe cable → 5700XT *(temporary — leave 9070XT cable staged but unconnected)*
- [ ] Route cables behind the back panel

### PSU Confirmation Boot
- [ ] Reattach panels, plug AC cord in, flip PSU switch ON
- [ ] Power on — confirm system **POSTs and boots into Windows**
- [ ] Confirm both HDDs appear in File Explorer
- [ ] Shut back down and flip PSU switch **OFF** before continuing

---

## Build Day — Step 2: GPU Swap

### Optional — Reapply Thermal Paste on CPU
> ⚙️ **Only do this if you found the thermal compound.** Skip entirely if not.

- [ ] Unplug the AIO pump and fan headers to give yourself slack
- [ ] Unscrew the Deepcool Captain 240 cold plate from the CPU mount
- [ ] Clean old paste off CPU IHS and cold plate with **90%+ isopropyl alcohol** and a lint-free cloth — let dry fully
- [ ] Apply a small **pea-sized dot** of compound to the center of the CPU IHS
- [ ] Remount the cold plate, tighten in a **cross pattern** — firm but don't overtighten
- [ ] Reconnect pump and fan headers

### Remove 5700XT
- [ ] Unplug the PCIe power connector(s) from the 5700XT
- [ ] Unscrew the GPU bracket screw(s) at the rear of the case
- [ ] Press the **PCIe x16 slot retention clip** and carefully pull the 5700XT out
- [ ] Set aside safely

### Install 9070XT Nitro+
- [ ] Slot the 9070XT Nitro+ firmly into the PCIe x16 slot until the **retention clip clicks**
- [ ] Secure the rear bracket screw(s)
- [ ] Connect **2x 6-pin PCIe** connectors — use a dedicated cable run from the PSU rather than daisy-chaining both off one cable
- [ ] Reattach side panels
- [ ] Plug AC cord in, flip PSU switch ON

---

## Build Day — Step 3: BIOS

- [ ] Power on and enter BIOS — press **Delete** at POST screen
- [ ] Confirm RAM is still at **2133 MT/s** — no action needed, just verify it hasn't reset
- [ ] Confirm boot drive is still **first in boot priority**
- [ ] Confirm PCIe slot is set to **Gen 4** (should be default on X570, worth verifying)
- [ ] ~~Flash BIOS~~ — already on latest stable, skip
- [ ] Save and Exit — **F10**

---

## Build Day — Step 4: Drivers & Windows

> ⚠️ **Stay disconnected from the internet** until the new Radeon Software is fully installed.

- [ ] Boot into Windows — generic display driver active, low-res is normal
- [ ] Run **DDU** once more if you want an extra-clean slate (Safe Mode, same process as pre-build)
- [ ] Install **AMD Radeon Software** from the locally saved installer
- [ ] Reboot when prompted
- [ ] **Reconnect to the internet**
- [ ] Install **AMD Chipset Drivers**
- [ ] Open **Windows Update** → Check for updates → install everything including optional updates
- [ ] Reboot again

---

## Post-Install Verification

- [ ] Open **Radeon Software** — confirm 9070XT Nitro+ detected with **16GB VRAM**
- [ ] Open **Device Manager** — no yellow exclamation marks anywhere
- [ ] Run **GPU-Z** — confirm **PCIe 4.0 x16** link speed under load
- [ ] Run a ~20 min stress test (**Furmark** or a demanding game) and monitor temps with **HWiNFO64**
- [ ] Confirm AIO pump and fans are still spinning (visible in HWiNFO or BIOS hardware monitor)
- [ ] Confirm 1TB Barracuda is healthy and all backed-up files are intact in File Explorer
- [ ] If 160GB HDD is still physically installed — unplug SATA power + data cable, unscrew from drive bay, set aside for disposal

---

## Parked for Later (Post-Upgrade)

- [ ] Investigate RAM speed issue (RAM / MB socket / CPU IMC) — revisit once GPU upgrade is stable and confirmed
- [ ] Dispose of / repurpose the 160GB HDD once backup is verified
- [ ] Safely store or sell the 5700XT Nitro+ and EVGA 700GD
