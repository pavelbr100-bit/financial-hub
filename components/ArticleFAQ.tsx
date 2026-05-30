export interface FAQItem {
  q: string
  a: string
}

export default function ArticleFAQ({ items }: { items: FAQItem[] }) {
  return (
    <div className="space-y-6">
      {items.map((item, i) => (
        <div key={i}>
          <h3 className="font-semibold text-slate-800 mb-1">{item.q}</h3>
          <p className="text-slate-600 text-sm leading-relaxed">{item.a}</p>
        </div>
      ))}
    </div>
  )
}
