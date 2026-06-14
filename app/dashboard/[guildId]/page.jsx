import Header from "@/components/Header";
import styles from "./page.module.css";
import Settings from "@/components/Settings";

export async function generateMetadata({ params }) {
  const { guildId } = await params;
  
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  const guild = await fetch(`${baseUrl}/api/discord/guild?id=${guildId}`).then((res) => res.json());

  return {
    title: `Dashboard de ${guild.name}`,
    description: `Configurações e informações do servidor ${guild.name} no Salazar.`,
    openGraph: {
      images: [guild.iconUrl],
    },
  };
}

export default async function Dashboard({ params }) {
  const { guildId } = await params;

  return (
    <div className={styles.body}>
      <Header />
      <Settings guildId={guildId} />
    </div>
  );
}