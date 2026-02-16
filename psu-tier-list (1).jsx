import { useState, useMemo } from "react";

const TIERS = {
  "A+": { color: "#00e5ff", bg: "rgba(0,229,255,0.08)", border: "rgba(0,229,255,0.35)", desc: "Elite — Extensive testing, best-in-class on every metric", recommend: "Enthusiast/high-end: RTX 5090, RX 9070 XT, RTX 4090, RX 7900 XTX" },
  "A":  { color: "#4ade80", bg: "rgba(74,222,128,0.08)", border: "rgba(74,222,128,0.35)", desc: "Excellent — Fully meets all Tier A quality criteria", recommend: "High-end builds: RTX 4090, RX 7900 XT, RTX 4070 Ti, 3090" },
  "A-": { color: "#86efac", bg: "rgba(134,239,172,0.07)", border: "rgba(134,239,172,0.3)", desc: "Very Good — Minor demerits but otherwise A-tier quality", recommend: "High-end builds with minor caveats noted" },
  "B":  { color: "#facc15", bg: "rgba(250,204,21,0.07)", border: "rgba(250,204,21,0.3)", desc: "Good — Solid mid-range, no major issues", recommend: "Mid-range: RTX 4060 Ti, RX 7800 XT, RTX 3070, RX 6800" },
  "B-": { color: "#fde68a", bg: "rgba(253,230,138,0.07)", border: "rgba(253,230,138,0.25)", desc: "Decent — Minor issues; acceptable for mid-range use", recommend: "Mid-range builds with caveats" },
  "C":  { color: "#fb923c", bg: "rgba(251,146,60,0.07)", border: "rgba(251,146,60,0.3)", desc: "Acceptable — Budget builds only; compromises in quality", recommend: "Budget: RTX 3060, RX 6600, GTX 1080, 5700 XT" },
  "C-": { color: "#fca5a5", bg: "rgba(252,165,165,0.07)", border: "rgba(252,165,165,0.25)", desc: "Below Average — Notable deficiencies; use with caution", recommend: "Light office/home use only" },
  "D":  { color: "#f87171", bg: "rgba(248,113,113,0.07)", border: "rgba(248,113,113,0.3)", desc: "Poor — Office/integrated graphics use only", recommend: "No dedicated GPU" },
  "E":  { color: "#ef4444", bg: "rgba(239,68,68,0.07)", border: "rgba(239,68,68,0.3)", desc: "Not Recommended — Do not use in any gaming system", recommend: "Not recommended for any build" },
  "F":  { color: "#7f1d1d", bg: "rgba(127,29,29,0.1)", border: "rgba(127,29,29,0.4)", desc: "Avoid — Dangerous or completely unacceptable quality", recommend: "AVOID — potential fire/damage risk" },
};

const ALL_TIERS = ["A+","A","A-","B","B-","C","C-","D","E","F"];

const PSU_DATA = [
  // A+
  { brand:"ADATA XPG", model:"Core Reactor II 650/750/850W", wattages:"650–850W", tier:"A+", atx:"ATX 3.0", year:2023, form:"ATX" },
  { brand:"ADATA XPG", model:"Core Reactor II 1000/1200W", wattages:"1000–1200W", tier:"A+", atx:"ATX 3.0", year:2023, form:"ATX" },
  { brand:"ADATA XPG", model:"Core Reactor 650/750/850W", wattages:"650–850W", tier:"A+", atx:"ATX 2.x", year:2019, form:"ATX" },
  { brand:"ADATA XPG", model:"Cybercore II 1000/1300W", wattages:"1000–1300W", tier:"A+", atx:"ATX 3.0", year:2023, form:"ATX" },
  { brand:"ADATA XPG", model:"Cybercore 1000/1300W", wattages:"1000–1300W", tier:"A+", atx:"ATX 2.x", year:2022, form:"ATX" },
  { brand:"ADATA XPG", model:"Fusion 1600W", wattages:"1600W", tier:"A+", atx:"ATX 3.0", year:2023, form:"ATX" },
  { brand:"ASRock", model:"Taichi 1300/1650W", wattages:"1300–1650W", tier:"A+", atx:"ATX 3.1", year:2024, form:"ATX" },
  { brand:"be quiet!", model:"Dark Power Pro 11 550–1200W", wattages:"550–1200W", tier:"A+", atx:"ATX 2.x", year:2015, form:"ATX" },
  { brand:"be quiet!", model:"Dark Power Pro 12 1200/1500W", wattages:"1200–1500W", tier:"A+", atx:"ATX 2.x", year:2020, form:"ATX" },
  { brand:"be quiet!", model:"Dark Power Pro 13 1300/1600W", wattages:"1300–1600W", tier:"A+", atx:"ATX 3.1", year:2023, form:"ATX" },
  { brand:"Chieftec", model:"PowerPlay Gold 550–750W", wattages:"550–750W", tier:"A+", atx:"ATX 2.x", year:2020, form:"ATX" },
  { brand:"Chieftec", model:"PowerPlay Platinum 850–1200W", wattages:"850–1200W", tier:"A+", atx:"ATX 2.x", year:2020, form:"ATX" },
  { brand:"Cooler Master", model:"V Vanguard Gold V2 550–850W", wattages:"550–850W", tier:"A+", atx:"ATX 2.x", year:2020, form:"ATX" },
  { brand:"Cooler Master", model:"V Vanguard Gold i Multi ATX 3.0", wattages:"550–850W", tier:"A+", atx:"ATX 3.0", year:2023, form:"ATX" },
  { brand:"Cooler Master", model:"XG Platinum 650/750/850W", wattages:"650–850W", tier:"A+", atx:"ATX 2.x", year:2021, form:"ATX" },
  { brand:"Cooler Master", model:"XG Plus Platinum 650/750/850W", wattages:"650–850W", tier:"A+", atx:"ATX 2.x", year:2021, form:"ATX" },
  { brand:"Cooler Master", model:"X Silent Edge Platinum 850W (NA)", wattages:"850W", tier:"A+", atx:"ATX 3.1", year:2024, form:"ATX" },
  { brand:"Cooler Master", model:"X Silent Edge Platinum 1100W (Global)", wattages:"1100W", tier:"A+", atx:"ATX 3.1", year:2024, form:"ATX" },
  { brand:"Cooler Master", model:"X Silent MAX Platinum 1300W", wattages:"1300W", tier:"A+", atx:"ATX 3.1", year:2024, form:"ATX" },
  { brand:"Corsair", model:"AX Grey Label 850/1000W", wattages:"850–1000W", tier:"A+", atx:"ATX 2.x", year:2018, form:"ATX" },
  { brand:"Corsair", model:"AX-i Grey Label 1600W", wattages:"1600W", tier:"A+", atx:"ATX 2.x", year:2018, form:"ATX" },
  { brand:"Corsair", model:"HX 2017 750–1200W", wattages:"750–1200W", tier:"A+", atx:"ATX 2.x", year:2018, form:"ATX" },
  { brand:"Corsair", model:"HX-i 2023 1000/1200/1500W", wattages:"1000–1500W", tier:"A+", atx:"ATX 3.0", year:2023, form:"ATX" },
  { brand:"Corsair", model:"HX-i 2020 1000/1500W", wattages:"1000–1500W", tier:"A+", atx:"ATX 2.x", year:2022, form:"ATX" },
  { brand:"Corsair", model:"RM-i 650W", wattages:"650W", tier:"A+", atx:"ATX 2.x", year:2015, form:"ATX" },
  { brand:"Corsair", model:"RM-i 750/850/1000W", wattages:"750–1000W", tier:"A+", atx:"ATX 2.x", year:2015, form:"ATX" },
  { brand:"Corsair", model:"RM-x 2015 Black 550–1000W", wattages:"550–1000W", tier:"A+", atx:"ATX 2.x", year:2015, form:"ATX" },
  { brand:"Corsair", model:"RM-x 2021 650/750/850/1000W", wattages:"650–1000W", tier:"A+", atx:"ATX 2.x", year:2021, form:"ATX" },
  { brand:"Corsair", model:"RM-x 2024 ATX 3.1 750/850/1000W", wattages:"750–1000W", tier:"A+", atx:"ATX 3.1", year:2024, form:"ATX" },
  { brand:"Corsair", model:"RMx Shift 750–1200W", wattages:"750–1200W", tier:"A+", atx:"ATX 3.0", year:2023, form:"ATX" },
  { brand:"Corsair", model:"SuperNOVA 750–1600W", wattages:"750–1600W", tier:"A+", atx:"ATX 2.x", year:2016, form:"ATX" },
  { brand:"DeepCool", model:"PX G 850/1000/1200W", wattages:"850–1200W", tier:"A+", atx:"ATX 3.0", year:2023, form:"ATX" },
  { brand:"EVGA", model:"SuperNOVA G6 850/1000W", wattages:"850–1000W", tier:"A+", atx:"ATX 2.x", year:2021, form:"ATX" },
  { brand:"EVGA", model:"SuperNOVA G7 650–1000W", wattages:"650–1000W", tier:"A+", atx:"ATX 2.x", year:2022, form:"ATX" },
  { brand:"EVGA", model:"SuperNOVA P6 850/1000W", wattages:"850–1000W", tier:"A+", atx:"ATX 2.x", year:2021, form:"ATX" },
  { brand:"FSP", model:"Hydro PTM Pro ATX 3.0 850–1200W", wattages:"850–1200W", tier:"A+", atx:"ATX 3.0", year:2022, form:"ATX" },
  { brand:"FSP", model:"Hydro PTM Pro ATX 3.1 1350/1650W", wattages:"1350–1650W", tier:"A+", atx:"ATX 3.1", year:2023, form:"ATX" },
  { brand:"FSP", model:"Hydro PTM X Pro ATX 3.0 850–1200W", wattages:"850–1200W", tier:"A+", atx:"ATX 3.0", year:2023, form:"ATX" },
  { brand:"FSP", model:"Hydro Ti Pro 850/1000W", wattages:"850–1000W", tier:"A+", atx:"ATX 3.0", year:2023, form:"ATX" },
  { brand:"Montech", model:"Titan Gold 720–1200W", wattages:"720–1200W", tier:"A+", atx:"ATX 3.1", year:2024, form:"ATX" },
  { brand:"MSI", model:"MEG Ai-P PCIE5 1000/1300W", wattages:"1000–1300W", tier:"A+", atx:"ATX 2.x", year:2022, form:"ATX" },
  { brand:"Seasonic", model:"Prime TX Titanium 650–1000W", wattages:"650–1000W", tier:"A+", atx:"ATX 2.x", year:2021, form:"ATX" },
  { brand:"Seasonic", model:"Prime PX Platinum 650–1300W", wattages:"650–1300W", tier:"A+", atx:"ATX 2.x", year:2021, form:"ATX" },
  { brand:"Seasonic", model:"Prime GX Gold 650–1000W", wattages:"650–1000W", tier:"A+", atx:"ATX 2.x", year:2021, form:"ATX" },
  { brand:"Seasonic", model:"Focus GX ATX 3.0 750–1000W", wattages:"750–1000W", tier:"A+", atx:"ATX 3.0", year:2023, form:"ATX" },
  { brand:"Seasonic", model:"Focus PX ATX 3.0 750–1000W", wattages:"750–1000W", tier:"A+", atx:"ATX 3.0", year:2023, form:"ATX" },
  { brand:"Super Flower", model:"Leadex Ti Platinum Pro 850–1600W", wattages:"850–1600W", tier:"A+", atx:"ATX 2.x", year:2022, form:"ATX" },
  { brand:"Super Flower", model:"Leadex V Gold Pro ATX 3.0 850–1000W", wattages:"850–1000W", tier:"A+", atx:"ATX 3.0", year:2023, form:"ATX" },

  // A
  { brand:"1st Player", model:"NDGP Platinum ATX 3.1 1000/1300W", wattages:"1000–1300W", tier:"A", atx:"ATX 3.1", year:2024, form:"ATX" },
  { brand:"ADATA XPG", model:"Core Reactor II VE 650/760/850W", wattages:"650–850W", tier:"A", atx:"ATX 3.1", year:2024, form:"ATX" },
  { brand:"Antec", model:"HCG Gold 650/750/850W", wattages:"650–850W", tier:"A", atx:"ATX 2.x", year:2018, form:"ATX" },
  { brand:"Antec", model:"HCG Extreme 850/1000W", wattages:"850–1000W", tier:"A", atx:"ATX 2.x", year:2018, form:"ATX" },
  { brand:"Antec", model:"HCG Pro Platinum 850–1200W", wattages:"850–1200W", tier:"A", atx:"ATX 3.1", year:2024, form:"ATX" },
  { brand:"Antec", model:"Neo Eco Gold Modular ATX 3.0 850–1300W", wattages:"850–1300W", tier:"A", atx:"ATX 3.0", year:2023, form:"ATX" },
  { brand:"ASRock", model:"Phantom Gaming 750/850/1000W", wattages:"750–1000W", tier:"A", atx:"ATX 3.1", year:2024, form:"ATX" },
  { brand:"ASRock", model:"Phantom Gaming 1300/1600W", wattages:"1300–1600W", tier:"A", atx:"ATX 3.1", year:2024, form:"ATX" },
  { brand:"ASUS", model:"ROG Loki Platinum 720–1200W", wattages:"720–1200W", tier:"A", atx:"ATX 3.0", year:2022, form:"SFX" },
  { brand:"ASUS", model:"ROG THOR Platinum II 850/1000/1200W", wattages:"850–1200W", tier:"A", atx:"ATX 3.0", year:2023, form:"ATX" },
  { brand:"ASUS", model:"ROG THOR Platinum 850W", wattages:"850W", tier:"A", atx:"ATX 2.x", year:2018, form:"ATX" },
  { brand:"ASUS", model:"ROG Strix Platinum 1000W", wattages:"1000W", tier:"A", atx:"ATX 3.1", year:2024, form:"ATX" },
  { brand:"be quiet!", model:"Dark Power 12 750/850/1000W", wattages:"750–1000W", tier:"A", atx:"ATX 2.x", year:2021, form:"ATX" },
  { brand:"be quiet!", model:"Dark Power 13 750/850/1000W", wattages:"750–1000W", tier:"A", atx:"ATX 3.0", year:2023, form:"ATX" },
  { brand:"be quiet!", model:"Pure Power 11 FM 850/1000W", wattages:"850–1000W", tier:"A", atx:"ATX 2.x", year:2018, form:"ATX" },
  { brand:"be quiet!", model:"Pure Power 12M 550–1200W", wattages:"550–1200W", tier:"A", atx:"ATX 3.0", year:2023, form:"ATX" },
  { brand:"be quiet!", model:"Straight Power 11 450–1200W", wattages:"450–1200W", tier:"A", atx:"ATX 2.x", year:2018, form:"ATX" },
  { brand:"Bitfenix", model:"BFG Gold ATX 3.0 1000/1200W", wattages:"1000–1200W", tier:"A", atx:"ATX 3.0", year:2023, form:"ATX" },
  { brand:"Bitfenix", model:"Formula Gold 450–750W", wattages:"450–750W", tier:"A", atx:"ATX 2.x", year:2017, form:"ATX" },
  { brand:"Bitfenix", model:"Whisper M 450–850W", wattages:"450–850W", tier:"A", atx:"ATX 2.x", year:2016, form:"ATX" },
  { brand:"Cooler Master", model:"V Vanguard Gold SFX ATX 3.1 750/850W", wattages:"750–850W", tier:"A", atx:"ATX 3.1", year:2024, form:"SFX" },
  { brand:"Cooler Master", model:"V Vanguard Platinum Standard 850–1300W", wattages:"850–1300W", tier:"A", atx:"ATX 2.x", year:2019, form:"ATX" },
  { brand:"Cooler Master", model:"M2000 Platinum 2000W", wattages:"2000W", tier:"A", atx:"ATX 2.x", year:2022, form:"ATX" },
  { brand:"Corsair", model:"HX-i 2013 750–1200W", wattages:"750–1200W", tier:"A", atx:"ATX 2.x", year:2013, form:"ATX" },
  { brand:"Corsair", model:"RM-x 2018 v2 550–850W", wattages:"550–850W", tier:"A", atx:"ATX 2.x", year:2018, form:"ATX" },
  { brand:"Corsair", model:"SF Gold 450/600W", wattages:"450–600W", tier:"A", atx:"ATX 2.x", year:2016, form:"SFX" },
  { brand:"Corsair", model:"SF Platinum 2024 ATX 3.1 750/850/1000W", wattages:"750–1000W", tier:"A", atx:"ATX 3.1", year:2024, form:"SFX" },
  { brand:"Corsair", model:"SF-L 850/1000W", wattages:"850–1000W", tier:"A", atx:"ATX 3.0", year:2023, form:"SFX-L" },
  { brand:"Corsair", model:"TX-m 2021 550/650/750W", wattages:"550–750W", tier:"A", atx:"ATX 2.x", year:2021, form:"ATX" },
  { brand:"Cougar", model:"GX-F 550/650/750W", wattages:"550–750W", tier:"A", atx:"ATX 2.x", year:2018, form:"ATX" },
  { brand:"Cougar", model:"Polar X2 ATX 3.0 1050/1200W", wattages:"1050–1200W", tier:"A", atx:"ATX 3.0", year:2023, form:"ATX" },
  { brand:"DeepCool", model:"PQ-M 650–1000W", wattages:"650–1000W", tier:"A", atx:"ATX 2.x", year:2021, form:"ATX" },
  { brand:"DeepCool", model:"PX P 1000/1300W", wattages:"1000–1300W", tier:"A", atx:"ATX 3.0", year:2023, form:"ATX" },
  { brand:"Enermax", model:"Revolution ATX 3.0 1000/1200W", wattages:"1000–1200W", tier:"A", atx:"ATX 3.0", year:2023, form:"ATX" },
  { brand:"Enermax", model:"PlatiGemini 1200W", wattages:"1200W", tier:"A", atx:"ATX 3.1", year:2024, form:"ATX" },
  { brand:"EVGA", model:"SuperNOVA G2 550–1600W", wattages:"550–1600W", tier:"A", atx:"ATX 2.x", year:2014, form:"ATX" },
  { brand:"EVGA", model:"SuperNOVA G6 650/750W", wattages:"650–750W", tier:"A", atx:"ATX 2.x", year:2021, form:"ATX" },
  { brand:"EVGA", model:"SuperNOVA P2 650–1600W", wattages:"650–1600W", tier:"A", atx:"ATX 2.x", year:2016, form:"ATX" },
  { brand:"EVGA", model:"SuperNOVA P6 650/750W", wattages:"650–750W", tier:"A", atx:"ATX 2.x", year:2021, form:"ATX" },
  { brand:"Fractal", model:"Ion Platinum Plus 560–860W", wattages:"560–860W", tier:"A", atx:"ATX 2.x", year:2019, form:"ATX" },
  { brand:"Fractal", model:"Ion Platinum Plus 2 560–860W", wattages:"560–860W", tier:"A", atx:"ATX 2.x", year:2021, form:"ATX" },
  { brand:"FSP", model:"Hydro G Pro 850–1000W", wattages:"850–1000W", tier:"A", atx:"ATX 2.x", year:2019, form:"ATX" },
  { brand:"FSP", model:"Hydro G Pro ATX 3.0 850–1200W", wattages:"850–1200W", tier:"A", atx:"ATX 3.0", year:2022, form:"ATX" },
  { brand:"FSP", model:"Hydro GT Pro ATX 3.0 850/1000W", wattages:"850–1000W", tier:"A", atx:"ATX 3.0", year:2022, form:"ATX" },
  { brand:"FSP", model:"Mega Ti 1350/1650W", wattages:"1350–1650W", tier:"A", atx:"ATX 3.1", year:2025, form:"ATX" },
  { brand:"Galax", model:"Hall of Fame 850/1000/1300W", wattages:"850–1300W", tier:"A", atx:"ATX 3.0", year:2023, form:"ATX" },
  { brand:"High Power", model:"Super GD 3.0 1000/1300W", wattages:"1000–1300W", tier:"A", atx:"ATX 3.0", year:2023, form:"ATX" },
  { brand:"Lian Li", model:"Edge EG Gold 720–1200W", wattages:"720–1200W", tier:"A", atx:"ATX 3.1", year:2024, form:"ATX" },
  { brand:"Lian Li", model:"Edge Platinum 850/1000/1300W", wattages:"850–1300W", tier:"A", atx:"ATX 3.1", year:2024, form:"ATX" },
  { brand:"MSI", model:"MPG A-G PCIE5 750/850/1000W", wattages:"750–1000W", tier:"A", atx:"ATX 3.0", year:2022, form:"ATX" },
  { brand:"Seasonic", model:"Focus GX 650–1000W (pre-ATX3)", wattages:"650–1000W", tier:"A", atx:"ATX 2.x", year:2019, form:"ATX" },
  { brand:"Seasonic", model:"Focus SGX Gold SFX 500–650W", wattages:"500–650W", tier:"A", atx:"ATX 2.x", year:2020, form:"SFX" },
  { brand:"Thermaltake", model:"Toughpower GF3 ATX 3.0 750–1050W", wattages:"750–1050W", tier:"A", atx:"ATX 3.0", year:2023, form:"ATX" },
  { brand:"SilverStone", model:"Decathlon DA850 Gold ATX 3.0", wattages:"750–1000W", tier:"A", atx:"ATX 3.0", year:2023, form:"ATX" },

  // A-
  { brand:"1st Player", model:"NDGP Gold 750–850W ATX 3.x", wattages:"750–850W", tier:"A-", atx:"ATX 3.0", year:2024, form:"ATX" },
  { brand:"1st Player", model:"NDGP Platinum ATX 3.0 1000/1300W", wattages:"1000–1300W", tier:"A-", atx:"ATX 3.0", year:2023, form:"ATX" },
  { brand:"Aerocool", model:"Project 7 650–850W", wattages:"650–850W", tier:"A-", atx:"ATX 2.x", year:2017, form:"ATX" },
  { brand:"Antec", model:"Earthwatts Gold Pro 550/650/750W", wattages:"550–750W", tier:"A-", atx:"ATX 2.x", year:2018, form:"ATX" },
  { brand:"Antec", model:"Signature Platinum 1000/1300W", wattages:"1000–1300W", tier:"A-", atx:"ATX 2.x", year:2020, form:"ATX" },
  { brand:"ASUS", model:"ROG THOR Platinum 1200W", wattages:"1200W", tier:"A-", atx:"ATX 2.x", year:2018, form:"ATX" },
  { brand:"ASUS", model:"ROG Strix Aura Gold 750–1200W", wattages:"750–1200W", tier:"A-", atx:"ATX 3.0", year:2022, form:"ATX" },
  { brand:"ASUS", model:"ROG Strix Gold 550–850W", wattages:"550–850W", tier:"A-", atx:"ATX 2.x", year:2020, form:"ATX" },
  { brand:"Chieftec", model:"Atmos CPX-FC 750/850W ATX 3.x", wattages:"750–850W", tier:"A-", atx:"ATX 3.0", year:2023, form:"ATX" },
  { brand:"Cooler Master", model:"V Vanguard Platinum V2 1100/1300/1600W", wattages:"1100–1600W", tier:"A-", atx:"ATX 3.1", year:2024, form:"ATX" },
  { brand:"Corsair", model:"SF Platinum 2019 450/600/750W", wattages:"450–750W", tier:"A-", atx:"ATX 2.x", year:2019, form:"SFX" },
  { brand:"Cougar", model:"GX-F Aurum 550/650/750W", wattages:"550–750W", tier:"A-", atx:"ATX 2.x", year:2018, form:"ATX" },
  { brand:"DeepCool", model:"Gamer Storm DQ-M 650/750/850W", wattages:"650–850W", tier:"A-", atx:"ATX 2.x", year:2018, form:"ATX" },
  { brand:"DeepCool", model:"PQ-G 1000/1200W", wattages:"1000–1200W", tier:"A-", atx:"ATX 3.1", year:2024, form:"ATX" },
  { brand:"Enermax", model:"Revolution D.F. 650W", wattages:"650W", tier:"A-", atx:"ATX 2.x", year:2019, form:"ATX" },
  { brand:"Enermax", model:"Revolution D.F. 750/850W", wattages:"750–850W", tier:"A-", atx:"ATX 2.x", year:2019, form:"ATX" },
  { brand:"Enermax", model:"Revolution D.F. 12 750/850W", wattages:"750–850W", tier:"A-", atx:"ATX 2.x", year:2024, form:"ATX" },
  { brand:"EVGA", model:"SuperNOVA G3 550–1000W", wattages:"550–1000W", tier:"A-", atx:"ATX 2.x", year:2017, form:"ATX" },
  { brand:"Fractal", model:"Ion Gold 550–850W", wattages:"550–850W", tier:"A-", atx:"ATX 2.x", year:2021, form:"ATX" },
  { brand:"FSP", model:"Hydro PTM 550/650/750W", wattages:"550–750W", tier:"A-", atx:"ATX 2.x", year:2018, form:"ATX" },
  { brand:"FSP", model:"Hydro PTM Pro 850/1000/1200W", wattages:"850–1200W", tier:"A-", atx:"ATX 2.x", year:2020, form:"ATX" },
  { brand:"Montech", model:"Titan Platinum 750–1200W", wattages:"750–1200W", tier:"A-", atx:"ATX 3.1", year:2024, form:"ATX" },
  { brand:"Seasonic", model:"Focus Plus Gold/Platinum 550–850W", wattages:"550–850W", tier:"A-", atx:"ATX 2.x", year:2018, form:"ATX" },
  { brand:"Thermaltake", model:"Toughpower PF3 Platinum ATX 3.0 750–1350W", wattages:"750–1350W", tier:"A-", atx:"ATX 3.0", year:2023, form:"ATX" },

  // B
  { brand:"ASUS", model:"Prime Gold ATX 3.0 650–850W", wattages:"650–850W", tier:"B", atx:"ATX 3.0", year:2023, form:"ATX" },
  { brand:"be quiet!", model:"System Power 10 Gold 450–850W", wattages:"450–850W", tier:"B", atx:"ATX 2.x", year:2022, form:"ATX" },
  { brand:"Chieftec", model:"Atmos Gold ATX 3.0 650–850W", wattages:"650–850W", tier:"B", atx:"ATX 3.0", year:2023, form:"ATX" },
  { brand:"Cooler Master", model:"MWE Gold V2 Full Modular ATX 3.0", wattages:"650–1050W", tier:"B", atx:"ATX 3.0", year:2023, form:"ATX" },
  { brand:"Cooler Master", model:"MWE Gold V2 Non-Modular ATX 3.0", wattages:"650–1050W", tier:"B", atx:"ATX 3.0", year:2023, form:"ATX" },
  { brand:"Corsair", model:"CX-F RGB Gold 650–850W", wattages:"650–850W", tier:"B", atx:"ATX 3.0", year:2023, form:"ATX" },
  { brand:"EVGA", model:"SuperNOVA G5 Gold 650–1000W", wattages:"650–1000W", tier:"B", atx:"ATX 2.x", year:2020, form:"ATX" },
  { brand:"Gigabyte", model:"UD850GM PG5 ATX 3.0", wattages:"750–1000W", tier:"B", atx:"ATX 3.0", year:2023, form:"ATX" },
  { brand:"Seasonic", model:"S12III Bronze 500–700W", wattages:"500–700W", tier:"B", atx:"ATX 2.x", year:2019, form:"ATX" },
  { brand:"Thermaltake", model:"Toughpower GF1 Gold 650–1050W", wattages:"650–1050W", tier:"B", atx:"ATX 2.x", year:2020, form:"ATX" },

  // B-
  { brand:"Corsair", model:"CX750M Bronze", wattages:"550–750W", tier:"B-", atx:"ATX 2.x", year:2020, form:"ATX" },
  { brand:"EVGA", model:"BQ Bronze Semi-Modular 500–750W", wattages:"500–750W", tier:"B-", atx:"ATX 2.x", year:2019, form:"ATX" },
  { brand:"MSI", model:"MAG A850GL ATX 3.0", wattages:"650–850W", tier:"B-", atx:"ATX 3.0", year:2023, form:"ATX" },

  // C
  { brand:"be quiet!", model:"System Power 9 Bronze 300–700W", wattages:"300–700W", tier:"C", atx:"ATX 2.x", year:2019, form:"ATX" },
  { brand:"Cooler Master", model:"MWE Bronze V2 450–750W", wattages:"450–750W", tier:"C", atx:"ATX 2.x", year:2021, form:"ATX" },
  { brand:"Corsair", model:"CV Bronze 450–650W", wattages:"450–650W", tier:"C", atx:"ATX 2.x", year:2020, form:"ATX" },
  { brand:"EVGA", model:"W1 Standard 500–700W", wattages:"500–700W", tier:"C", atx:"ATX 2.x", year:2018, form:"ATX" },
  { brand:"MSI", model:"MEG Ai-T PCIE5 1600W", wattages:"1600W", tier:"C", atx:"ATX 3.0", year:2024, form:"ATX" },
  { brand:"Thermaltake", model:"Smart Bronze 430–700W", wattages:"430–700W", tier:"C", atx:"ATX 2.x", year:2019, form:"ATX" },

  // D
  { brand:"Cooler Master", model:"Elite V3 400–600W", wattages:"400–600W", tier:"D", atx:"ATX 2.x", year:2018, form:"ATX" },
  { brand:"Raidmax", model:"RX Bronze 500–700W", wattages:"500–700W", tier:"D", atx:"ATX 2.x", year:2019, form:"ATX" },
  { brand:"Thermaltake", model:"Litepower 450–650W", wattages:"450–650W", tier:"D", atx:"ATX 2.x", year:2018, form:"ATX" },

  // E / F
  { brand:"Apevia", model:"Any model", wattages:"Various", tier:"E", atx:"ATX 2.x", year:2020, form:"ATX" },
  { brand:"ARESGAME", model:"Any model", wattages:"Various", tier:"F", atx:"ATX 2.x", year:2020, form:"ATX" },
  { brand:"Diablotek", model:"Any model", wattages:"Various", tier:"F", atx:"ATX 2.x", year:2018, form:"ATX" },
  { brand:"Logisys", model:"Any model", wattages:"Various", tier:"F", atx:"ATX 2.x", year:2018, form:"ATX" },
];

const FORM_FACTORS = ["ATX","SFX","SFX-L"];

export default function PSUTierList() {
  const [search, setSearch] = useState("");
  const [selectedTiers, setSelectedTiers] = useState(["A+","A","A-"]);
  const [selectedATX, setSelectedATX] = useState([]);
  const [selectedForm, setSelectedForm] = useState([]);
  const [atx3Only, setAtx3Only] = useState(false);

  const toggleTier = (t) => setSelectedTiers(p => p.includes(t) ? p.filter(x=>x!==t) : [...p,t]);
  const toggleArr = (val,setter,cur) => setter(cur.includes(val) ? cur.filter(x=>x!==val) : [...cur,val]);

  const filtered = useMemo(() => PSU_DATA.filter(p => {
    if (selectedTiers.length && !selectedTiers.includes(p.tier)) return false;
    if (selectedATX.length && !selectedATX.includes(p.atx)) return false;
    if (selectedForm.length && !selectedForm.includes(p.form)) return false;
    if (atx3Only && p.atx === "ATX 2.x") return false;
    if (search) {
      const q = search.toLowerCase();
      if (!p.brand.toLowerCase().includes(q) && !p.model.toLowerCase().includes(q)) return false;
    }
    return true;
  }), [selectedTiers,selectedATX,selectedForm,atx3Only,search]);

  const groupedByTier = useMemo(() => {
    const g = {};
    ALL_TIERS.forEach(t => { const items = filtered.filter(p=>p.tier===t); if(items.length) g[t]=items; });
    return g;
  }, [filtered]);

  return (
    <div style={{ fontFamily:"'DM Mono','Fira Code',monospace", background:"#080810", minHeight:"100vh", color:"#e2e8f0" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Space+Grotesk:wght@600;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:5px}
        ::-webkit-scrollbar-thumb{background:#1e1e30;border-radius:3px}
        .chip{cursor:pointer;border-radius:3px;padding:4px 11px;font-size:11.5px;font-family:'DM Mono',monospace;font-weight:500;border:1px solid;transition:all .12s;user-select:none}
        .chip:hover{filter:brightness(1.25)}
        .tog{cursor:pointer;border-radius:3px;padding:4px 11px;font-size:11px;font-family:'DM Mono',monospace;border:1px solid #1e1e30;background:transparent;color:#4a5568;transition:all .12s;user-select:none}
        .tog.on{background:rgba(99,102,241,.12);border-color:rgba(99,102,241,.4);color:#a5b4fc}
        .tog:hover{border-color:#3d3d5c}
        .row:hover{background:rgba(255,255,255,.025)!important}
        input:focus{border-color:rgba(99,102,241,.5)!important;outline:none}
        .fade{animation:fd .18s ease}
        @keyframes fd{from{opacity:0;transform:translateY(3px)}to{opacity:1;transform:translateY(0)}}
      `}</style>

      {/* Header */}
      <div style={{ background:"#0b0b16", borderBottom:"1px solid #12122a", padding:"22px 22px 16px" }}>
        <div style={{ display:"flex", alignItems:"baseline", gap:"10px", marginBottom:"3px" }}>
          <span style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:"19px", fontWeight:"700", color:"#fff", letterSpacing:"-0.5px" }}>SPL PSU Tier List</span>
          <span style={{ fontSize:"10.5px", padding:"2px 7px", background:"rgba(99,102,241,.14)", border:"1px solid rgba(99,102,241,.3)", borderRadius:"3px", color:"#818cf8" }}>2025</span>
          <span style={{ fontSize:"10.5px", color:"#1e293b" }}>{PSU_DATA.length} units</span>
        </div>
        <div style={{ fontSize:"10.5px", color:"#1e3a5f" }}>By SPL (Sir ProvidenceLaw) · psutierlist.org · Not exhaustive — verify at official sheet before purchasing</div>

        <div style={{ marginTop:"14px" }}>
          <div style={{ fontSize:"9.5px", color:"#1e3a5f", letterSpacing:"1px", marginBottom:"6px" }}>TIER</div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:"5px" }}>
            {ALL_TIERS.map(t => {
              const c = TIERS[t]; const on = selectedTiers.includes(t);
              return <button key={t} className="chip" onClick={()=>toggleTier(t)} style={{ background:on?c.bg:"transparent", borderColor:on?c.border:"#1a1a2e", color:on?c.color:"#2d3748" }}>{t}</button>;
            })}
            <button className="chip" onClick={()=>setSelectedTiers(["A+","A","A-"])} style={{ background:"transparent", borderColor:"#1a1a2e", color:"#2d3748", fontSize:"10px" }}>top tiers</button>
            <button className="chip" onClick={()=>setSelectedTiers([...ALL_TIERS])} style={{ background:"transparent", borderColor:"#1a1a2e", color:"#2d3748", fontSize:"10px" }}>all</button>
            <button className="chip" onClick={()=>setSelectedTiers([])} style={{ background:"transparent", borderColor:"#1a1a2e", color:"#2d3748", fontSize:"10px" }}>none</button>
          </div>
        </div>

        <div style={{ marginTop:"11px", display:"flex", flexWrap:"wrap", gap:"16px" }}>
          <div>
            <div style={{ fontSize:"9.5px", color:"#1e3a5f", letterSpacing:"1px", marginBottom:"5px" }}>ATX SPEC</div>
            <div style={{ display:"flex", gap:"4px" }}>
              {["ATX 3.1","ATX 3.0","ATX 2.x"].map(v=>(
                <button key={v} className={`tog ${selectedATX.includes(v)?"on":""}`} onClick={()=>toggleArr(v,setSelectedATX,selectedATX)}>{v}</button>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontSize:"9.5px", color:"#1e3a5f", letterSpacing:"1px", marginBottom:"5px" }}>FORM FACTOR</div>
            <div style={{ display:"flex", gap:"4px" }}>
              {FORM_FACTORS.map(f=>(
                <button key={f} className={`tog ${selectedForm.includes(f)?"on":""}`} onClick={()=>toggleArr(f,setSelectedForm,selectedForm)}>{f}</button>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontSize:"9.5px", color:"#1e3a5f", letterSpacing:"1px", marginBottom:"5px" }}>QUICK</div>
            <button className={`tog ${atx3Only?"on":""}`} onClick={()=>setAtx3Only(!atx3Only)}>ATX 3.x only</button>
          </div>
        </div>

        <div style={{ marginTop:"11px", display:"flex", alignItems:"center", gap:"9px" }}>
          <input type="text" placeholder="Search brand or model…" value={search} onChange={e=>setSearch(e.target.value)}
            style={{ background:"#0d0d1a", border:"1px solid #1a1a2e", borderRadius:"4px", padding:"6px 11px", color:"#e2e8f0", fontSize:"12px", fontFamily:"'DM Mono',monospace", width:"230px" }}/>
          <span style={{ fontSize:"11px", color:"#1e3a5f" }}>{filtered.length} result{filtered.length!==1?"s":""}</span>
        </div>
      </div>

      {/* Legend */}
      <div style={{ padding:"10px 22px", background:"#090912", borderBottom:"1px solid #0e0e1c" }}>
        <div style={{ display:"flex", flexWrap:"wrap", gap:"5px" }}>
          {ALL_TIERS.map(t=>{
            const c=TIERS[t];
            return (
              <div key={t} style={{ padding:"4px 10px", background:c.bg, border:`1px solid ${c.border}`, borderRadius:"3px", fontSize:"10px" }}>
                <span style={{ color:c.color, fontWeight:"600" }}>{t}</span>
                <span style={{ color:"#334155", marginLeft:"6px" }}>{c.desc.split("—")[1]?.trim()}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Results */}
      <div style={{ padding:"16px 22px" }}>
        {Object.keys(groupedByTier).length===0 && (
          <div style={{ color:"#334155", textAlign:"center", padding:"48px", fontSize:"13px" }}>No units match your current filters.</div>
        )}
        {ALL_TIERS.filter(t=>groupedByTier[t]).map(tier=>{
          const c=TIERS[tier]; const units=groupedByTier[tier];
          return (
            <div key={tier} className="fade" style={{ marginBottom:"20px" }}>
              <div style={{ display:"flex", alignItems:"center", gap:"11px", padding:"8px 12px", background:c.bg, border:`1px solid ${c.border}`, borderRadius:"5px 5px 0 0" }}>
                <span style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:"17px", fontWeight:"700", color:c.color, minWidth:"30px" }}>{tier}</span>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:"11.5px", color:"#94a3b8" }}>{c.desc}</div>
                  <div style={{ fontSize:"10px", color:"#334155", marginTop:"1px" }}>{c.recommend}</div>
                </div>
                <span style={{ fontSize:"10.5px", color:"#1e3a5f", whiteSpace:"nowrap" }}>{units.length} unit{units.length!==1?"s":""}</span>
              </div>
              <div style={{ border:`1px solid ${c.border}`, borderTop:"none", borderRadius:"0 0 5px 5px", overflow:"hidden" }}>
                <div style={{ display:"grid", gridTemplateColumns:"145px 1fr 105px 75px 65px", background:"#09090f", padding:"5px 12px", fontSize:"9.5px", color:"#1e3a5f", letterSpacing:"0.8px", borderBottom:"1px solid #0d0d1c" }}>
                  <span>BRAND</span><span>MODEL</span><span>WATTAGES</span><span>ATX SPEC</span><span>FORM</span>
                </div>
                {units.map((p,i)=>(
                  <div key={i} className="row" style={{ display:"grid", gridTemplateColumns:"145px 1fr 105px 75px 65px", padding:"7px 12px", borderBottom:i<units.length-1?"1px solid #0c0c1a":"none", fontSize:"11.5px", alignItems:"center", background:i%2===0?"transparent":"rgba(255,255,255,.007)" }}>
                    <span style={{ color:"#475569", fontWeight:"500" }}>{p.brand}</span>
                    <span style={{ color:"#b8c4d0" }}>{p.model}</span>
                    <span style={{ color:"#334155", fontSize:"10.5px" }}>{p.wattages}</span>
                    <span style={{ fontSize:"10.5px", color:p.atx==="ATX 3.1"?"#00e5ff":p.atx==="ATX 3.0"?"#4ade80":"#2d3748", fontWeight:p.atx!=="ATX 2.x"?"500":"400" }}>{p.atx}</span>
                    <span style={{ fontSize:"10.5px", color:p.form==="ATX"?"#334155":p.form==="SFX"?"#818cf8":"#60a5fa" }}>{p.form}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ padding:"12px 22px", borderTop:"1px solid #0c0c1a", fontSize:"10px", color:"#1a2a3a", display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:"5px" }}>
        <span>Source: SPL's PSU Tier List · psutierlist.org · esportstales.com · Data current as of 2025</span>
        <span>Always cross-reference the live sheet before purchasing</span>
      </div>
    </div>
  );
}
