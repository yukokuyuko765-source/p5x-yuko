export interface BuffOption {
  id: string;
  name: string;
  value: number;
  description: string;
}

export const allyDamageBuffs: BuffOption[] = [
  {
    id: "buff1",
    name: "攻撃力上昇（小）",
    value: 10,
    description: "攻撃力10%上昇",
  },
  {
    id: "buff2",
    name: "攻撃力上昇（中）",
    value: 20,
    description: "攻撃力20%上昇",
  },
  {
    id: "buff3",
    name: "攻撃力上昇（大）",
    value: 30,
    description: "攻撃力30%上昇",
  },
  {
    id: "buff4",
    name: "クリティカル強化",
    value: 15,
    description: "クリティカル時15%増加",
  },
  {
    id: "buff5",
    name: "弱点特化",
    value: 25,
    description: "弱点属性時25%増加",
  },
  {
    id: "buff6",
    name: "連続攻撃強化",
    value: 12,
    description: "連続攻撃時12%増加",
  },
];

export const enemyDamageDebuffs: BuffOption[] = [
  {
    id: "debuff1",
    name: "防御力低下（小）",
    value: 8,
    description: "敵防御力8%低下",
  },
  {
    id: "debuff2",
    name: "防御力低下（中）",
    value: 15,
    description: "敵防御力15%低下",
  },
  {
    id: "debuff3",
    name: "防御力低下（大）",
    value: 25,
    description: "敵防御力25%低下",
  },
  {
    id: "debuff4",
    name: "脆弱化",
    value: 20,
    description: "被ダメージ20%増加",
  },
  {
    id: "debuff5",
    name: "属性耐性低下",
    value: 18,
    description: "属性耐性18%低下",
  },
  {
    id: "debuff6",
    name: "状態異常強化",
    value: 22,
    description: "状態異常時22%増加",
  },
];

export const attributeMultipliers: BuffOption[] = [
  { id: "attr1", name: "火属性強化", value: 35, description: "火属性35%増加" },
  { id: "attr2", name: "水属性強化", value: 35, description: "水属性35%増加" },
  { id: "attr3", name: "風属性強化", value: 35, description: "風属性35%増加" },
  { id: "attr4", name: "土属性強化", value: 35, description: "土属性35%増加" },
  { id: "attr5", name: "光属性強化", value: 40, description: "光属性40%増加" },
  { id: "attr6", name: "闇属性強化", value: 40, description: "闇属性40%増加" },
];
