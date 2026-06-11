import {
  BRAND_NAME,
  BUSINESS_HOURS_LABEL,
  BUSINESS_PHONE,
  BUSINESS_PHONE_HREF,
} from '../constants/brand'
import { PageHeader } from '../components/layout/PageHeader'

const sectionClass = 'mb-6'
const headingClass = 'mb-2.5 text-xs font-medium uppercase tracking-widest'
const textClass = 'mb-2 text-[0.95rem] text-muted-foreground'
const listClass = 'list-disc space-y-1.5 pl-5 text-[0.95rem] text-muted-foreground'

export function AboutPage() {
  return (
    <>
      <PageHeader title="О нас" largeLogo />

      <section className={sectionClass} id="about">
        <h2 className={headingClass}>{BRAND_NAME}</h2>
        <p className={textClass}>
          {BRAND_NAME} — студия флористики и сет-дизайна с доставкой по городу. Собираем букеты в день
          заказа из свежих цветов от проверенных поставщиков. Каждая композиция
          проходит контроль перед отправкой курьеру.
        </p>
      </section>

      <section className={sectionClass} id="delivery">
        <h2 className={headingClass}>Доставка и оплата</h2>
        <ul className={listClass}>
          <li>Доставка от 2 часов в пределах города</li>
          <li>Бесплатно при заказе от 5 000 ₽</li>
          <li>Оплата картой онлайн или наличными курьеру</li>
          <li>Фото букета перед отправкой — по запросу в чат</li>
        </ul>
      </section>

      <section className={sectionClass} id="care">
        <h2 className={headingClass}>Уход за цветами</h2>
        <p className={textClass}>
          Срезанные цветы любят прохладу и чистую воду. Меняйте воду каждые 2–3
          дня, обрезайте стебли и держите букет вдали от батарей и прямого
          солнца.
        </p>
        <p className={textClass}>
          На карточке каждого товара — персональные рекомендации по уходу за
          конкретной композицией.
        </p>
      </section>

      <section className={sectionClass}>
        <h2 className={headingClass}>Контакты</h2>
        <p className={textClass}>{BUSINESS_HOURS_LABEL}</p>
        <p className={textClass}>
          Рабочий номер:{' '}
          <a href={BUSINESS_PHONE_HREF} className="text-foreground underline-offset-4 hover:underline">
            {BUSINESS_PHONE}
          </a>
        </p>
      </section>
    </>
  )
}
