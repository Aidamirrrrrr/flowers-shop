import { BRAND_NAME } from '../constants/brand'
import { PageHeader } from '../components/layout/PageHeader'

export function AboutPage() {
  return (
    <>
      <PageHeader title="О нас" largeLogo />

      <section className="about-section" id="about">
        <h2>{BRAND_NAME}</h2>
        <p>
          {BRAND_NAME} — студия флористики и сет-дизайна с доставкой по городу. Собираем букеты в день
          заказа из свежих цветов от проверенных поставщиков. Каждая композиция
          проходит контроль перед отправкой курьеру.
        </p>
      </section>

      <section className="about-section" id="delivery">
        <h2>Доставка и оплата</h2>
        <ul>
          <li>Доставка от 2 часов в пределах города</li>
          <li>Бесплатно при заказе от 5 000 ₽</li>
          <li>Оплата картой онлайн или наличными курьеру</li>
          <li>Фото букета перед отправкой — по запросу в чат</li>
        </ul>
      </section>

      <section className="about-section" id="care">
        <h2>Уход за цветами</h2>
        <p>
          Срезанные цветы любят прохладу и чистую воду. Меняйте воду каждые 2–3
          дня, обрезайте стебли и держите букет вдали от батарей и прямого
          солнца.
        </p>
        <p>
          На карточке каждого товара — персональные рекомендации по уходу за
          конкретной композицией.
        </p>
      </section>

      <section className="about-section">
        <h2>Контакты</h2>
        <p>Ежедневно с 9:00 до 21:00</p>
        <p>+7 (900) 000-00-00 · hello@elementconcept.ru</p>
      </section>
    </>
  )
}
