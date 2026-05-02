import Shell from '@/components/next/Shell';

export default function ChatbotPage() {
  return (
    <Shell>
      <section className="card">
        <h1>Chatbot</h1>
        <p>
          Keep this page as a client component for live chat interactions, while the page shell and metadata stay SSR.
        </p>
      </section>
    </Shell>
  );
}
