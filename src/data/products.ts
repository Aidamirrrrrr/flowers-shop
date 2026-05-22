export type ProductCategory = 'all' | 'roses' | 'mix' | 'premium'

export type Product = {
  id: string
  name: string
  price: number
  image: string
  category: Exclude<ProductCategory, 'all'>
  description: string
  careTips: string
}

export const CATEGORIES: { id: ProductCategory; label: string }[] = [
  { id: 'all', label: 'Все' },
  { id: 'roses', label: 'Розы' },
  { id: 'mix', label: 'Миксы' },
  { id: 'premium', label: 'Премиум' },
]

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Букет «Нежность»',
    price: 4590,
    image:
      'https://i.pinimg.com/736x/f3/3b/40/f33b40433fb4e3e112eb78ccc79422d2.jpg',
    category: 'mix',
    description:
      'Розы пыльно-розового оттенка и белая эустома в матовой полупрозрачной упаковке. Нежный подарок на свидание или день рождения.',
    careTips:
      'Срежьте стебли под водой, меняйте воду каждые 2 дня. Держите вдали от прямого солнца и сквозняков.',
  },
  {
    id: '2',
    name: 'Кремовые розы с эвкалиптом',
    price: 5290,
    image:
      'https://i.pinimg.com/736x/88/9f/23/889f231f1a80c9de73b8e7aa1c8509fd.jpg',
    category: 'roses',
    description:
      'Пышный букет кремовых и белых роз с ветками эвкалипта в розовой авторской упаковке. Классика в мягких пастельных тонах.',
    careTips:
      'Обрежьте стебли под углом 45°. Добавьте подкормку для срезанных цветов — букет простоит дольше.',
  },
  {
    id: '3',
    name: 'Белая альстромерия',
    price: 3890,
    image:
      'https://i.pinimg.com/736x/2f/ba/8d/2fba8d0e32a70b3f0f70e1a7a122840d.jpg',
    category: 'mix',
    description:
      'Свежий монобукет из белых альстромерий в воздушной матовой упаковке. Лаконично, стильно, подходит на каждый день.',
    careTips:
      'Меняйте воду каждые 2–3 дня. Альстромерия любит прохладу — оптимально 18–20 °C.',
  },
  {
    id: '4',
    name: 'Облако розовых кустовых',
    price: 6490,
    image:
      'https://i.pinimg.com/736x/f0/a0/20/f0a020825b38cb03d8a560644ae0adbe.jpg',
    category: 'roses',
    description:
      'Объёмный букет из нежно-розовых кустовых роз в полупрозрачной упаковке с атласной лентой. Эффект «облака» из лепестков.',
    careTips:
      'Распыляйте бутоны водой раз в день. Не ставьте рядом с фруктами — этилен ускоряет увядание.',
  },
  {
    id: '5',
    name: 'Белая гармония',
    price: 5990,
    image:
      'https://i.pinimg.com/736x/32/46/c1/3246c172ab6d49d1e8a608a38ccd9ae1.jpg',
    category: 'premium',
    description:
      'Белые кустовые розы, гортензия и хризантемы в матовой упаковке с широкой атласной лентой. Для торжественного случая.',
    careTips:
      'Пересадите в вазу в течение 2 часов после доставки. Меняйте воду при первых признаках помутнения.',
  },
  {
    id: '6',
    name: 'Голубая мечта',
    price: 7290,
    image:
      'https://i.pinimg.com/736x/ca/e7/6c/cae76c0a55a5b844fa77344cc941b450.jpg',
    category: 'premium',
    description:
      'Голубая гортензия и кремовые розы в многослойной белой упаковке с воздушной лентой. Свежий и воздушный образ.',
    careTips:
      'Гортензия чувствительна к воде — используйте фильтрованную или отстоянную. Опрыскивайте бутоны.',
  },
  {
    id: '7',
    name: 'Коробка с ранункулюсами',
    price: 8490,
    image:
      'https://i.pinimg.com/736x/68/05/02/680502f14f133989a630f6989281496a.jpg',
    category: 'premium',
    description:
      'Пышные розовые ранункулюсы и маттиола в белой подарочной коробке. Премиальный формат без вазы.',
    careTips:
      'Коробку держите в прохладном месте. При желании аккуратно перенесите цветы в вазу с водой.',
  },
  {
    id: '8',
    name: 'Закатные кустовые розы',
    price: 7890,
    image:
      'https://i.pinimg.com/1200x/6b/2e/76/6b2e7628873f29a6d73ba66e20ec2bf3.jpg',
    category: 'premium',
    description:
      'Кустовые розы с градиентом от алых до персиковых лепестков в крафтовой упаковке. Яркий премиальный акцент.',
    careTips:
      'Доставляем в аквабоксе. Срежьте стебли и поставьте в чистую вазу с прохладной водой.',
  },
  {
    id: '9',
    name: 'Белые тюльпаны',
    price: 4990,
    image:
      'https://i.pinimg.com/1200x/53/e5/17/53e517e442f373ae2cfd1fb0bc130f46.jpg',
    category: 'mix',
    description:
      'Монобукет из свежих белых тюльпанов в объёмной белой упаковке. Минимализм и чистые линии.',
    careTips:
      'Тюльпаны продолжают расти в вазе — подрезайте стебли каждые 2 дня. Вода должна быть холодной.',
  },
  {
    id: '10',
    name: 'Красные розы 19 шт',
    price: 5490,
    image:
      'https://i.pinimg.com/736x/39/87/66/398766a01cffd4385e5c9dbf2b111376.jpg',
    category: 'roses',
    description:
      'Классический букет из бархатных красных роз на белом фоне. Признание без лишних слов.',
    careTips:
      'Обрежьте стебли под углом, меняйте воду каждые 2 дня. Держите подальше от батарей.',
  },
  {
    id: '11',
    name: 'Эустома розовая симфония',
    price: 4790,
    image:
      'https://i.pinimg.com/736x/83/60/8e/83608e0b006d5c58d5eef6b966123c5a.jpg',
    category: 'mix',
    description:
      'Объёмный букет белой и розовой эустомы в воздушной белой упаковке. Нежность и романтика в каждом лепестке.',
    careTips:
      'Эустома любит прохладу. Удаляйте увядшие листья у уровня воды.',
  },
  {
    id: '12',
    name: 'Розовое облако',
    price: 5690,
    image:
      'https://i.pinimg.com/736x/3e/8b/59/3e8b59f3035dd94b98647270e6de0972.jpg',
    category: 'mix',
    description:
      'Гортензии и кустовые розы в оттенках розового в многослойной белой упаковке. Солнечное и праздничное настроение.',
    careTips:
      'Опрыскивайте гортензию водой 1–2 раза в день. Меняйте воду каждые 2 дня.',
  },
  {
    id: '13',
    name: 'Персиковый рассвет',
    price: 6190,
    image:
      'https://i.pinimg.com/736x/6d/fe/d0/6dfed011b6e7f06b21c1a4770ee278f7.jpg',
    category: 'roses',
    description:
      'Персиковые розы и бордовые кустовые розы в крафте с винтажным подкладом и органзой. Авторская флористика.',
    careTips:
      'Не ставьте букет на сквозняк. При смене воды слегка подрежьте стебли.',
  },
  {
    id: '14',
    name: 'Корзина белых пионов',
    price: 12990,
    image:
      'https://i.pinimg.com/1200x/db/08/09/db0809c0cdeed0ab17c9a6e0dcc1d6ca.jpg',
    category: 'premium',
    description:
      'Роскошная корзина с белыми пионами — пышный полусферический монобукет. Для особого торжества.',
    careTips:
      'Пионы раскрываются в тепле. Держите корзину в прохладном месте до вручения.',
  },
  {
    id: '15',
    name: 'Романтик XL',
    price: 8990,
    image:
      'https://i.pinimg.com/1200x/79/b1/2a/79b12a4ef5bf17a584ec76818248cb65.jpg',
    category: 'premium',
    description:
      'Максимальный букет из нежно-розовых кустовых роз в матовой упаковке с атласной лентой. Впечатляющий масштаб.',
    careTips:
      'Из-за объёма меняйте воду чаще — каждые 1–2 дня. Используйте высокую вазу.',
  },
]

export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id)
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0,
  }).format(price)
}
