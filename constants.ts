import { PricePoint, Accessory, ProductSpec } from './types';

export const PRICE_HISTORY: PricePoint[] = [
  { date: '2021-05', price: 37 },
  { date: '2021-11', price: 25 },
  { date: '2022-05', price: 12 },
  { date: '2022-11', price: 12 },
  { date: '2023-05', price: 9 },
  { date: '2023-11', price: 16 },
  { date: '2024-05', price: 5 },
  { date: '2024-11', price: 7 },
  { date: '2025-11', price: 4 },
];

export const PRODUCT_SPECS: ProductSpec[] = [
  { label: '机芯型号', value: '057' },
  { label: '表盘尺寸', value: '22 x 29.5 mm' },
  { label: '表壳材质', value: '不锈钢' },
  { label: '防水深度', value: '30m' },
  { label: '发布年份', value: '2021' },
  { label: '表镜', value: '蓝宝石水晶玻璃' },
];

export const ACCESSORIES: Accessory[] = [
  { name: '证书', included: true, note: '特殊证书' },
  { name: '表盒', included: true },
  { name: '吊牌', included: true },
  { name: '白牌', included: true },
  { name: '表盖', included: true },
  { name: '额外表带', included: true, count: 2 },
  { name: '其他配件', included: true, note: '1个金属表扣' },
  { name: '缺少手表链节', included: false, count: 2 },
  { name: '特殊情况', included: true, note: '表面有划痕' },
];

export const RECOMMENDED_PRODUCTS = [
  { id: 1, name: 'Blancpain Villeret', price: 'MOP 88,000', img: 'https://picsum.photos/300/300?random=1' },
  { id: 2, name: 'Blancpain Quantieme', price: 'MOP 125,000', img: 'https://picsum.photos/300/300?random=2' },
  { id: 3, name: 'IWC Portofino', price: 'MOP 45,000', img: 'https://picsum.photos/300/300?random=3' },
  { id: 4, name: 'A. Lange & Söhne', price: 'MOP 210,000', img: 'https://picsum.photos/300/300?random=4' },
];
