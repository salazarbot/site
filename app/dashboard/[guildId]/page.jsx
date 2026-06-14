import Header from "@/components/Header";
import styles from "./page.module.css";
import Settings from "@/components/Settings";

export async function generateMetadata({ params }) {
  const { guildId } = await params;
  
  const guild = await fetch(`/api/discord/guild?id=${guildId}`).then((res) => res.json());

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