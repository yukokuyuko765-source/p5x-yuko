export interface DefenseOption {
  id: string;
  name: string;
  value: number;
  description: string;
}

export interface DefensePreset {
  id: string;
  name: string;
  defense: number;
  additionalDefenseCoeff: number;
  description: string;
}

export const defensePresets: DefensePreset[] = [
  {
    id: "weak",
    name: "弱い敵",
    defense: 100,
    additionalDefenseCoeff: 0,
    description: "防御力100, 追加防御係数0%",
  },
  {
    id: "normal",
    name: "通常敵",
    defense: 300,
    additionalDefenseCoeff: 10,
    description: "防御力300, 追加防御係数10%",
  },
  {
    id: "strong",
    name: "強い敵",
    defense: 600,
    additionalDefenseCoeff: 25,
    description: "防御力600, 追加防御係数25%",
  },
  {
    id: "boss",
    name: "ボス敵",
    defense: 1000,
    additionalDefenseCoeff: 50,
    description: "防御力1000, 追加防御係数50%",
  },
  {
    id: "superboss",
    name: "超ボス",
    defense: 1500,
    additionalDefenseCoeff: 80,
    description: "防御力1500, 追加防御係数80%",
  },
];

export const penetrationOptions: DefenseOption[] = [
  { id: "pen1", name: "貫通強化（小）", value: 15, description: "貫通15%増加" },
  { id: "pen2", name: "貫通強化（中）", value: 25, description: "貫通25%増加" },
  { id: "pen3", name: "貫通強化（大）", value: 40, description: "貫通40%増加" },
  { id: "pen4", name: "完全貫通", value: 60, description: "貫通60%増加" },
  {
    id: "pen5",
    name: "弱点特化貫通",
    value: 35,
    description: "弱点時貫通35%増加",
  },
];

export const defenseDebuffOptions: DefenseOption[] = [
  {
    id: "debuff1",
    name: "防御力低下（小）",
    value: 20,
    description: "防御力20%低下",
  },
  {
    id: "debuff2",
    name: "防御力低下（中）",
    value: 35,
    description: "防御力35%低下",
  },
  {
    id: "debuff3",
    name: "防御力低下（大）",
    value: 50,
    description: "防御力50%低下",
  },
  { id: "debuff4", name: "脆弱化", value: 30, description: "防御力30%低下" },
  { id: "debuff5", name: "完全破壊", value: 70, description: "防御力70%低下" },
];
