type FaqItem = {
  question: string;
  answer: string;
};

export default function FaqList({ items }: { items: readonly FaqItem[] }) {
  return (
    <div className="ws-faq">
      {items.map((item) => (
        <details key={item.question}>
          <summary>{item.question}</summary>
          <p>{item.answer}</p>
        </details>
      ))}
    </div>
  );
}
